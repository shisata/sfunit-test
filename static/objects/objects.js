//size of the grid. the program should run even if this constant variable is changed.
const GRID_SIZE = 5;
/*
//superclass of ALL objects in the map.
class MapObject {

  //variables: (x, y) for left-top corner, and width, height. / textures.
  var x;
  var y;
  var width;
  var height;

  //bool variables.
  var collideable;
  var distructible;
  var interactable;

  var texture;
}*/
function Wall(x, y, width, height, textureLink){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.texture = textureLink;

    this.collideable = true;
    this.distructible = false;
    this.interactable = false;
    return this;
}

function Furniture(name, x, y, direction){
  this.name = name;
  this.x = x;
  this.y = y;
  this.direction = direction;
  return this;
}

// TODO: class Vend, Exit, Couch, etc.
module.exports.Wall = Wall;
module.exports.Furniture = Furniture;
