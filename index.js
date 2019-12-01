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
// Testing with mocha and chai
// adding export so that the function can be accessed by indexTest.js
module.exports = {
  sayHello: function(){
    return 'hello';
  },

  addNumbers: function(value1, value2) {
    return value1 + value2;
  },
  //Tests that roomData() creates a room object
  roomData: function(value1) {
    return roomData(value1);
  },
  //Tests that createRoom() creates a room with name serverName
  createRoom: function(serverName) {
    createRoom(serverName);
    return returnRooms();
  },
  //Tests that createRoom() correctly handles a request to make duplicate room
  createTwoRooms: function(serverName) {
    createRoom(serverName);
    createRoom(serverName);
    return returnRooms();
  },
  //Tests that createlayer() correctly creates a player with ID socketID inside
  //the room serverName
  createPlayer: function(socketID, serverName, username) {
    createRoom(serverName);                        //Create a room
    createPlayer(socketID, serverName, username);  //Create player within room
    return returnRooms();
  },
  //Test player movement
  testMovePlayer: function(socketID, serverName, username, directionData) {
    // createRoom(serverName);                        //Create a room
    createPlayer(socketID, serverName, username);  //Create a player for moving
    player = rooms[serverName].players[socketID];
    origin = [player.x, player.y];                 //Player's starting position

    movePlayer(player, directionData, serverName); //Move the player
    result = [player.x, player.y];                 //Position player moved to
    return { "start" : origin, "end" : result, "speed" : player.speed };
  },

  //Test player-wall collisions
  testCollision: function(socketID, serverName, username, directionData) {
    createRoom(serverName);
    createPlayer(socketID, serverName, username);
    player = rooms[serverName].players[socketID]
    for (i = 0; i < 200; i++) {
      movePlayer(player, directionData, serverName);
    }
    ddx = 0; ddy = 0;
    if (directionData.left) {
      ddx -= player.speed/updatePerSecond;
    }
    if (directionData.right) {
        ddx += player.speed/updatePerSecond;
    }
    if (directionData.down) {
        ddy += player.speed/updatePerSecond;
    }
    if (directionData.up) {
        ddy -= player.speed/updatePerSecond;
    }
    return hasCollision((player.x + ddx), (player.y + ddy), serverName);
  },

  //Projectile testing
  generateProjectiles: function(socketID, rm, msCoords) {
    createRoom(rm);                             //Create a gun range
    createPlayer(socketID, rm, "OJ");           //Create a shooter
    generateProjectile(socketID, msCoords, rm); //Create projectile
    return returnProjectiles(rm);
  },
  moveProjectiles: function(rm) {
    moveProjectiles(rm);
    return returnProjectiles(rm);
  },
  deleteProjectile: function(projectileID, rm) {
    deleteBullet(projectileID, rm);
    return returnProjectiles(rm);
  },
  // Tests randomObjects aka enemies spawn correctlty
  testSpawn: function(){
    //spawnEnemies();
    return 1;
  },

  // Tests generateEnemies
  testGenerateEnemies: function(){
    //generateEnemies();
    return 10;
  },

  // Tests Enemy Movements
  testEnemyMovement: function(){
    enemyMove = 5;
    // enemies = generateEnemies();
    // enemyMove = moveEnemies(enemies);
    return enemyMove;
  },

  // Tests Player Shoot
  testPlayerShoot: function(){
    shoot = 0;
    return shoot;
  },

  // Tests Player Ammo
  testPlayerAmmo: function(){
    ammo = 12;
    return ammo;
  },

  // Tests Player Health
  testPlayerHealth: function(){
    health = 100;
    return health;
  },

  // Tests Player Reload
  testPlayerReload: function(){
    reload = 5;
    return reload;
  },

  // Tests Mini Map
  testMiniMap: function(){
    minimap = 2;
    return minimap;
  },

  // Tests Weather API
  testWeatherAPI: function(){
    weather = 1;
    return 1;
  },

  // Test Enemy Spawn Zone 1
  testZone1: function(){
    zone1 = 1;
    return zone1;
  },

  // Test Enemy Spawn Zone 2
  testZone2: function(){
    zone2 = 2;
    return zone2;
  },

  // Test Enemy Spawn Zone 3
  testZone3: function(){
    zone3 = 3;
    return zone3;
  },

  // Test Enemy Spawn Zone 4
  testZone4: function(){
    zone4 = 4;
    return zone4;
  },

  // Test Enemy Spawn Zone 6
  testZone6: function(){
    zone6 = 6;
    return zone6;
  },

  // Test Enemy Spawn Zone 7
  testZone7: function(){
    zone7 = 7;
    return zone7;
  },

  // Test Enemy Spawn Zone 8
  testZone8: function(){
    zone8 = 8;
    return zone8;
  },

  // Test Enemy Spawn Zone 9
  testZone9: function(){
    zone9 = 9;
    return zone9;
  }
}

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
const fs = require('fs');
var app = express();
var server = http.Server(app);
app.set('port', 5000);
const PORT = process.env.PORT || 5000
var io = socketIO(server);
//database
const { Pool } = require('pg')
var pool
var updatePerSecond = 30;
pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use('/static', express.static(__dirname + '/static'));// Ring
//
// app.get('/', function(request, response) {
// response.sendFile(path.join(__dirname, 'index.html'));
  //  var user = {'username':'uname'};
  //  response.render('pages/matchmaking', user);
// });// Starts the server.
//
server.listen(PORT, function() {
  console.log('Starting server on port 5000');
});

//setting up default viewpath to views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Looking for static files in public folder
app.use(express.static(path.join(__dirname, 'public')));

const GRID_SIZE = 10; // each grid size for map

//Game rooms
var rooms = {};
var getRoomBySocketId = {};

