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
});

app.use('/static', express.static(__dirname + '/static'));// Routing
//app.get('/', function(request, response) {
//  response.sendFile(path.join(__dirname, 'index.html'));
//});// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

//setting up default viewpath to views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Looking for static pages in public folder
app.use(express.static(path.join(__dirname, 'public')));

//Players object will contain all information about each player's position,
//health, etc.
var players = {
  numPlayers: 0  //Length will keep track of the number of players
};
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
    console.log(player.playerID)
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
  //Removes disconnected player
  socket.on('disconnect', function() {
    players[socket.id] = 0;
    players.numPlayers -= 1;
  });

//Collects client data at 60 events/second
});setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);


//=============================================================================
// Fazal Workspace





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

//=============================================================================


//=============================================================================
// Hailey Workpace


//=============================================================================




//=============================================================================
// Long Workpace


//login page
app.get('/', (req, res) =>
{
  res.render('pages/login');
});

app.get('/register', (req,res) =>
{
  res.render('pages/register');
});



//=============================================================================




//=============================================================================
// Josh Workpace


//=============================================================================
