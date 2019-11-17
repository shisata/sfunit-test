
//Paste these onto HTML file to import jquery library
// <head>
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
// </head>

function getWeather()
{
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(weather);
  }
  else {
    alert(`Geolocation is not supported in your browser`);
  };
};
//Update information on HTML file

//Sending API request with given geolocation
function weather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const URL =
    'https://fcc-weather-api.glitch.me/api/current?lat='+lat+'&lon='+lon;

  $.getJSON(URL, function(data){
      console.log(data.weather[0].main);
      console.log(data.weather[0].icon);
      var weather = data.weather[0].main;
      var icon = data.weather[0].icon;

      // $('#label').html(weather);
      if (icon)
        $("#icon").attr("src",icon);
      else {
        $("#icon").attr("src","/image/weather-cloudy.jpg");
      }
//     // updateDOM(data);
  });
};

//When the document is ready, evoke the followed function
$(document).ready(function(){
  getWeather();
  setInterval(getWeather,60000);
});