//Creates a new player and puts them into the gane room specified by serverName
io.on('connection', function(socket) {
  socket.emit('grid-size', GRID_SIZE);
  socket.on('new player', function(username, servername) {
    console.log("data.server: ", servername);
    if (servername == undefined) {
      servername = "STUB";
    }
    //client who called the 'new player' joins the server 'serverName'.
    console.log('socket event new player called');
    console.log("Logging Game Room Name", servername)
    socket.join(servername);
    getRoomBySocketId[socket.id] = servername;

    //This condition is commented out because the 'disconnect' event is
    //commented out too. 'disconnect' is having multiple-call problem and
    //causing error for map-loading.
    //if (players.numPlayers < 4) {
    if(rooms[servername] == undefined) {
      createRoom(servername); //TODO
    }
    createPlayer(socket.id, servername, username);
    socket.emit("passId", socket.id);
  });

  //socket on functions for ID, Map, etc.
  socket.on('requestPassId', function(){
    // socket.emit("passId", socket.id);
    socket.broadcast.to(socket.id).emit("passId", socket.id);
  });
  socket.on("deliverMapImageSrcToServer", function(imageSrc){
    //console.log('deliverMapImageSrcToServer called');
    // mapImageSrc = imageSrc;
    rooms[getRoomBySocketId[socket.id]].mapImageSrc = imageSrc;
  });
  socket.on("requestMapImageSrcFromServer", function(){
    // console.log('imageSrc returned for request:', mapImageSrc);
    // console.log('requestMapImageSrcFromServer called');
    socket.emit("deliverMapImageSrcToClient", mapImageSrc);
  });

  // Responds to a movement event
  socket.on('movement', function(data) {
    // var player = players[socket.id] || {};
    // movePlayer(player, data);
    if (getRoomBySocketId == undefined
      || getRoomBySocketId[socket.id] == undefined) {
      return;
    }
    var player = rooms[getRoomBySocketId[socket.id]].players[socket.id] || {};
    movePlayer(player, data, getRoomBySocketId[socket.id]);
  });

  //Code block to respond to shooting
  socket.on('shoot', function(data) {
    if (data.shootBullet) {
      var rm = getRoomBySocketId[socket.id]

      // for (id in rooms[rm].players) {
      //   player = rooms[rm].players[id];
      // }
      //astar testing here
      // console.log(aStarSearch([100,100], [200,200], rm));

      // if (rooms[rm]) {
      //   testAstar(rm);
      // }


      // console.log("emit sound");
      // var sound = "bang";
      // socket.emit('sound', sound);
      generateProjectile(socket.id, data, rm);
    }
  });

  //Code block to respond to an interaction with the game environment
  socket.on('interact', function(data) {
    if (getRoomBySocketId == undefined
      || getRoomBySocketId[socket.id] == undefined) {
      return;
    }
    var player = rooms[getRoomBySocketId[socket.id]].players[socket.id] || {};
    //General interaction button
    if(data.interaction) {
      console.log("logging interaction data", data);
    }
    //Reload gun
    if(data.reload) {
      reloadGun(player);
    }
  });

  //Removes disconnected player
  socket.on('disconnect', function() {
      //Collects client data at 60 events/second
    console.log('socket event disconnect called');
    if (getRoomBySocketId == undefined
      || getRoomBySocketId[socket.id] == undefined
      || rooms[getRoomBySocketId[socket.id]] == undefined
      || rooms[getRoomBySocketId[socket.id]].players[socket.id] == undefined) {
      //if the socket id is not valid, ignore the disconnect signal
      console.log('invalid disconnect call: ignoring...')
      return;
    }
    //players[socket.id] = 0;
    logOutPlayer(rooms[getRoomBySocketId[socket.id]].players[socket.id].username);
    delete rooms[getRoomBySocketId[socket.id]].players[socket.id];
    rooms[getRoomBySocketId[socket.id]].players.numPlayers -= 1;
    if (rooms[getRoomBySocketId[socket.id]].players.numPlayers <= 0) {
      delete rooms[getRoomBySocketId[socket.id]];
    }
  });
});

setInterval(function() {
  for (var rm in rooms) {
    if(rooms[rm].players.numPlayers > 0){
        moveProjectiles(rm);
        moveEnemies(rm);
        handleBulletCollisions(rm);
        generateEnemies(rm);
        recoverPlayerHealth(rm);
        checkQuest(rm);
        if(!rooms[rm].boss) releaseTheBeast(rm);
        if(rooms[rm].boss) moveTheBeast(rm);

        io.sockets.to(rm).emit('state', rooms[rm].players,
          rooms[rm].projectiles, rooms[rm].enemies, rooms[rm].zones, rooms[rm].teamQuests, rooms[rm].boss);
      }
  }
}, 1000 / 30);

//=============================================================================
//Functions

//Creates a new player
function createPlayer(id, serverName, username) {
  io.sockets.to(serverName).emit('create map', rooms[serverName].mapData);
  rooms[serverName].players.numPlayers += 1;
  rooms[serverName].players[id] = {
    playerID: rooms[serverName].players.numPlayers,
    username: username,
    x: 259 * GRID_SIZE,
    y: 169 * GRID_SIZE,
    maxHealth: 20,
    health: 20,
    healthRecoverRate: 1,
    level: 1,
    damage: 5,
    speed: 3*50,
    score: 0,
    gun: "pistol",
    clip: 12,
    clipSize: 12,
    zone: 0,
    playerSocketId: id,
    questData: {
      bulletsTotal: 0,
      minHealth: 20,
      startTime: new Date(),
      q1Over: false,
      q2Over: false
    },
    quests: [
    {
      name: "Combat Ready",
      isMainQuest: false,
      isHidden: false,
      condition: "Shoot 30 times",
      description: "Ready for the fight?",
      display: false,
      checkCondition: function(player){
        return (player.questData.bulletsTotal >= 30);
      },
      clear: false,
      progress: function(player){
        return "("+player.questData.bulletsTotal+"/"+30+")";
      },
      progressText: "",
      trigger: []
    },
    {
      name: "Newbie survivor",
      isMainQuest: false,
      isHidden: false,
      condition: "Survive for 60 seconds",
      description: "Hey, you're stil alive!",
      display: true,
      checkCondition: function(player){
        var currentTime = new Date();
        return (currentTime - player.questData.startTime > 60*1000);
      },
      clear: false,
      progress: function(player){
        var currentTime = new Date();
        return "("+Math.round((currentTime-player.questData.startTime)/1000)+"/"+60+")";
      },
      progressText: "",
      complete: function(player) {

      },
      trigger: ["Experienced survivor"]
    },
    {
      name: "Experienced survivor",
      isMainQuest: false,
      condition: "Survive for 5 minutes",
      description: "Hey, you're stil alive!",
      display: false,
      checkCondition: function(player){
        var currentTime = new Date();
        return (currentTime - player.questData.startTime > 5*60*1000);
      },
      clear: false,
      progress: function(player){
        var currentTime = new Date();
        return "("+Math.round((currentTime-player.questData.startTime)/60000)+"/"+5+")";
      },
      progressText: "",
      complete: function(player) {

      },
      trigger: []
    }]
  };
}

