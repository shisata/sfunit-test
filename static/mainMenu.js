//This section IS NOT done yet
function mainMenu(){
  //isGameStart is used for starting the game level, will be reset to false evreytime the game level ends
  var isGameStart = false;
  var teamList = [];
  var globalPlayerList = [];
  displayTeam();
  displayGlobalPlayersMenu();
  displaySearch();
  while(!isGameStart){
    updateTeamInfo();
    displayTeam();
    updateGlobalPlayers();
    displayGlobalPlayersMenu();

    checkReady();
    //initiateStart();
  }
}

//display coop team, including ready and start button
function displayTeam(){

}

//get info from server to see player join in or out
function updateTeamInfo(){

}

//display currently online players
function displayGlobalPlayersMenu(){

}

//get info from server to see online players
function updateGlobalPlayers(){

}

//check to see if every player in team is ready
function checkReady(){

}
