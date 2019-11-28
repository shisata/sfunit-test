//Getting username
var username = document.getElementById('username');
username = username.innerHTML;
var servername = document.getElementById('servername');
servername = servername.innerHTML;
var canvas = document.getElementById('canvas');

console.log(`Hello ${username}!`);
console.log(`Server ${servername}!`);

//these two messages are related to function 'showMessage'.
var messageOn = true;
var messageQueue = ["Welcome to S.F.U.! \nPress B to continue."
  , "S.F.U. stands for Special Fortification Unit."
  , "What? You mean, S.F.U. is Simon Fraser University?"
  , "Well, who cares about that Simon Fraser guy who \ndestroyed aboriginal culture?"
  , "Press W/A/S/D to move, B to see next message."
  , "Press M to turn on/off the map."
  , "Move mouse and click to shoot."
  , "And survive."
  , "What? You mean, we didn't talk about this kind of story \nin the meetings?"
  , "I know, I just wanted to put this in. -Hailey"
  , "If you are bored, you can go kill the enemies."
  , "And we have a cool weather feature on top right."
  , "Don't forget to turn on the music."
  , "Good luck, have fun!"];
var mapOn = true;

// dead.
var dead = false;
var deadMessage = ["We're looking for Co-op!\n\nHailey | Fall 2020 | haa40@sfu.ca   resume ready :D\nWrite you names here let's get a job"]

//zoneChange function related.
var zoneChangeOn = false;
var zoneChangeOnTime;
var zoneNum = 0;

var questMessageOn = false;
var questMessageOnTime;
var questName = "";
var questCondition = "";
var questDescription = "";

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
var action = {
  interaction: false,
  reload: false
}

var sound = {
  background: null,
  shoot: null,
  reload: null,
  hit: null
}

var xPos = 0;
var yPos = 0;
var GRID_SIZE = 10; ///temporary variable

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
    case 69: // E
      action.interaction = true;
      break;
    case 82: // R
      action.reload = true;
      break;
    case 66: // B
      if (messageQueue.length <= 0) {
        messageOn = false;
      }
      else {
        messageQueue.shift();
        if (messageQueue.length <= 0) {
          messageOn = false;
        }
      }
      break;
    case 77:
      mapOn = !mapOn;
      break;
  }
});

canvas.addEventListener('click', function(event) {
  var newAudio = sound.shoot.cloneNode()
  newAudio.play()
  shoot.shootBullet = true;
  shoot.x = xPos;
  shoot.y = yPos;
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
    case 69: // E
      action.interaction = false;
      break;
    case 82: // R
      var newAudio = sound.reload.cloneNode()
      newAudio.play()
      action.reload = false;
      break;
  }
});

function makeSound(sound){
  switch (sound) {
    case "shoot":
      sound.shoot.play();
      break;
    case "reload":
      sound.reload.play();
      break;
    break;
  }
}

function initSound(){
  // var audio = new Audio();
  // for(var aSound in sound){
  //   aSound = audio;
  // }
  sound.background = new Audio();
  sound.shoot = new Audio();
  sound.reload = new Audio();
  sound.hit = new Audio();
  sound.background.src = "";
  sound.shoot.src =  "../static/audio/9mm.mp3";
  sound.reload.src = "../static/audio/reload.mp3";
  sound.hit.src = "../static/audio/HITMARKER.mp3";
}
// socket.on('sound', function(sound){
//   makeSound(sound);
// });

socket.on('grid-size', function(gridSize){
  GRID_SIZE = gridSize;
})
newPlayerData = {"username" : username, "servername" : servername};
socket.emit('new player', username, servername);

setInterval(function() {
  socket.emit('movement', movement);
  socket.emit('shoot', shoot);
  socket.emit('interact', action);
  shoot.shootBullet = false;
  //makeSound("bang");
}, 1000 / 30);

  //Moved canvas var to top so shoot could use it - GG
  // var canvas = document.getElementById('canvas');
  var startX = 0;
  var startY = 0;
  var canvasW = 800;
  var canvasH = 600;
  canvas.width = canvasW;
  canvas.height = canvasH;
  // canvas.cursor = "none"; //hide the original cursor
  var lastLoop = new Date();  //this is used for getting fps