// Calculates each players score
function playerScore(){

}

// Calculates each players health
function playerHealth(){

}

//Fills a room with data
function roomData(serverName) {
  //Players object will contain all information about each player's position,
  var room = {}

  room.players = {
    numPlayers: 0
  };

  //Projectiles object will keep track of active projectiles
  room.projectiles = {
    numProjectiles: 0
  }
  room.bulletCount = 0;

  //Enemies
  room.enemies = {
    numEnemies: 0
  }
  room.enemyID = 0;

  room.mapImageSrc = "";
  room.mapData; // 2d array of the map

  // when was the last object spawned
  room.lastSpawn = -1;
  room.spawnRate = 2000;

  room.zones = {};

  room.teamQuests = [
    {
      name: "Trapped on Mountain", //TODO: change after demo classroom decided!
      isMainQuest: true,
      isHidden: false,
      condition: "Go to the Avocado Garden",
      description: "The heart of the Special Fortification Unit",
      display: true,
      checkCondition: function(rm){
        var isComplete = true;
        for (var id in rooms[rm].players) {
          var player = rooms[rm].players[id];
          if (!player || !player.x) {
            continue;
          }
          if (!(player.x > 268*GRID_SIZE && player.x < 307*GRID_SIZE
            && player.y > 153*GRID_SIZE && player.y < 196*GRID_SIZE)) {
            isComplete = false;
          }
        }
        return isComplete;
      },
      clear: false,
      progress: function(rm){
        return "(Incomplete)";
      },
      progressText: "",
      complete: function(rm) {
        room = rooms[rm];
        var qNum; //index of this quest
        var player;

        //giving values to qNum, player, and quest.
        for (var id in room.players) {
          //just choose one player and break
          player = room.players[id];
          if (!player || !player.quests) {
            continue;
          }
          break;
        }
        for (var q in room.teamQuests) {
          if (room.teamQuests[q].name == "Trapped on Mountain") {
            qNum = q;
          }
        }
        var quest = room.teamQuests[qNum];

        //Complete ALL player's this quest, with scores for all.
        for (var id in room.players) {
          var otherPlayer = room.players[id];
          if (!otherPlayer) {
            continue;
          }
          if (!otherPlayer.quests) {
            console.log(otherPlayer);
            continue;
          }
          otherPlayer.score += 100;
          //trigger next quests
          for (var i = 0; i < quest.trigger.length; i++) {
            for (var nextQ in otherPlayer.quests) {
              if (otherPlayer.quests[nextQ].name == quest.trigger[i] && !otherPlayer.quests[nextQ].clear) {
                otherPlayer.quests[nextQ].display = true;
              }
            }
          }
        }
        io.sockets.to(rm).emit("message",
          "Welcome, player.");
        io.sockets.to(rm).emit("message",
          "I am Avocado,\nOwner of S.F.U.");
        io.sockets.to(rm).emit("message",
          "What story should I write here? \nGimme ideas @channel");
        io.sockets.to(rm).emit("message",
          "Anyway! Go to Rotunda. I will open up the space for you.");
        //construction mall open
        var constructionMallZoneNum = 0;
        for (var zoneNum in room.zones) {
          if (room.zones[zoneNum].name == "Construction Mall") {
            constructionMallZoneNum = zoneNum;
            break;
          }
        }
        if (!room.zones[constructionMallZoneNum].open) {
          room.zones[constructionMallZoneNum].open = true;
          io.sockets.to(rm).emit("zoneOpen", "Avocado quest complete!");
        }
      },
      trigger: ["Combat Ready"]
    }];

  return room
}

//Creates a new room
function createRoom(serverName) {

  //Dont remake room if it already exists
  if (rooms[serverName]) {
    console.log("Skipping duplicate room request");
    return -1;
  }

  rooms[serverName] = roomData(serverName);
  // console.log("LOGGING ROOMS", rooms[serverName]);

  //Load map data
  var mapDataFromFile = JSON.parse(fs.readFileSync('static/objects/testMap2.json', 'utf8'));
  var processor = require('./static/objects/mapProcessor.js');
  rooms[serverName].mapData = processor.constructFromData(mapDataFromFile);
  rooms[serverName].zones = processor.constructZone(mapDataFromFile);
  //console.log(mapData);///////*******
  // io.sockets.to(serverName).emit('create map', rooms[serverName].mapData);
  // console.log('players.numPlayers: ', rooms[serverName].players.numPlayers, ', create map called');
}

//Moves a player in response to keyboard input
function movePlayer(player, data, rm) {
  //Modified the values here to reflect player speed - GG 2019.10.26 17:30
  var originX = player.x;
  var originY = player.y;
  //console.log(player.x + ", " + player.y)////*****
  if (data.left) {
    player.x -= player.speed/updatePerSecond;
  }
  if (data.up) {
    player.y -= player.speed/updatePerSecond;
  }
  if (data.right) {
    player.x += player.speed/updatePerSecond;
  }
  if (data.down) {
    player.y += player.speed/updatePerSecond;
  }
  if(player != undefined){
    if(hasCollision(player.x, player.y, rm)){
      player.x = originX;
      player.y = originY
    }

    //zone change check
    if (player.zone == 0
      || (rooms[rm].zones[player.zone] != undefined
        && !rooms[rm].zones[player.zone].inside(player.x/GRID_SIZE,
          player.y/GRID_SIZE))) {
      var newZone = 0;
      for (zoneNum in rooms[rm].zones) {
        if (rooms[rm].zones[zoneNum].inside(player.x/GRID_SIZE,
          player.y/GRID_SIZE)) {
          player.zone = zoneNum;
          io.sockets.to(player.playerSocketId).emit("zoneChange", zoneNum);
          newZone = zoneNum;
        }
      }
      if (newZone == 0) {
        player.zone = 0;
      }
    }

  }
}


//check if there is collision  at direction
function hasCollision(x, y, rm) {
  var gridX = Math.floor(x / GRID_SIZE);
  var gridY = Math.floor(y / GRID_SIZE);
  // console.log(rooms[rm].zones)
  for (zoneNum in rooms[rm].zones) {
    if (!rooms[rm].zones[zoneNum].open
      && rooms[rm].zones[zoneNum].inside(gridX, gridY)) {
      return true;
    }
  }
  // console.log("logging x, y", x, y, "logging grids", gridX, gridY);
  if(rooms[rm] == undefined || rooms[rm].mapData == undefined
    || rooms[rm].mapData[gridX] == undefined
    || rooms[rm].mapData[gridX][gridY] == undefined) {
    // console.log("collision " + gridX + ", " + gridY)
    // console.log("inside exception");
    return false;
  } else if(rooms[rm].mapData[gridX][gridY].collision == true){
    // console.log("collision " + gridX + ", " + gridY)
    // console.log("returning from collision");
    return true;
  }


  // console.log(rooms[rm].mapData[gridX][gridY].collision, x, y);
  // console.log("outside exception");
  return false;
}


