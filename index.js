/* ============================CODE WRITING RULES==============================
 *
 * Our objective is to write CLEAN, well written code. Please follow these
 * basic guidelines:
 *
 *       1) Line width will be set to 80 chars. Lines of code longer than this
 *          will be divided up across multiple lines.
 *
 *          link to how to set character line rules in VSCODE:
 *          https://tinyurl.com/y2skbpbk
 *
 *       2) Variable naming will be in camelCase. Use good variable names.
 *
 *       3) DOCUMENT changes. If you refactor a line of code, document exactly
 *          what was done to change it, and initial/date the change.
 *
 *       4) Keep spacing consistent, such as indentations and parenthesis
 *          positioning.
 *
 *       5) Put a comment above EVERY function declaration describing its
 *          purpose.
 *
 * ==========================================================================*/


 //app designing

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);app.set('port', 5000);
//database
const { Pool } = require('pg')
var pool
pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
// app.use('/static', express.static(__dirname + '/static'));// Routing
// app.get('/', function(request, response) {
// response.sendFile(path.join(__dirname, 'index.html'));
// });// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

//setting up default viewpath to views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Looking for static files in public folder
app.use(express.static(path.join(__dirname, 'public')));

//Players object will contain all information about each player's position,
//health, etc.
var players = {
  numPlayers: 0  //Length will keep track of the number of players
};

//Projectiles object will keep track of active projectiles
var projectiles = {
  numProjectiles: 0,
}
var bulletCount = 0;

//Creates a new player
io.on('connection', function(socket) {
  socket.on('new player', function() {
    if (players.numPlayers < 4) {
      players.numPlayers += 1;
      players[socket.id] = {
        playerID: players.numPlayers,
        x: 300,
        y: 300,
        health: 4.33,
        level: 1,
        damage: 5,
        speed: 10
      };
    }
  });

  // Responds to a movement event
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};

    //For visualizing players ovject data
    // console.log(player)
    //Comment out above line if not needed

    //Modified the values here to reflect player speed - GG 2019.10.26 17:30
    if (data.left) {
      player.x -= player.speed;
    }
    if (data.up) {
      player.y -= player.speed;
    }
    if (data.right) {
      player.x += player.speed;
    }
    if (data.down) {
      player.y += player.speed;
    }
  });

  //Code block to respond to shooting
  socket.on('shoot', function(data) {
    if (data.shootBullet) {
      projectiles.numProjectiles++;

      mouseX = data.x;
      mouseY = data.y;
      playerX = players[socket.id].x;
      playerY = players[socket.id].y;

      dx = mouseX - playerX;
      dy = mouseY - playerY;
      theta = Math.atan(dx / dy);

      velX = 3 * Math.sin(theta);
      velY = 3 * Math.cos(theta);
      if (dy < 0) {
        velY *= -1;
        velX *= -1;
      }

      projectiles[bulletCount] = {
        x: players[socket.id].x,
        y: players[socket.id].y,
        vx: velX,
        vy: velY
      };
      bulletCount++;
    }
  });

  //Removes disconnected player
  socket.on('disconnect', function() {
    players[socket.id] = 0;
    players.numPlayers -= 1;
  });
  
//Collects client data at 60 events/second
});

setInterval(function() {
  io.sockets.emit('state', players);

  for (var id in projectiles) {
    projectiles[id].x += projectiles[id].vx;
    projectiles[id].y += projectiles[id].vy;
  }

  io.sockets.emit('projectileState', projectiles);
}, 1000 / 240);


//=============================================================================
// Fazal Workspace

//Function to return a vector from one point to the next
// Code is in ES6(a js framework)
// fx, fy is from coordinate
// tx, ty is to coordinate
// function getNormVec(fx, fy, tx, ty){
//   var x = tx - fx;  // get differance
//   var y = ty - fy;
//   var dist = Math.sqrt(x * x + y * y); // get the distance.
//   x /= dist;  // normalised difference
//   y /= dist;
//   return {x,y};
// }

// var myObj = {}
// var myTarget = {};
// var myBullet = {}
// myObj.x = 100;
// myObj.y = 100;
// myTarget.x = 1000
// myTarget.y = 1000

// var vecToTag = getNormVect(myObj.x, myObj.y, myTarget.x, myTarget.y);
// myBullet.nx = vecToTag.x; // set bullets direction vector
// myBullet.ny = vecToTag.y;
// myBullet.x = myObj.x; // set the bullet start position.
// myBullet.y = myObj.y;
// myBullet.speed = 5; // set speed 5 pixels per frame

// myBullet.x += myBullet.nx * myBullet.speed;
// myBullet.y += myBullet.ny * myBullet.speed;



    // for (i = 0; i < 100; i ++) {
    //   players[socket.id].x -= .2;
    //   players[socket.id].y -= .2;
    // }


    // projectiles.numProjectiles = bulletCount;
    // bulletCount += 1;
    // projectiles[bulletCount] = {
    //   x: 300,
    //   y: 300,
    //   projectileSpeed: 1
    // };
    // shot = projectiles[bulletCount];
    // while (shot.x < 1000 && shot.y < 1000) {
    //   shot.x += shot.projectileSpeed;
    //   shot.y += shot.projectileSpeed;
    //     // console.log("[" + data.x + ", " + data.y + "]");
    //   if (shot.x == 1000 || shot.y == 1000) {
    //     projectiles[bulletCount] = 0;
    //   }
    // }


  

  // var player = players[socket.id] || {};

  //   // Handles player damage - at health <= 0, player is removed
  //   if (data.shoot) {
  //     player.health -= .2;
  //     if (player.health <= 0) {
  //       players[socket.id] = 0;
  //       players.numPlayers -= 1;
  //     }
  //   }

//=============================================================================


//=============================================================================
// George Workpace

// var msg = io()
// msg.on('message', function(data) {
//   console.log(data)
// })

// setInterval(function() {
//   io.sockets.emit('message', players)
// }, 1000000);

// Testing git

// document.addEventListener('click', function(event) {
//     event.preventDefault();
//     actions.shootBullet = true;
//     actions.x = event.pageX;
//     actions.y = event.pageY;
//     // actions.shootBullet = false;
//     // this.removeEventListener('click');
// });


//=============================================================================


//=============================================================================
// Hailey Workpace



const fs = require('fs');
var mapDataFromFile = JSON.parse(fs.readFileSync('static/objects/testMap.json', 'utf8'));
var processor = require('./static/objects/jsonProcessor.js');
mapData = processor.constructFromData(mapDataFromFile);

console.log(JSON.stringify(mapData));



// processor.constructFromData(initialData);

//=============================================================================




//=============================================================================
// Long Workpace



//Parse URL-encoded bodies (sent by HTML form)
app.use(express.urlencoded({extended:false}));
//Parse JSON body( sent by API client)
app.use(express.json());

//home page
app.get('/', function(request, respond)
{
  respond.render('pages/login');
});

//sign-up page
app.get('/register', function(request,respond)
{
  respond.render('pages/register');
});

// //Login function
app.post('/', function(request, respond)
{
  var uname = request.body.username;
  var pw = request.body.password;
  var query ="Select password FROM account WHERE username='"+uname+"'";
  console.log(query);
  pool.query(query, function(error,results)
  {
    if (error)
      respond.send('Error');
    else
    {
      if (results.rows == '' || results.rows[0].password != String(pw))
        respond.send('Not existing')
      else if (results.rows[0].password == String(pw))
      {
        respond.render('/index.html');
      }
    }
  });
});

//=============================================================================




//=============================================================================
// Josh Workpace


//=============================================================================
