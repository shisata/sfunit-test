var socket = io();
socket.on('message', function(data) {
  // console.log(data);
});

//socket id of the client. players[myId] will return the specific player's data.
var myId = "";
socket.on("passId", function(id){
  console.log('socket passId called');
  console.log(id);
  if (myId == "") {
    myId = id;
  }
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
    y: 0,
    middleX: 0,
    middleY: 0
}

var xPos = 0;
var yPos = 0;
var GRID_SIZE; ///temporary variable

var mapImage = new Image();
mapImage.src = "";
var mapImageLoaded = false;
socket.on("deliverMapImageSrcToClient", function(imageSrc){
  // console.log('deliverMapImageSrcToClient called');
  if (!mapImageLoaded && imageSrc != "") {
    mapImage.src = imageSrc;
    mapImageLoaded = true;
  }
  //console.log('image source set to:', mapImage.src);
});

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
socket.on('grid-size', function(gridSize){
  GRID_SIZE = gridSize;
})
socket.emit('new player');

setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('shoot', shoot);
}, 1000 / 60);

  var canvas = document.getElementById('canvas');
  var startX = 0;
  var startY = 0;
  var canvasW = 1280;
  var canvasH = 720;
  canvas.width = canvasW;
  canvas.height = canvasH;
  // canvas.cursor = "none"; //hide the original cursor

window.addEventListener('mousemove', function (e) {
  xPos = e.pageX;
  yPos = e.pageY;
  // console.log(xPos);
  // console.log(yPos);
});

  var context = canvas.getContext('2d');
  socket.on('state', function(players, projectiles, enemies) {
    if (myId == "") {
      socket.emit('requestPassId');
      return;
    }
    if (mapImage.src == "") {
      socket.emit("requestMapImageSrcFromServer");
      return;
    }
    context.clearRect(startX, startY, canvasW, canvasW);

    var middleX = players[myId].x - (canvasW)/2;
    var middleY = players[myId].y - (canvasH)/2;
    shoot.middleX = middleX;
    shoot.middleY = middleY;

    //drawing the map from mapURL
    context.drawImage(mapImage, middleX, middleY,
      canvasW, canvasH, 0, 0, canvasW, canvasH);

    context.fillStyle = 'green';
    for (var id in players) {
      var player = players[id];
      //Determines how the characters look
      context.beginPath();
      context.arc(player.x - middleX, player.y - middleY, GRID_SIZE/2 , 0, 2 * Math.PI);
      context.fill();
    }

    for (var id in projectiles) {
      var projectile = projectiles[id];
      //Determines how the bullets look
      context.beginPath();
      context.arc(projectile.x - middleX, projectile.y - middleY, 2, 0, 2 * Math.PI);
      context.fillStyle = 'white';
      context.fill();
    }

    for (var id in enemies) {

      var enemy = enemies[id];
      //Determines how the bullets look // old radius = 6
      context.beginPath();
      context.arc(enemy.x - middleX, enemy.y - middleY, GRID_SIZE/2, 0, 2 * Math.PI);
      context.fillStyle = 'red';
      context.fill();
    }


  });


  socket.on("create map", function(mapData){
    processMapDrawing(mapData);
  });


// Support Functions ------------------------------------
function processMapDrawing(mapData){
  //called ONLY when numPlayers: 0 -> 1.
  //draws the whole canvas, and saves to images file.
  /*
  This creates the map to 'image', hence the collision control is separate
  this map. when there is a revision to map (e.g. door open)
  */
  //shows only wall now.
   // TODO: change this to variable, not constant literal!
  //const margin = 300;
  context.clearRect(startX, startY, canvasW, canvasH);
  /*
  aqImage = new Image();
  aqImage.src = '../image/aq.jpeg';
  aqImage.onload = function(){
    context.drawImage(aqImage, 0, 0);
  }*/

  for (var x = 0; x < mapData.length; x++) {
    var line = "";
    for (var y = 0; y < mapData[mapData.length - 1].length; y++){
      // console.log("\tMapdata[" + x + "][" + y + "]"); ////*****
      if(mapData[x][y] != '')
      {
        // var source = mapData[x][y].textureSrc;
        // console.log(source)
        // var pattern = ctx.createPattern(source, "repeat");
        context.beginPath();
        context.rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        context.fillStyle =" #B3B3B3";
        context.fill();
      }

      ////******
      if (mapData[x][y] == ''){
        line += "0";
      }else if(mapData[x][y].name == "wall"){
        line += "1";
      }else{
        line += "!";
      }
    }
    console.log(line);//////*****
  }
  console.log(mapData);/////*****
  mapImage.src = canvas.toDataURL();
  console.log('socket event create map called: URL set to', mapImage.src);/////*****
  socket.emit("deliverMapImageSrcToServer", mapImage.src);
}

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