window.addEventListener('mousemove', function (e) {
  xPos = e.pageX;
  yPos = e.pageY;
  // console.log(xPos);
  // console.log(yPos);
});

  var context = canvas.getContext('2d');
  socket.on('state', function(players, projectiles, enemies, zones) {
    //console.log("socket event state called");
    if (players[myId] == 0) {
      //Died
      showDeadScreen();
      return;
    }
    if (myId == "") {
      socket.emit('requestPassId');
      return;
    }
    if (mapImage.src == "") {
      socket.emit("requestMapImageSrcFromServer");
      return;
    }
    context.clearRect(startX, startY, canvasW, canvasH);

    var middleX = players[myId].x - (canvasW)/2;
    var middleY = players[myId].y - (canvasH)/2;
    shoot.middleX = middleX;
    shoot.middleY = middleY;

    //'zoom' functionality. It's not done yet! Please just leave it =1..
    //It only works on map-drawing, NOT collision.
    var zoom = 1;

    //drawing the map from mapURL
    context.drawImage(mapImage, middleX, middleY,
      canvasW, canvasH, 0, 0, canvasW*zoom, canvasH*zoom);

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
      // context.drawImage('../public/image/George.jpeg', projectile.x - middleX, projectile.y - middleY,10,10);
      context.beginPath();
      context.arc(projectile.x - middleX, projectile.y - middleY, 2, 0, 2 * Math.PI);
      context.fillStyle = 'blue';
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

    context.fillStyle = "rgba(100, 100, 100, 0.3)";
    for (var id in zones) {
      var zone = zones[id];
      if (!zone.open) {
        context.beginPath();
        context.rect((zone.x*GRID_SIZE - middleX), (zone.y*GRID_SIZE - middleY), zone.width*GRID_SIZE, zone.height*GRID_SIZE);
        context.fill();
      }
    }

    context.font = "15px Arial";
    if(players[myId].clip) {
      context.fillStyle = "red";
      context.fillText("AMMO: " + players[myId].clip + "/" + players[myId].clipSize, canvasW-100, canvasH-70);
    }
    if(!players[myId].clip) {
      context.fillStyle = "red";
      context.fillText("RELOAD",  canvasW-70, canvasH-70);
    }

    var thisLoop = new Date();
    context.fillText(Math.round(1000 / (thisLoop - lastLoop)) + " FPS", canvasW-95, canvasH-10);
    lastLoop = thisLoop;

    //showing Player health/score/etc.
    var player = players[myId];
    context.fillStyle = "#BBB";
    context.beginPath();
    context.rect(10, 60, 80, 15);
    context.fill();
    context.fillStyle = "red";
    context.beginPath();
    context.rect(10, 60, (player.health/player.maxHealth)*80, 15);
    context.fill();

    var playerIndex = 1;
    for (var id in players) {
      if (id != myId && players[id] != 0 && players[id].health != undefined) {
        player = players[id];
        context.fillStyle = "#BBB";
        context.beginPath();
        context.rect(50+100*playerIndex, 40, 50, 10);
        context.fill();
        context.fillStyle = "red";
        context.beginPath();
        context.rect(50+100*playerIndex, 40, (player.health/player.maxHealth)*50, 10);
        context.fill();
        playerIndex += 1;
      }
    }


    // related to function 'showMessage'.
    if (messageOn && messageQueue.length >= 1) {
      context.fillStyle = "rgba(0, 0, 0, 0.7)";
      var zone = zones[id];
      context.beginPath();
      context.rect(20, 400, canvasW - 40, canvasH - 420);
      context.fill();
      context.fillStyle = "white";
      context.font = "25px Arial";
      var lines = messageQueue[0].split('\n');
      for (var i = 0; i<lines.length; i++) {
        context.fillText(lines[i], 40, 440 + i*35);
      }
    }

    //show small map!
    if (mapOn) {
      //hard-coded numbers.
      var mapX = 580;
      var mapY = 20;
      var mapMargin = 5;
      var mapWHRatio = 6/8;
      var smallMapWidth = 200;
      var smallMapHeight = smallMapWidth*mapWHRatio;

      var mapLeftCut = 0;
      var mapTopCut = 20*GRID_SIZE;
      var mapAreaWidth = 380*GRID_SIZE;
      var mapAreaHeight = mapAreaWidth*mapWHRatio;



      //drawing black box behind the map
      context.beginPath();
      context.rect(mapX-mapMargin, mapY-mapMargin, smallMapWidth+2*mapMargin,
        smallMapHeight+2*mapMargin);
      context.fillStyle = "black";
      context.fill();

      //drawing the small map
      context.drawImage(mapImage, mapLeftCut, mapTopCut,
        mapAreaWidth, mapAreaHeight,
        mapX, mapY, smallMapWidth, smallMapHeight);


      // white background for coordinates
      context.fillStyle = "rgba(255, 255, 255, 0.82)";
      context.beginPath();
      context.rect(mapX+3, mapY+smallMapHeight+8, smallMapWidth,
        smallMapHeight*(1/3));
      context.fill();
      //showing player and mouse coordinates.
      context.fillStyle = "blue";
      context.font = "15px Arial";
      context.fillText("Player: x: " + (players[myId].x/GRID_SIZE) + ", y: "
        + (players[myId].y/GRID_SIZE), mapX+10, mapY+smallMapHeight+30);
      context.fillText("Mouse: x: " + (xPos+middleX)/GRID_SIZE + ", y: "
        + (yPos+middleY)/GRID_SIZE, mapX+10, mapY+smallMapHeight+50);

      //show players on small map

      for (var id in players) {
        var player = players[id];
        context.fillStyle = 'green';
        if (id == myId) {
          context.fillStyle = '#BBAA22';
        }
        context.beginPath();
        context.arc(mapX+(player.x-mapLeftCut)*(smallMapWidth/mapAreaWidth),
          mapY+(player.y-mapTopCut)*(smallMapWidth/mapAreaWidth),
          GRID_SIZE/3 , 0, 2 * Math.PI);
        context.fill();
      }

    }

    //zone Change show
    if (zoneChangeOn) {
      var zoneElapse = new Date();
      var zoneboxY = 500;
      var boxLength = zones[zoneNum].description.length*13;
      if (zoneElapse - zoneChangeOnTime > 5000) {
        zoneChangeOn = false;
        context.fillStyle = `rgba(255, 255, 255, 0)`;
      }
      else if (zoneElapse - zoneChangeOnTime < 800) {
        context.fillStyle = `rgba(255, 50, 50, ${0.9*((zoneElapse - zoneChangeOnTime))/800})`;
        context.beginPath();
        context.rect(10, zoneboxY, boxLength, 85);
        context.fill();
        context.fillStyle = `rgba(255, 255, 255, ${0.9*((zoneElapse - zoneChangeOnTime))/800})`;
      }
      else if (zoneElapse - zoneChangeOnTime > 3000) {
        context.fillStyle = `rgba(255, 50, 50, ${0.9*(3000+2000-(zoneElapse - zoneChangeOnTime))/2000})`;
        context.beginPath();
        context.rect(10, zoneboxY, boxLength, 85);
        context.fill();
        context.fillStyle = `rgba(255, 255, 255, ${0.9*(3000+2000-(zoneElapse - zoneChangeOnTime))/2000})`;
      }
      else {
        context.fillStyle = "rgba(255, 50, 50, 0.9)";
        context.beginPath();
        context.rect(10, zoneboxY, boxLength, 85);
        context.fill();
        context.fillStyle = "rgba(255, 255, 255, 0.9)";
      }
      context.font = "italic 35px Arial";
      context.fillText("ENTER: "+zones[zoneNum].name, 50, zoneboxY+40);

      context.font = "italic 15px Arial";
      context.fillText("- " + zones[zoneNum].description, 40, zoneboxY+70);

      context.font = "normal";
    }

    //zone Change show
    if (questMessageOn) {
      var questElapse = new Date();
      var questboxY = 500;
      var boxLength = 700;
      if (questElapse - questMessageOnTime > 5000) {
        questMessageOn = false;
        context.fillStyle = `rgba(255, 255, 255, 0)`;
      }
      else if (questElapse - questMessageOnTime < 800) {
        context.fillStyle = `rgba(200, 180, 0, ${0.9*((questElapse - questMessageOnTime))/800})`;
        context.beginPath();
        context.rect(10, questboxY, boxLength, 85);
        context.fill();
        context.fillStyle = `rgba(255, 255, 255, ${0.9*((questElapse - questMessageOnTime))/800})`;
      }
      else if (questElapse - questMessageOnTime > 3000) {
        context.fillStyle = `rgba(200, 180, 0, ${0.9*(3000+2000-(questElapse - questMessageOnTime))/2000})`;
        context.beginPath();
        context.rect(10, questboxY, boxLength, 85);
        context.fill();
        context.fillStyle = `rgba(255, 255, 255, ${0.9*(3000+2000-(questElapse - questMessageOnTime))/2000})`;
      }
      else {
        context.fillStyle = "rgba(200, 180, 0, 0.9)";
        context.beginPath();
        context.rect(10, questboxY, boxLength, 85);
        context.fill();
        context.fillStyle = "rgba(255, 255, 255, 0.9)";
      }
      context.font = "italic 35px Arial";
      context.fillText("COMPLETE: "+questName, 50, questboxY+40);

      context.font = "italic 15px Arial";
      context.fillText("["+questCondition + "]   " + questDescription, 40, questboxY+70);

      context.font = "normal";
    }


    if (players[myId].health < players[myId].maxHealth) {
      context.fillStyle = `rgba(255, 0, 0,
        ${0.3*((players[myId].maxHealth-players[myId].health)/players[myId].maxHealth)})`;
        context.beginPath();
        context.rect(0, 0, canvasW, canvasH);
        context.fill();
    }
  });


  socket.on("create map", function(mapData){
    initSound();
    processMapDrawing(mapData);
  });


