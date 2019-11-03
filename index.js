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
const fs = require('fs');
var app = express();
var server = http.Server(app);
var io = socketIO(server);app.set('port', 5000);
//database
const { Pool } = require('pg')
var pool
pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
app.use('/static', express.static(__dirname + '/static'));// Routing
app.get('/', function(request, response) {
response.sendFile(path.join(__dirname, 'index.html'));
});// Starts the server.
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
  numProjectiles: 0
}
var bulletCount = 0;

//Enemies
var enemies = {
  numEnemies: 0
}
enemyID = 0;

//Creates a new player
io.on('connection', function(socket) {

  var mapInfo = [[],[]]; // stores info of every grid tile

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
        speed: 8
      };
    }
  });

  // socket.on('create map', function(){
  //   var mapDataFromFile = JSON.parse(fs.readFileSync('static/objects/testMap.json', 'utf8'));
  //   var processor = require('./static/objects/jsonProcessor.js');
  //   var mapData = processor.constructFromData(mapDataFromFile);
  //   console.log(mapData);
  //    // console.log(JSON.stringify(mapData); ///****
  //   // // console.log(mapData.walls);
  // });

  // Responds to a movement event
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};

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

      velX = players[socket.id].speed * Math.sin(theta);
      velY = players[socket.id].speed * Math.cos(theta);
      if (dy < 0) {
        velY *= -1;
        velX *= -1;
      }

      projectiles[bulletCount] = {
        x: players[socket.id].x + (4 * velX),
        y: players[socket.id].y + (4 * velY),
        vx: velX,
        vy: velY
      };

      bulletCount++;
      //reset bullet count
      if (bulletCount > 100) {
        bulletCount = 0;
      }
    }
  });

  //Removes disconnected player
  socket.on('disconnect', function() {
    players[socket.id] = 0;
    players.numPlayers -= 1;
  });
//Collects client data at 60 events/second
});

// newly spawned objects start at Y=25
var spawnLineY = 25;

// spawn a new object every 1500ms
var spawnRate = 1500;

// set how fast the objects will fall
var spawnRateOfDescent = 0.50;

// when was the last object spawned
var lastSpawn = -1;

// save the starting time (used to calc elapsed time)
var startTime = Date.now();

//Spawn a random enemy
function spawnRandomObject() {

  // About Math.random()
  // Math.random() generates a semi-random number
  // between 0-1. So to randomly decide if the next object
  // will be A or B, we say if the random# is 0-.49 we
  // create A and if the random# is .50-1.00 we create B

  // add the new object to the objects[] array
  enemies[enemyID] = {
    // type: t,
    // set x randomly but at least 15px off the canvas edges
    x: Math.random() * 250,
    // set y to start on the line where objects are spawned
    y: Math.random() * 250
  }
  enemies.numEnemies++;
  enemyID++;
}

function generateEnemies() {

  // get the elapsed time
  var time = Date.now();

  // see if its time to spawn a new object
  if (time > (lastSpawn + spawnRate)) {
    lastSpawn = time;
    spawnRandomObject();
  }
}



setInterval(function() {

  //Projectile handler
  for (var id in projectiles) {
    projectiles[id].x += projectiles[id].vx;
    projectiles[id].y += projectiles[id].vy;
    if (projectiles[id].x > 1100 || projectiles[id].y > 1100) {
      projectiles[id].vx = 0;
      projectiles[id].vy = 0;
    }
  }
  //Collision handler
  for (var player in players) {
    for (var id in projectiles) {
      if ( (Math.abs(players[player].x - projectiles[id].x) < 2) &&
           (Math.abs(players[player].y - projectiles[id].y) < 2) ) {
        players[player].health -= 1;
        if (players[player].health < 0) {
          players[player] = 0;
          players.numPlayers -= 1;
        }
      }
    }
  }
  generateEnemies();
  // console.log(enemies);
  io.sockets.emit('state', players, projectiles, enemies, mapData);

}, 1000 / 120);


//=============================================================================
// Fazal Workspace

// // Enemy moves towards player while avoiding an obstacle
// // Calculate vector between player and target
// var toPlayerX = playerPosX - enemyPosX;
// var toPlayerY = playerPosY - enemyPosY;

// // Calculate vector between mouse and target
// var toMouseX = mousePosX - enemyPosX;
// var toMouseY = mousePosY - enemyPosY;

// // Calculate distance between player and enemy, mouse and enemy
// var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
// var toMouseLength = Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY);

// // Normalize vector player
// toPlayerX = toPlayerX / toPlayerLength;
// toPlayerY = toPlayerY / toPlayerLength;