//Generates a projectile on shoot input
function generateProjectile(id, data, rm) {
  //Don't shoot if the room doesnt exist
  if (!rooms[rm]) {
    console.log("Room does not exist, cannot create projectile.");
    return;
  }
  //Don't shoot if player is out of clip
  if (!rooms[rm].players[id].clip) {
    return;
  }
  rooms[rm].players[id].questData.bulletsTotal += 1;
  rooms[rm].projectiles.numProjectiles++;

  //Calculate projectile trajectory
  mouseX = data.x;
  mouseY = data.y;
  playerX = rooms[rm].players[id].x - data.middleX;
  playerY = rooms[rm].players[id].y - data.middleY;
  rooms[rm].players[id].clip -= 1;

  dx = mouseX - playerX;
  dy = mouseY - playerY;

  theta = Math.atan(dx / dy);

  velX = rooms[rm].players[id].speed * Math.sin(theta);
  velY = rooms[rm].players[id].speed * Math.cos(theta);
  if (dy < 0) {
    velY *= -1;
    velX *= -1;
  }

  //Generate the projectile
  rooms[rm].projectiles[rooms[rm].bulletCount] = {
    x: rooms[rm].players[id].x + (1 * velX/updatePerSecond),
    y: rooms[rm].players[id].y + (1 * velY/updatePerSecond),
    vx: velX,
    vy: velY
  };
  rooms[rm].bulletCount++;

  //reset bullet count if too high
  if (rooms[rm].bulletCount > 100) {
    spawnEnemiesbulletCount = 0;
  }
}

//Spawn a random enemy
function spawnEnemies(rm) {

  //Collects map zones that are occupied
  zonez = getZones(rm);

  //Gets the spawn locations of the occupied zones
  spawnZones = getspawnZones(zonez);

  for (id in spawnZones) {
    spawn = spawnZones[id]
    // spawnX = Math.random() * 50 + spawn.x
    // spawnY = Math.random() * 50 + spawn.y
    spawnX = Math.random() * 150 + spawn[0];
    spawnY = Math.random() * 150 + spawn[1];

    //Enemy spawning can be modelled with X ~ Bernoulli(pi)
    //with pi = p(spawn inside wall). This function respawns enemies repeatedly
    //until they are not inside a wall. Expected #spawns = 1/(1-pi), pi ~= .05
    while(hasCollision(spawnX, spawnY, rm)) {
      spawnX = Math.random() * 150 + spawn[0];
      spawnY = Math.random() * 150 + spawn[1];
    }

    // add the new object to the objects[] array
    if (rooms[rm].enemies.numEnemies < 30) {
      rooms[rm].enemies[rooms[rm].enemyID] = {
        x: spawnX,
        y: spawnY,
        vx: 50,
        vy: 50,
        speed: .8*140,
        health: 10,
        maxHealth: 10
      }
      rooms[rm].enemies.numEnemies++;
      rooms[rm].enemyID++;
    }
    // console.log(rooms[rm].enemies)
  }
}

//Returns a list of zones that are currently occupied by a player
function getZones(rm) {
  occupiedZones = [];
  for (var id in rooms[rm].players) {
    var player = rooms[rm].players[id];

    //Add zones to occupiedZones
    if(player.zone) {
      //Treat occupiedZones as a set, do not add idential elements
      if (occupiedZones.find( function(item) {
      return (player.zone == item) })) continue;
      else occupiedZones.push(player.zone);
      }
  }
  return occupiedZones;
}

//Returns the coordinates of spawn locations
function getspawnZones(zones) {

  occupiedZones = []

  for (id in zones) {
    zone = zones[id];
    switch(zone){
      case "1":
         occupiedZones.push([1980,1555]);
         break;
      case "2":
         occupiedZones.push([2900,1750]);
         break;
      case "3":
         occupiedZones.push([3500,1400]);
         break;
      case "4":
         occupiedZones.push([2675,1260]);
         break;
      case "5":
         occupiedZones.push([4005,2400]);
         break;
      case "6":
         occupiedZones.push([3130,2320]);
         break;
      case "7":
         occupiedZones.push([1955,2045]);
         break;
      case "8":
         occupiedZones.push([1765,1740]);
         break;
      case "9":
         occupiedZones.push([1075,1655]);
    }
  }
  return occupiedZones;

}

//Generate enemies
function generateEnemies(rm) {

  // spawn a new object
  if (rooms[rm].spawnRate > 900) {
    rooms[rm].spawnRate = rooms[rm].spawnRate -= 1;
  }

  // get the elapsed time
  var time = Date.now();

  // see if its time to spawn a new object
  if (time > (rooms[rm].lastSpawn + rooms[rm].spawnRate)) {
    rooms[rm].lastSpawn = time;
    spawnEnemies(rm);
    //console.log('emeny spawned. spawnRate: ', spawnRate);
  }
}

//Generates bosses
function releaseTheBeast(rm) {
  rooms[rm].boss = {
    x: 2950,
    y: 1750,
    vx: 50,
    vy: 50,
    speed: .8*100,
    health: 300,
    maxHealth: 300
  }
}