// Support Functions ------------------------------------
function processMapDrawing(mapData){
  console.log(mapData);
  //called ONLY when numPlayers: 0 -> 1.
  //draws the whole canvas, and saves to images file.
  /*
  This creates the map to 'image', hence the collision control is separate
  this map. when there is a revision to map (e.g. door open)
  */
  //shows only wall now.
   // TODO: change this to variable, not constant literal!
  //const margin = 300;
  var allMap = document.createElement("canvas");
  allMap.width = 500*GRID_SIZE;
  allMap.height = 500*GRID_SIZE;
  var allMapCtx = allMap.getContext('2d');

  //context.clearRect(startX, startY, canvasW, canvasH);
  /*
  aqImage = new Image();
  aqImage.src = '../image/aq.jpeg';
  aqImage.onload = function(){
    context.drawImage(aqImage, 0, 0);
  }*/
  var texture = new Image();
  texture.src = "/objects/wall.png"
  for (var x = 0; x < mapData.length; x++) {
    var line = "";
    for (var y = 0; y < mapData[mapData.length - 1].length; y++){
      // console.log("\tMapdata[" + x + "][" + y + "]"); ////*****
      // var source = mapData[x][y].textureSrc;
      // console.log(source)
      // var pattern = ctx.createPattern(source, "repeat");
      // var img = new Image();
      // img.src = "static/objects/player1.jpg";
      // img.onload = function(){
      //   allMapCtx.drawImage(img, 300, 300, 300, 300);
      // }
      if(mapData[x][y] != '' && mapData[x][y].name == "floor")
      {
        allMapCtx.beginPath();
        allMapCtx.rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        allMapCtx.fillStyle = mapData[x][y].color;
        allMapCtx.fill();
      }
      else if(mapData[x][y] != '' && mapData[x][y].name == "wall")
      {
        // var source = mapData[x][y].textureSrc;
        // console.log(source)
        // var pattern = ctx.createPattern(source, "repeat");
        allMapCtx.beginPath();
        allMapCtx.rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        // allMapCtx.fillStyle = texture.src;
        allMapCtx.fillStyle = "#333";
        allMapCtx.fill();
      }

      if (mapData[x][y] == ''){
        line += "0";
      }else if(mapData[x][y].name == "wall"){
        line += "1";
      }else{
        line += "!";
      }
    }
  }
  //console.log(mapData);/////*****
  mapImage.src = allMap.toDataURL();
  console.log('socket event create map called: URL set to', mapImage.src);/////*****
  socket.emit("deliverMapImageSrcToServer", mapImage.src);
  delete allMap;
}

