//read and construct the elements in the .json data file for the map.
const fs = require('fs');
var objects = require('./objects.js');

var constructFromData = function(mapDataFromFile){
  var walls = [];
  var furnitures = [];
  var enemies = [];
  var bullets = [];
  var players = [];

  //TODO: create functions to construct map variables. Hailey will do this!
  for (i = 0; i < mapDataFromFile.map.wall.length; i++) {
    walls.push(objects.Wall(mapDataFromFile.map.wall[i].x, mapDataFromFile.map.wall[i].y,
      mapDataFromFile.map.wall[i].width, mapDataFromFile.map.wall[i].height,
      mapDataFromFile.map.wall[i].texture));
    //console.log(JSON.stringify(walls[i]));
  }
  for (i = 0; i < mapDataFromFile.map.furniture.length; i++) {
    furnitures.push(objects.Furniture(mapDataFromFile.map.furniture[i].name,
      mapDataFromFile.map.furniture[i].x, mapDataFromFile.map.furniture[i].y,
      mapDataFromFile.map.furniture[i].direction));
    //console.log(JSON.stringify(furnitures[i]));
  }

  return [walls, furnitures, enemies, bullets, players];
}
module.exports.constructFromData = constructFromData;