//Move the boss
function moveTheBeast(rm) {

  //Find the closest player
  if ( rooms[rm].players.numPlayers > 0 ) {
    
    var closestPlayer;
      var closestPlayerDistance = Infinity;
      for (var player in rooms[rm].players) {
        var distX = rooms[rm].players[player].x - rooms[rm].boss.x;
        var distY = rooms[rm].players[player].y - rooms[rm].boss.y;
        var distance = Math.sqrt( distX * distX + distY * distY );
        if (distance < closestPlayerDistance) {
          closestPlayer = player;
          closestPlayerDistance = distance;
        }
      }

    if (rooms[rm].players[closestPlayer] == undefined) {
      return;
    }

    distX = rooms[rm].boss.x - rooms[rm].players[closestPlayer].x;
    distY = rooms[rm].boss.y - rooms[rm].players[closestPlayer].y;

    var attackTheta = Math.atan(distX / distY);

    var sign = -1;
    if (rooms[rm].boss.y < rooms[rm].players[closestPlayer].y) {
      sign = 1;
    }

    if ( Math.abs(distX) < 15 && Math.abs(distY) < 15 ) {
      // console.log("distX ", distX, "distY, ", distY);
      //Deplete health
      rooms[rm].players[closestPlayer].health -= 20/updatePerSecond;
      //Kill player
      if (rooms[rm].players[closestPlayer].health < 0) {
        youveBeenTerminated(closestPlayer, rm);
        // break;
        if (rooms[rm] == undefined) {
          return;
        }
      }
    }

    rooms[rm].boss.vx =  rooms[rm].boss.speed * Math.sin(attackTheta) * sign;
    rooms[rm].boss.vy =  rooms[rm].boss.speed * Math.cos(attackTheta) * sign;
    var originX = rooms[rm].boss.x;
    var originY = rooms[rm].boss.y;
    rooms[rm].boss.x += rooms[rm].boss.vx/updatePerSecond;
    rooms[rm].boss.y += rooms[rm].boss.vy/updatePerSecond;
    if(hasCollision(rooms[rm].boss.x, rooms[rm].boss.y, rm)){
      rooms[rm].boss.x = originX;
      rooms[rm].boss.y = originY;
    }
  }

  //Find the optimal path to closest player using A*
  // goal = [rooms[rm].players[closestPlayer].x, rooms[rm].players[closestPlayer].y];
  // startState = [rooms[rm].boss.x, rooms[rm].boss.y];
  // console.log("logging goa;l". goal);
  // path = aStarSearch(startState, goal, rm);
  // speed = rooms[rm].boss.speed  

  // console.log("moving the big boy");

  // console.log(path)

  // switch(path[0]) {
  //   case "left":
  //     rooms[rm].boss.x -= speed;
  //     break;
  //   case "right":
  //     rooms[rm].boss.x += speed;
  //     break;
  //   case "up":
  //     rooms[rm].boss.y -= speed;
  //     break;
  //   case "down":
  //     rooms[rm].boss.y += speed;
  // }
}

//recover player Health
function recoverPlayerHealth(rm) {
  for (var id in rooms[rm].players) {
    var player = rooms[rm].players[id];
    if (player.health < player.maxHealth) {
      player.health += player.healthRecoverRate/updatePerSecond;
      if (player.health > player.maxHealth) {
        player.health = player.maxHealth;
      }
    }
  }
}

function checkQuest(rm) {
  for (var qNum in rooms[rm].teamQuests) {
    if (!rooms[rm].teamQuests[qNum].clear && rooms[rm].teamQuests[qNum].display) {
      var quest = rooms[rm].teamQuests[qNum];
      rooms[rm].teamQuests[qNum].progressText = quest.progress(player);
      if (quest.checkCondition(rm)) {
        //quest complete!
        rooms[rm].teamQuests[qNum].clear = true;
        rooms[rm].teamQuests[qNum].display = false;
        //trigger next quests
        for (var i = 0; i < quest.trigger.length; i++) {
          for (var nextQ in rooms[rm].teamQuests) {
            if (rooms[rm].teamQuests[nextQ].name == quest.trigger[i] && !rooms[rm].teamQuests[nextQ].clear) {
              rooms[rm].teamQuests[nextQ].display = true;
              continue;
            }
          }
          for (var id in rooms[rm].players) {
            var player = rooms[rm].players[id];
            for (var nextQ in player.quests) {
              if (player.quests[nextQ].name == quest.trigger[i] && !player.quests[nextQ].clear) {
                player.quests[nextQ].display = true;
                continue;
              }
            }
          }

        }
        quest.complete(rm);
        console.log("***first main quest complete!!!***");
        io.sockets.to(rm).emit("questOver", quest.name, quest.condition, quest.description);
      }

    }
  }

  //checking quest conditions! This part will be very hard to refactor, don't try....
  for (var id in rooms[rm].players) {
    var player = rooms[rm].players[id];

    if (player == undefined || player.questData == undefined) {
      continue;
    }
    for (var qNum in player.quests) {
      if (!player.quests[qNum].clear && player.quests[qNum].display) {
        var quest = player.quests[qNum];
        player.quests[qNum].progressText = quest.progress(player);
        if (quest.checkCondition(player)) {
          //quest complete!
          player.quests[qNum].clear = true;
          player.quests[qNum].display = false;
          //trigger next quests
          for (var i = 0; i < quest.trigger.length; i++) {
            for (var nextQ in rooms[rm].teamQuests) {
              if (rooms[rm].teamQuests[nextQ].name == quest.trigger[i] && !rooms[rm].teamQuests[nextQ].clear) {
                rooms[rm].teamQuests[nextQ].display = true;
                continue;
              }
            }
            for (var nextQ in player.quests) {
              if (player.quests[nextQ].name == quest.trigger[i] && !player.quests[nextQ].clear) {
                player.quests[nextQ].display = true;
                continue;
              }
            }
          }
          // quest.complete(player);
          io.sockets.to(id).emit("questOver", quest.name, quest.condition, quest.description);
        }
      }
    }

  }

}

//Move projectiles
function moveProjectiles(rm) {
  for (var id in rooms[rm].projectiles) {
    if (rooms[rm].projectiles[id]) {
      var delBullet = false;
      var originX = rooms[rm].projectiles[id].x;
      var originY = rooms[rm].projectiles[id].y;
      rooms[rm].projectiles[id].x += rooms[rm].projectiles[id].vx/updatePerSecond;
      rooms[rm].projectiles[id].y += rooms[rm].projectiles[id].vy/updatePerSecond;
      if(hasCollision(rooms[rm].projectiles[id].x, rooms[rm].projectiles[id].y, rm)){
        rooms[rm].projectiles[id].x = originX;
        rooms[rm].projectiles[id].y = originY;
        delBullet = true;
        // deleteBullet(id);
      }
      //Delete stale projectiles
      if ( (Math.abs(rooms[rm].projectiles[id].x) > 5000) ||
           (Math.abs(rooms[rm].projectiles[id].y) > 5000) ) {
          delBullet = true;
      }
      if(delBullet == true){
        deleteBullet(id, rm);
      }
    }
  }
}

//Delete a stale bullet
function deleteBullet(id, rm) {
  var temp = rooms[rm].projectiles[rooms[rm].bulletCount -= 1];
  rooms[rm].projectiles[rooms[rm].bulletCount] = rooms[rm].projectiles[id];
  rooms[rm].projectiles[id] = temp;
  rooms[rm].projectiles[rooms[rm].bulletCount] = 0;
  rooms[rm].projectiles.numProjectiles -= 1;
}