function showMessage(messageString) {
  messageOn = true;
  messageQueue.push(messageString);
}

function showDeadScreen() {
  if (dead) {
    return;
  }
  dead = true;
  context.clearRect(startX, startY, canvasW, canvasH);
  context.beginPath();
  context.fillStyle = "#BB0000";
  context.rect(0, 0, canvasW, canvasH);
  context.fill();

  context.fillStyle = "white";
  context.font = "80px Arial";
  context.fillText("You Failed!", canvasW/2-200, canvasH/2-50);

  context.fillStyle = "white";
  context.font = "20px Arial";
  var messageNum = Math.random() * deadMessage.length;
  console.log(messageNum);
  var deadMsg = deadMessage[Math.floor(messageNum)];
  var lines = deadMsg.split('\n');
  for (var i = 0; i<lines.length; i++) {
    context.fillText(lines[i], 120, canvasH/2 + 50 + 30*i);
  }
}

socket.on("zoneChange", function(num){
  //zone changed!
  zoneChangeOn = true;
  zoneChangeOnTime = new Date();
  zoneNum = num;
});

socket.on("questOver", function(qName, qCondition, qDescription) {
  questMessageOn = true;
  questMessageOnTime = new Date();
  questName = qName;
  questCondition = qCondition;
  questDescription = qDescription;
  console.log("show quest: ", qName);
});

//=============================================================================
// George Workpace
var logoutButton = document.getElementById('log_out_button' );
logoutButton.addEventListener('click', function(event) {
  logoutButton.value = username;
});

//=============================================================================

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
