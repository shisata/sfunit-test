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

socket.emit("create map");
setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('shoot', shoot);
  socket.emit('spawn', enemies);
}, 1000 / 60);

  var canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 600;
  // canvas.cursor = "none"; //hide the original cursor

  window.addEventListener('mousemove', function (e) {
    xPos = e.pageX;
    yPos = e.pageY;
  })

  var context = canvas.getContext('2d');
  socket.on('state', function(players, projectiles, enemies, mapData) {
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

    for (var id in enemies) {

      var enemy = enemies[id];
      //Determines how the bullets look
      context.beginPath();
      context.arc(enemy.x, enemy.y, 6, 0, 2 * Math.PI);
      context.fillStyle = 'red';
      context.fill();
    }


    //shows only wall now.
    context.fillStyle = "#B3B3B3"
    for (var i = 0; i < mapData[0].length; i++) {
      context.beginPath();
      console.log(mapData[0][0].x);
      context.rect(mapData[0][0].x, mapData[0][0].y, mapData[0][0].width,
        mapData[0][0].height);
      context.fill();
    }

  });

  // Fazal' Workstation -------------------------------------------------------------------------
  // var enemyContext = canvas.getContext('2d');
  // socket.on('enemyState', function(enemies) {
  //   context.clearRect(0, 0, 800, 600);
  //   context.fillStyle = 'red';
  //   for (var id in enemies) {
  //     var enemy = enemies[id];
  //     //Determines how the characters look
  //     context.beginPath();
  //     context.arc(enemy, enemy, 10, 0, 2 * Math.PI);
  //     context.fill();
  //   }
  // });

  // get a refrence to the canvas and its context
// var canvas = document.getElementById("canvas");
// var context = canvas.getContext("2d");

// newly spawned objects start at Y=25
// var spawnLineY = 25;

// // spawn a new object every 1500ms
// var spawnRate = 1500;

// // set how fast the objects will fall
// var spawnRateOfDescent = 0.50;

// // when was the last object spawned
// var lastSpawn = -1;

// // this array holds all spawned object
// // var objects = [];
// var enemies = {
//   numEnemies: 0
// }

// save the starting time (used to calc elapsed time)
// var startTime = Date.now();

// // start animating
// animate();

// var enemyID = 0;

// function spawnRandomObject() {

//     // select a random type for this new object
//     var t;

    // About Math.random()
    // Math.random() generates a semi-random number
    // between 0-1. So to randomly decide if the next object
    // will be A or B, we say if the random# is 0-.49 we
    // create A and if the random# is .50-1.00 we create B

//     if (Math.random() < 0.50) {
//         t = "red";
//     } else {
//         t = "blue";
//     }

//     // create the new object
//     var enemy = {
//         // set this objects type
//         type: t,
//         // set x randomly but at least 15px off the canvas edges
//         x: Math.random() * (canvas.width - 30) + 15,
//         // set y to start on the line where objects are spawned
//         y: spawnLineY,
//     }

//     // add the new object to the objects[] array
//     enemies[enemyID] = enemy;
//     enemyID++;
// }

// spawnRandomObject();

// function animate() {

//     // get the elapsed time
//     var time = Date.now();

    // // see if its time to spawn a new object
    // if (time > (lastSpawn + spawnRate)) {
    //     lastSpawn = time;
    //     spawnRandomObject();
    // }

//     // request another animation frame
//     requestAnimationFrame(animate);

//     // clear the canvas so all objects can be
//     // redrawn in new positions
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     // draw the line where new objects are spawned
//     context.beginPath();
//     context.moveTo(0, spawnLineY);
//     context.lineTo(canvas.width, spawnLineY);
//     context.stroke();

//     // move each object down the canvas
//     for (var i = 0; i < objects.length; i++) {
//         var object = objects[i];
//         object.y += spawnRateOfDescent;
//         context.beginPath();
//         context.arc(object.x, object.y, 8, 0, Math.PI * 2);
//         context.closePath();
//         context.fillStyle = object.type;
//         context.fill();
//     }

// }

// -----------------------------------------------------------------------
