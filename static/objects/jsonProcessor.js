
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
var constructFromData = function(jsonContent){
  var walls = giveWallArray(jsonContent);
  var furnitures = giveFurnitureArray(jsonContent);
  var enemies = giveEnemyArray(jsonContent);
  var players = givePlayerArray(jsonContent);
  return [walls, furnitures, enemies, players];
}

//// Support functions
function giveWallArray(json){
  var array = [];
  for (i = 0; i < json.map.wall.length; i++) {
    var x = json.map.wall[i].x;
    var y = json.map.wall[i].y;
    var width = json.map.wall[i].width;
    var height = json.map.wall[i].height;
    array.push(new objects.Wall(x, y, width, height));
  }
  return array;
}

function giveFurnitureArray(json){
  //same as giveWallArray()
  var array = [];
  return array;
}

function giveEnemyArray(json){
  //same as giveWallArray()
  var array = [];
  return array;
}

function givePlayerArray(json){
  //same as giveWallArray()
  var array = [];
  return array;
}
module.exports.constructFromData = constructFromData;
