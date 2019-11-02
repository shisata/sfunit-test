
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

class MapObject{
  var x;
  var y;
  var width;
  var height;

//boolean
  var collideable;
  var interactable;
  var destructible;

  var textureSrc;
}

//a general class for surfaces such as wall, floor, grass, glasses,etc
class Surface extends MapObject{
  constructor(collideable, destructible, interactable, textureSrc) {
    this.collideable = collideable;
    this.destructible = destructible;
    this.interactable = interactable;

    this.textureSrc = textureSrc;
  }
}

class Wall extends Surface{
  constructor(x, y , width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    var textureSrc = null;

    // calling previous constructor, forgot how to do it
    // constructor(true, false, false, textureSrc);
  }
}



class Furniture extends MapObject{
  var direction;
  constructor(x, y, direction){
    //we don't need name for this since each type of furniture has different logic into it -> has to be a seperate class
    this.x = x;
    this.y = y;
    this.direction = direction;
    // return this;
  }
}


class Player {
  var x;
  var y;
  var width;
  var height;
  // var textureSrc;
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;
  }
}


//this is for using functions (classes) in other .js files.
module.exports.Wall = Wall;
module.exports.Furniture = Furniture;


// Detailed definitions for: furnitures