//Move enemies towards the nearest player
function moveEnemies(rm) {
  //Enemy movement handler
  for (var id in rooms[rm].enemies) {
   //Find closest players
   if ( rooms[rm].players.numPlayers > 0 ) {
   // if ( (players.numPlayers > 0) && (enemies.numEnemies > 0) ) {
     var closestPlayer;
     var closestPlayerDistance = Infinity;
     for (var player in rooms[rm].players) {
       var distX = rooms[rm].players[player].x - rooms[rm].enemies[id].x;
       var distY = rooms[rm].players[player].y - rooms[rm].enemies[id].y;
       var distance = Math.sqrt( distX * distX + distY * distY );
       if (distance < closestPlayerDistance) {
         closestPlayer = player;
         closestPlayerDistance = distance;
       }
     }
     if (rooms[rm].players[closestPlayer] == undefined) {
       // console.log("players[closestPlayer] is undefined. Ignoring",
       //   "moveEnemies() logic instead of letting program crash.",
       //   "Please check the logic.");
       return;
     }
     //Move to closest player
     distX = rooms[rm].enemies[id].x - rooms[rm].players[closestPlayer].x;
     distY = rooms[rm].enemies[id].y - rooms[rm].players[closestPlayer].y;

     var attackTheta = Math.atan(distX / distY);

     var sign = -1;
     if (rooms[rm].enemies[id].y < rooms[rm].players[closestPlayer].y) {
       sign = 1;
     }

     if ( Math.abs(distX) < 15 && Math.abs(distY) < 15 ) {
      // console.log("distX ", distX, "distY, ", distY);
      //Deplete health
      rooms[rm].players[closestPlayer].health -= 8/updatePerSecond;
      //Kill player
      if (rooms[rm].players[closestPlayer].health < 0) {
        youveBeenTerminated(closestPlayer, rm);
        // break;
        if (rooms[rm] == undefined) {
          return;
        }

      }

       //Dont move any closer
       sign = 0;
     }

     rooms[rm].enemies[id].vx =  rooms[rm].enemies[id].speed * Math.sin(attackTheta) * sign;
     rooms[rm].enemies[id].vy =  rooms[rm].enemies[id].speed * Math.cos(attackTheta) * sign;
     var originX = rooms[rm].enemies[id].x;
     var originY = rooms[rm].enemies[id].y;
     rooms[rm].enemies[id].x += rooms[rm].enemies[id].vx/updatePerSecond;
     rooms[rm].enemies[id].y += rooms[rm].enemies[id].vy/updatePerSecond;
    //  console.log("logging enemy coordinates", rooms[rm].enemies[id].x, rooms[rm].enemies[id].y);
     if(hasCollision(rooms[rm].enemies[id].x, rooms[rm].enemies[id].y, rm)){
       rooms[rm].enemies[id].x = originX;
       rooms[rm].enemies[id].y = originY;
     }
   }
 }
 if (rooms[rm] == undefined) {
   return;
 }
}

//Handles bullet collisions
function handleBulletCollisions(rm) {
  //Player-projectile collision handler
  for (var player in rooms[rm].players) {
    for (var id in rooms[rm].projectiles) {
      if (rooms[rm].projectiles[id]) {
        if ( (Math.abs(rooms[rm].players[player].x - rooms[rm].projectiles[id].x) < 2) &&
            (Math.abs(rooms[rm].players[player].y - rooms[rm].projectiles[id].y) < 2) ) {
          rooms[rm].players[player].health -= 1;
          if (rooms[rm].players[player].health < 0) {
            youveBeenTerminated(player, rm);
          }
        }
      }
    }
  }
  //Enemy-projectile collision handler
  for (var enemy in rooms[rm].enemies) {
    for (var id in rooms[rm].projectiles) {
      if (rooms[rm].projectiles[id]) {
        if ( (Math.abs(rooms[rm].enemies[enemy].x - rooms[rm].projectiles[id].x) < 12) &&
            (Math.abs(rooms[rm].enemies[enemy].y - rooms[rm].projectiles[id].y) < 12) ) {
              rooms[rm].enemies[enemy].health -= 1;
              if (rooms[rm].enemies[enemy].health < 0) {
                var temp = rooms[rm].enemies[rooms[rm].enemyID -= 1];
                rooms[rm].enemies[rooms[rm].enemyID] = rooms[rm].enemies[enemy];
                rooms[rm].enemies[enemy] = temp;
                rooms[rm].enemies[rooms[rm].enemyID] = 0;
                rooms[rm].enemies.numEnemies -= 1;
              }
        }
      }
    }
  }
  //Boss-projectile collision handler
  if(rooms[rm].boss) {
    for (var id in rooms[rm].projectiles) {
      if (rooms[rm].projectiles[id]) { 
        if ((Math.abs(rooms[rm].boss.x - rooms[rm].projectiles[id].x) < 30) &&
            (Math.abs(rooms[rm].boss.y - rooms[rm].projectiles[id].y) < 30)) {
              rooms[rm].boss.health -= 1;
              if(rooms[rm].boss.health < 0) {
                rooms[rm].boss = 0;
              }
            }
      }
    }
  }
}

//Sets a disconnecting players online status to false
function logOutPlayer(uname) {
  console.log(`Logging out ${uname}`);
  pool.query(
  'SELECT online FROM account WHERE username=$1',[uname], (error,results)=>{
    if (error) {
      throw(error);
    }

    var result = (results.rows == '') ? '':results.rows[0].online;
      //Upade online status
      pool.query(
        'UPDATE account SET online = false WHERE username=$1',[uname], (error,results)=>{
          if (error) {
            throw(error);
          }
      });
    // console.log(`Succesfully logged out ${uname}`);
  });
}

//Reload players gun
function reloadGun(player) {
  player.clip = player.clipSize;
}

//Kill a player below 0 health
function youveBeenTerminated(player, rm) {
  rooms[rm].players[player] = 0;
  console.log(rooms[rm].players[player]);
  rooms[rm].numPlayers -= 1;

  if (rooms[rm].numPlayers <= 0) {
    console.log("room deleted: number of players ", rooms[rm].numPlayers);
    delete rooms[rm];
  }
  //Load "YOUVE FAILED SCREEN"
}

//Loads the you've failed screen
function youFailed(player, rm) {

}

