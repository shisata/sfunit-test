//size of the grid. the program should run even if this constant variable is changed.
const var GRID_SIZE = 5;

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
}

class Wall extends MapObject {
  constructor(x, y, width, height, textureLink) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.texture = new Image();
    this.texture.src = textureLink;

    this.collideable = true;
    this.distructible = false;
    this.interactable = false;
  }
}

// TODO: class Vend, Exit, Couch, etc.