// // Normalize vector mouse
// toMouseX = toMouseX / toMouseLength;
// toMouseY = toMouseY / toMouseLength;

// // Move enemy torwards player
// enemyPosX += toPlayerX * speed;
// enemyPosY += toPlayerY * speed;

// // Move enemy away from obstacle (a bit slower than towards player)
// enemyPosX -= toMouseX * (speed * 0.4);
// enemyPosY -= toMouseY * (speed * 0.4);

// --------------------------------------------------- partial implementation ends for enemy move to player

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

// var stageWidth = 1000;
// var stageHeight = 1000;

// var enemies = [];

// var enemyWidth = 50;
// var enemyHeight = 100;

// function spawnEnemy(){

//     //console.log('Spawn a new enemy!');

//     // Generate a random x position.
//     var randomXPosition = Math.floor(Math.random() * (stageWidth - enemyWidth)) + 1;

//     // Generate a random y position.
//     var randomYPosition = Math.floor(Math.random() * (stageHeight - enemyHeight)) + 1;

//     //Create a new Enemy instance and use above coordinates to place it in a random spot.
//     //Fill the rest of this object like we did with var bullet = {...}.
//     var newEnemy = {
//         xPosition: randomXPosition,
//         yPosition: randomYPosition,
//     };

//     // Push new enemy in the enemies array so we can render them all at once in the draw loop.
//     enemies.push(newEnemy);
// }



// //This function will run 'spawnEnemy()' every 'intervalInMilliSeconds'.
// setInterval(spawnEnemy);

// setInterval(function(){
//   io.sockets.emit('enemyState', enemies);
// }, 1000 / 120);

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
/*Guide to accessing map data:
1. Walls: objects that has x, y, width, height, texture.
2. Furnitures: objects that has names, x, y, direction.
3. Enemies, bullets, players: will think about this tomorrow

console.log( mapData.walls[2].x );
-->prints the x-axis of mapData's wall's 3rd element.

console.log(mapData.furnitures[4].name );
-->prints the x-axis of mapData's wall's 5th element.
*/


var mapDataFromFile = JSON.parse(fs.readFileSync('static/objects/testMap.json', 'utf8'));
var processor = require('./static/objects/jsonProcessor.js');
mapData = processor.constructFromData(mapDataFromFile);
console.log(JSON.stringify(mapData));




// processor.constructFromData(initialData);

//=============================================================================




//=============================================================================
// Long Workpace
/*
//home page
app.get('/', function(request, response)
{
  response.render('pages/login');
});
//Login function

app.post('/checkAccount', (request, response)=>{

  var uname = request.body.username;
  var pw = request.body.password;
  pool.query(
    'SELECT password FROM account WHERE username=$1',[uname], (error,results)=>{
      if (error)
      {
        throw(error);
      }
      var result = (results.rows == '') ? '':results.rows[0].password;
      if (result == String(pw))
      {
        response.render('pages/index');
      }
      else {
        var message ='Account is not existing';
        console.log(message)
        response.render('pages/login',message);
      }
    });
}); // check account info

//sign-up page
app.get('/register', function(request,response)
{
  response.render('pages/register');
});

app.post('/register', (request,response)=>{

  const uname = request.body.username;
  const pw = request.body.pw;
  const gmail = request.body.gmail;

  //Check username availability
  console.log('CHECKING USERNAME');
  var text = `SELECT * FROM account WHERE username='${uname}';`;
  pool.query(text,(error,results)=>{
    if (error){
      throw (error);
    }
    else {
      var result = {'rows': results.rows};
      if (result.rows.length !=0)
      {
        console.log('USERNAME IS USED');
        response.render('pages/register');
      }
      else {
        console.log('USERNAME CHECKED');

        //Check gmail availability
        console.log('CHECKING GMAIL');
        var text = `SELECT * FROM account WHERE gmail='${gmail}';`;
        pool.query(text,(error, results)=>{
          if (error){
            throw(error);
          }
          else {
            var result2 = {'rows': results.rows};
            if (result2.rows.length !=0)
            {
              console.log('GMAIL IS USED');
              response.render('pages/register');
            }
            else {
              console.log('GMAIL CHECKED');
              console.log('INSERTING...')
              var text = `INSERT INTO account (username, password, gmail)
                VALUES ('${uname}','${pw}','${gmail}');`;
              pool.query(text, (error, results) =>{
                if (error){
                  res.end(error);
                };
                console.log("INSERT ACCOUNT COMPLETED");
                response.end('Sign-up Completed');
              });
            };
          };
        });
      }
    };
  });


}); // create account
*/

//=============================================================================




//=============================================================================
// Josh Workpace



//=============================================================================
