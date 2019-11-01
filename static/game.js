var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

var movement = {
    up: false,
    down: false,
    left: false,
    right: false,
}
var shoot = {
    shootBullet: false,
    x: 0,
    y: 0
}

var xPos = 0;
var yPos = 0;

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
    case 32: // ' '
      shoot.shootBullet = true;
      shoot.x = xPos;
      shoot.y = yPos;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
    case 32: // ' '
      shoot.shootBullet = false;
      shoot.x = xPos;
      shoot.y = yPos;
      break;
  }
});

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('shoot', shoot);
}, 1000 / 60);

  var canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 600;
  // canvas.cursor = "none"; //hide the original cursor

  window.addEventListener('mousemove', function (e) {
    xPos = e.pageX;
    yPos = e.pageY;

    console.log(xPos)
  })

  var context = canvas.getContext('2d');
  socket.on('state', function(players, projectiles) {
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'green';
    for (var id in players) {
      var player = players[id];
      //Determines how the characters look
      context.beginPath();
      context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
      context.fill();
    }

    for (var id in projectiles) {
      var projectile = projectiles[id];
      //Determines how the bullets look
      context.beginPath();
      context.arc(projectile.x, projectile.y, 2, 0, 2 * Math.PI);
      context.fillStyle = 'black';
      context.fill();
    }
  });

  // socket.on('projectileState', function(projectiles) {
  //   for (var id in projectiles) {
  //     var projectile = projectiles[id];

      
  //     //Determines how the bullets look
  //     context.beginPath();
  //     context.arc(projectile.x, projectile.y, 2, 0, 2 * Math.PI);
  //     context.fillStyle = 'black';
  //     context.fill();
  //   }
  // });

