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

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

//Players object will contain position, health, etc. information about
//the players
var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300,
      health: 4.33
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};

    //For visualizing players ovject data
    console.log(players)

    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

//=============================================================================


// Fazal Space





//=============================================================================





//=============================================================================
// George Space

// var msg = io()
// msg.on('message', function(data) {
//   console.log(data)
// })

// setInterval(function() {
//   io.sockets.emit('message', players)
// }, 1000000);

//=============================================================================