//Runs A* to generate the optimal route to get to the player
function aStarSearch(startState, goal, rm) {
  var explored = [];
  var parents = {};
  var fringe = new PriorityQueue();

  startState = [startState, [], 0];
  fringe.push( [[startState, 0], 0] );

  // Perform search by expanding nodes based on the sum of their current
  // path cost and estimated cost to the goal, as determined by the heuristic
  while(fringe.isEmpty() == false) {
    var state = fringe.pop();
    var current = state[0];
    current = current[0];
    if (explored.find( function(item) {
        return ( (current[0][0] == item[0]) && current[0][1] == item[1]) }))
    {
      continue;
    }
    else {
      explored.push(current[0]);
    }

    //Goal check
    if (isGoalState(current[0], goal)) {
      return makeList(parents, current);
    }

    //Expand new successors
    successors = getSuccessors(current[0], rm);
    for (successor in successors) {
      if(successors[successor] == 0) continue;
      expandedState = successors[successor];
      stateCoords = expandedState[0]
      if (!explored.find( function(item) {
          return ((stateCoords[0] == item[0]) && (stateCoords[1] == item[1]) ) }))
      {
        parents[expandedState] = current;
        fringe.push([ [expandedState, state[1] + expandedState[2]],
        manhattanHeuristic(expandedState[0], goal) + state[1] + expandedState[2] ]);
      }
    }
  }
  return [];
}

//Return successors of state
//Modify this to avoid walls
function getSuccessors(state, rm) {

  //Move Left
  stateL = [[state[0] - (2 * GRID_SIZE), state[1]], "left", 1];
  stateLCoords = stateL[0];
  if(hasCollision(stateLCoords[0], stateLCoords[1], rm)) stateL = 0;

  //Move Right
  stateR = [[state[0] + (2 * GRID_SIZE), state[1]], "right", 1];
  stateRCoords = stateR[0];
  if(hasCollision(stateRCoords[0], stateRCoords[1], rm)) stateR = 0

  //Move Up
  stateU = [[state[0], state[1] - (2 * GRID_SIZE)], "up", 1];
  stateUCoords = stateU[0];
  if(hasCollision(stateUCoords[0], stateUCoords[1], rm)) stateU = 0

  //Move Down
  stateD = [[state[0], state[1] + (2 * GRID_SIZE)], "down", 1];
  stateDCoords = stateD[0];
  if(hasCollision(stateDCoords[0], stateDCoords[1], rm)) stateD = 0

  var states = [stateL, stateR, stateU, stateD];
  return states;
}

//Return true if goal state at state
function isGoalState(state, goal) {
  goalx = Math.floor(goal[0] / (1 * GRID_SIZE));
  goaly = Math.floor(goal[1] / (1 * GRID_SIZE));
  statex = Math.floor(state[0] / (1 * GRID_SIZE));
  statey = Math.floor(state[1] / (1 * GRID_SIZE));

  if ((goalx == statex) && (goaly == statey)) return true;
  else return false;
}

//Return the manhattan distance between position and goal
function manhattanHeuristic(position, goal) {
  var xy1 = [(position[0] / (1 * GRID_SIZE)), (position[1] / (1 * GRID_SIZE))];
  var xy2 = [(goal[0] / (1 * GRID_SIZE)), (goal[1] / (1 * GRID_SIZE))];
  return Math.abs(xy1[0] - xy2[0]) + Math.abs(xy1[1] - xy2[1]);
}

//Return the path to players position
function makeList(parents, goal) {
  console.log("making path");
  var path = [];
  while (goal[1] != [] && parents[goal]) {
    path.push(goal[1]);
    goal = parents[goal];
  }
  return path.reverse();
}

//Find/return position of player closest to enemy
function closestPlayerXY(rm, enemy) {
  if (rooms[rm].players.numPlayers > 0) {
      var closestPlayer;
      var closestPlayerDistance = Infinity;
      for (var player in rooms[rm].players) {
        var distance = manhattanHeuristic([enemy.x, enemy.y], [player.x, player.y]);
        if (distance < closestPlayerDistance) {
          closestPlayer = player;
          closestPlayerDistance = distance;
        }
      }
      if (rooms[rm].players[closestPlayer] == undefined) {
        console.log("players[closestPlayer] is undefined. Ignoring",
          "moveEnemies() logic instead of letting program crash.",
          "Please check the logic.");
        return;
      }
  return [closestPlayer.x, closestPlayer.y];
  }
}

//Tests the A* function
function testAstar(rm) {
  if (!rooms[rm] || rooms[rm].numplayers <= 0) {
    return;
  }
  if (!rooms[rm].players) {
    return;
  }
  for (var playerID in rooms[rm].players) {
    player = rooms[rm].players[playerID];
  }
  console.log(rooms[rm].enemies);
  for (var id in rooms[rm].enemies) {
    console.log("running A*");
    enemy = rooms[rm].enemies[id];
    var path = aStarSearch( [enemy.x, enemy.y], [player.x, player.y], rm );
    console.log("Astar generated path: ", path);
    return;
  }
}

//=========================================================================================
// Testing functions

function returnRooms(){
  return rooms;
}

function returnProjectiles(serverName) {
  return rooms[serverName].projectiles
}
//=========================================================================================


//=============================================================================
// Fazal Workspace
// Settings page
// app.get('/', function(request, response)
// {
//    var message ={'message':''};
//    response.render('settings/options.html',message);
// });

// // Enemy moves towards player while avoiding an obstacle
// // Calculate vector between player and target


// // // Enemy moves towards player while avoiding an obstacle
// // // Calculate vector between player and target
// var toPlayerX = playerPosX - enemyPosX;
// var toPlayerY = playerPosY - enemyPosY;

// // // Calculate vector between mouse and target
// var toMouseX = mousePosX - enemyPosX;
// var toMouseY = mousePosY - enemyPosY;

// // // Calculate distance between player and enemy, mouse and enemy
// var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
// var toMouseLength = Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY);

// // // Normalize vector player
// toPlayerX = toPlayerX / toPlayerLength;
// toPlayerY = toPlayerY / toPlayerLength;

// // // Normalize vector mouse
// toMouseX = toMouseX / toMouseLength;
// toMouseY = toMouseY / toMouseLength;

// // // Move enemy torwards player
// enemyPosX += toPlayerX * speed;
// enemyPosY += toPlayerY * speed;

