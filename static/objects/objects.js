
//size of the grid. the program should run even if this constant variable is suddenly changed.
const GRID_SIZE = 5;

/*Guide for adding classes to this file: [When not sure ask Hailey]
1. Add a function in the similar form as others.
    function NAME(parameters) {
      ...
    }
2. creating member variables:
    this.x = x;   //creates member variable and initializes it.
3. add
    return this;
4. at the end of the file, add
    module.exports.NAME = NAME;
  (This is required when accessing these from other .js files)

When accessing these from other .js files:

1. link the file by
  var objFile = require('objects.js');
with appropriate path (and appropriate variable name)
2. call them as
  var wall1 = objFile.Wall(x, y, width, height, textureLink);

will create a variable 'wall1' constructed with class 'Wall'.
*/

//constructor function for Walls.
//This is how classes are defined.
class Wall {
  constructor(x, y, width, height, textureLink){
      this.x = x*GRID_SIZE;
      this.y = y*GRID_SIZE;
      this.width = width*GRID_SIZE;
      this.height = height*GRID_SIZE;
      this.texture = textureLink;
  /*
      //I don't think we need this but let's leave it as a comment for now
      this.collideable = true;
      this.distructible = false;
      this.interactable = false;*/
  }
}

//constructor function for Map objects that are not Walls.
class Furniture {
    constructor(name, x, y, direction){
      this.name = name;
      this.x = x*GRID_SIZE;
      this.y = y*GRID_SIZE;
      this.direction = direction;
      return this;
    }
}

class Player {
  constructor(x, y){
    this.x = x*GRID_SIZE;
    this.y = y*GRID_SIZE;
  }
}


//this is for using functions (classes) in other .js files.
module.exports.Wall = Wall;
module.exports.Furniture = Furniture;


// Detailed definitions for: furnitures
