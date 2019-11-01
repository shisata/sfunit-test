/*This file reads and constructs the elements in the .json data file for the map.
  This file is only called when initializing the map.
   other purpose, please create another .js file.
*/

//'fs' is required for only readFile, which is moved to index.js now,
//but I will leave it here.
const fs = require('fs');
//when accessing classes in objects, call: objects.<OBJECTNAME>(<parameters>)
var objects = require('./objects.js');

// This functions receives single JSON data (which is already parsed)
// and constructs the elements, finally returns the containers that holds
// other containers, which holds each objects in the map.
// code for calling this function [in index.js]
// var mapDataFromFile =
// JSON.parse(fs.readFileSync('static/objects/testMap.json', 'utf8'));
// var processor = require('./static/objects/jsonProcessor.js');
// mapData = processor.constructFromData(mapDataFromFile);
var constructFromData = function(mapDataFromFile){
  var walls = [];
  var furnitures = [];
  var enemies = [];
  var bullets = [];
  var players = [];

  //Construct walls and insert them into container 'walls'
  for (i = 0; i < mapDataFromFile.map.wall.length; i++) {
    walls.push(objects.Wall(mapDataFromFile.map.wall[i].x,
      mapDataFromFile.map.wall[i].y, mapDataFromFile.map.wall[i].width,
      mapDataFromFile.map.wall[i].height, mapDataFromFile.map.wall[i].texture));
  }
  //Construct furnitures and insert them into container 'furnitures'
  for (i = 0; i < mapDataFromFile.map.furniture.length; i++) {
    furnitures.push(objects.Furniture(mapDataFromFile.map.furniture[i].name,
      mapDataFromFile.map.furniture[i].x, mapDataFromFile.map.furniture[i].y,
      mapDataFromFile.map.furniture[i].direction));
  }
  // TODO: enemies, bullets, players.

  return [walls, furnitures, enemies, bullets, players];
}
module.exports.constructFromData = constructFromData;