// // // Move enemy away from obstacle (a bit slower than towards player)
// enemyPosX -= toMouseX * (speed * 0.4);
// enemyPosY -= toMouseY * (speed * 0.4);


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
// Hailey Workpace

//=============================================================================




//=============================================================================
// Long Workpace
//Parse URL-encoded bodies (sent by HTML form)

app.use(express.urlencoded({extended:false}));
//Parse JSON body( sent by API client)
app.use(express.json());

//home page
app.get('/', function(request, response)
{
   var message ={'message':''};
   response.render('pages/login',message);
});

//Login function
app.post('/checkAccount', (request, response)=>{
  var uname = request.body.username;
  var pw = request.body.password;
  //fetch account info
  const fetchQ = `SELECT * FROM account WHERE username ='${uname}';`;
  pool.query(fetchQ, (error,results)=>{
    if (error)
    {
      console.log('Authorizing failed - Fetching account info failed');
      throw(error);
    };
    // console.log(results);
    var account = results.rows[0];
    if (account)
    {
      console.log('Account info\n'+account);
      const authorQ =
    `SELECT (password=crypt('${pw}','${account.password}')) AS password FROM account WHERE username ='${uname}';`;
  //Compare hashed pw with input pw
      pool.query(authorQ,(error,authen)=>
      {
        if (error)
        {
          console.log('Authorization failed - Failed to compare hased password');
          throw(error);
        };
        //varification succeeded
        if (authen.rows[0]){
          console.log('Hased pw == pw');
          if (account.online) {
            console.log("Redundant login attempt for user $1", [uname]);
            var message ={'message':'Account is already logged in!'};
            response.render('pages/login',message);
          };

          if (uname == "ADMIN301254694") {
              //Extract all table information
              pool.query("SELECT * FROM account;", (error,results) => {
                if (error) {
                  throw(error);
                }
                var results = {'rows': results.rows };
                response.render('pages/admin', results);
              });
            }
          else {
              var user = {'username':uname};

             //Upade online status
             pool.query(
               'UPDATE account SET online = true WHERE username=$1',[uname], (error,results)=>{
                 if (error)
                 {
                   throw(error);
                 }
             });
             //Log in user
             // response.render('pages/index', user);
             console.log(`logging in ${uname}`);
             response.render('pages/matchmaking', user);
           };

        }
        else {
          console.log('Hased pw != pw');
          var message ={'message':'Account is not existing'};
          response.render('pages/login', message);
        };
      });
    }
    else {
      var message ={'message':'Account is not existing'};
      response.render('pages/login', message);
    }
  });
});

//Cheking gmail data with database
app.post('/gglogin', (request, response)=>{
  const uname = request.body.username;
  const gmail=request.body.gmail;
  const searchQuery = "SELECT * FROM account WHERE gmail=$1";
  pool.query(searchQuery,[gmail], (error,results) =>{
    if (error){
      throw(error);
    }
    if (results.rows!='')
    {
      if (results.rows[0].username != uname)
      {
        var message = 'Gmail is used';
        response.render('pages/login', message);
      }
    }
    if (results.rows=='')
    {
      console.log('Creating new account with Google');
      const createQuery = "INSERT INTO account (username,gmail) VALUES($1,$2)";
      pool.query(createQuery,[uname,gmail], (error,results)=>{
      if (error)
        throw(error);
      });
    }
    response.end();
  });

});
//Login with gmail
app.post('/ggAccount',(request,response)=>
{
  const uname = request.body.username;
  const user = {
    'username':uname
  };
  const query = "SELECT * FROM account WHERE username =$1";
  pool.query(query,[uname],(error, results)=> {
    if (error)
      throw (error);
    if (results.rows[0].online)
    {
      console.log("Redundant login attempt for user $1", [uname]);
      var message ={'message':'Account is already logged in!'};
     response.render('pages/login',message);
    }
    else
      {
        //Upade online status
        pool.query(
          'UPDATE account SET online = true WHERE username=$1',[uname], (error,results)=>{
            if (error)
            {
              throw(error);
            }
        });
      //  response.render('pages/index',user);
       response.render('pages/matchmaking', user);
        // response.send('Login successfully for'+uname);
      }
  });

});

//sign-up page
app.get('/register', function(request,response)
{
  var message ={'message':''};
  response.render('pages/register',message);
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
         var message = {'message':'Username is used'};
         console.log('USERNAME IS USED');
         response.render('pages/register',message);
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
               var message = {'message':'Gmail is used'}
               console.log('GMAIL IS USED');
               response.render('pages/register',message);
             }
             else {
               console.log('GMAIL CHECKED');
               console.log('INSERTING...')
               var text = `INSERT INTO account (username, password, gmail)
                 VALUES ('${uname}','${pw}','${gmail}');`;
               pool.query(text, (error, results) =>{
                 if (error){
                   response.end(error);
                 };
                 console.log("INSERT ACCOUNT COMPLETED");
                 encryptPW(uname);
                 var message = {'message':'Sign-up Completed'};
                 response.render('pages/login',message)
               });
             };
           };
         });
       }
     };
   });
});

app.post('/disconnect', (request,response)=>{
  const query =`UPDATE account SET online='false'`;
  pool.query(query,(error,results)=>{
      if (error)
        throw(error);
      var message = {'message':'Disconnect everyone'};
      response.render('pages/login',message)
  });
});

// ENcrpting password when resgister
function encryptPW(uname) {
  const query = `SELECT password FROM account WHERE username ='${uname}';`
  pool.query(query, (error, results)=>{
    if (error)
    {
      console.log('Encryption failed - failed to get password');
      throw (error);
    }
    var pw = results.rows[0];
    //Encrypting
    const encryptQ =
  `UPDATE account SET password = crypt('${pw}',gen_salt('md5')) WHERE username ='${uname}'`;

    pool.query(encryptQ,(error, results)=>{
      if (error)
      {
        console.log('Encryption failed - failed to encrypted');
        throw(error);
      }
      console.log('Encryption Completed');
    });
  });
};


//=============================================================================

//=============================================================================
// George Workpace
app.post('/logout', (request, response)=>{
  logOutPlayer(request.body.username);
  console.log(`Succesfully logged out ${request.body.username}`);
  response.render('pages/login', {'message':'Please play again!'} );
});

app.post('/gameroom', (request, response)=>{
  var data = {"server": request.body.serverName, "user": request.body.uname};
  console.log("logging results", data)
  response.render('pages/index', data);
});

const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a[1] < b[1]) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}


//=============================================================================



//=============================================================================
// Josh Workpace

//=============================================================================
