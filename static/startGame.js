fuction startGame(){
  var isGameOver = false;
  initGame();
  while(!isGameOver){
    gameLoop();
  }
}


//create map, element placements, player info
function initGame(){
  //Reading json file.
  //The whole map data is read from JSON file and saved to 'mapData'.
  //this is copy-pasted from https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824
  const fs = require('fs')
  var mapData;
  //The link to JSON file is currently set to 'testMap'. When implementing map-choosing feature, modify the file link.
  fs.readFile('static/objects/testMap.json', 'utf8', (err, mapDataString) => {
      if (err) {
          console.log("File read failed:", err);
          return;
      }
      mapData = JSON.parse(mapDataString);
      //console.log(JSON.stringify(mapData)); //will show the whole map data in console.
  })

  //TODO: create functions to construct map variables. Hailey will do this!

}

//where the game runs
function gameLoop(){

}
