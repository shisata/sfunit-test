
//Paste these onto HTML file to import jquery library
// <head>
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
// </head>

function getLocation()
{
  console.log('getLocation() called');
  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(getWeather, noLocation);
  }
  else
  {
    alert(`Geolocation is not supported in your browser`);
  };
};

function noLocation(error) {
  if (error)
  {
    console.log('Location unavailable, using SFU location:');
    const position = {'coords':{'latitude':'49.2785182',
                                'longitude':'-122.9198392'}};
    getWeather(position);
  };
}

//Sending API request with given geolocation
function getWeather(position) {
  console.log('Sending weather API request');
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const APIKEY= `44c3c5b6dfdc148055677bde4d8e396d`;
  const URL =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APIKEY}`;
    // 'https://fcc-weather-api.glitch.me/api/current?lat='+lat+'&lon='+lon;
  $.getJSON(URL, function(data){
    // console.log('latitude: '+lat);
    // console.log(data.weather[0].main);
    // console.log(data.weather[0].icon);
    var weather = data.weather[0].main;
    var icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      // $('#label').html(weather);
    if (icon)
      $("#icon").attr("src",icon);
    else {
      $("#icon").attr("src","/image/weather-cloudy.jpg");
    }
  });
};

function rain() {
  var canvas = $('#canvas')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if(canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeStyle = 'rgba(174,194,224,0.5)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';


    var init = [];
    var maxParts = 1000;
    for(var a = 0; a < maxParts; a++) {
      init.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10
      })
    }

    var particles = [];
    for(var b = 0; b < maxParts; b++) {
      particles[b] = init[b];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for(var c = 0; c < particles.length; c++) {
        var p = particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      }
      move();
    }

    function move() {
      for(var b = 0; b < particles.length; b++) {
        var p = particles[b];
        p.x += p.xs;
        p.y += p.ys;
        if(p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -20;
        }
      }
    }

    setInterval(draw, 300);
  }
};


function lightning() {
  var size = 500;
  var c = document.getElementById("canvas");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  var ctx = c.getContext("2d");

  var center = {x: c.width / 2, y: 20};
  var minSegmentHeight = 5;
  var groundHeight = size - 20;
  var color = "hsl(180, 80%, 80%)";
  var roughness = 2;
  var maxDifference = size / 5;

  ctx.globalCompositeOperation = "lighter";

  ctx.strokeStyle = color;
  ctx.shadowColor = color;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "hsla(0, 0%, 10%, 0.2)";

  function render() {
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 15;
    var lightning = createLightning();
    ctx.beginPath();
    for (var i = 0; i < lightning.length; i++) {
      ctx.lineTo(lightning[i].x, lightning[i].y);
    }
    ctx.stroke();
    requestAnimationFrame(render);
  }

  function createLightning() {
  var segmentHeight = groundHeight - center.y;
  var lightning = [];
  lightning.push({x: center.x, y: center.y});
  lightning.push({x: Math.random() * (size - 100) + 50, y: groundHeight + (Math.random() - 0.9) * 50});
  var currDiff = maxDifference;
  while (segmentHeight > minSegmentHeight) {
    var newSegments = [];
    for (var i = 0; i < lightning.length - 1; i++) {
      var start = lightning[i];
      var end = lightning[i + 1];
      var midX = (start.x + end.x) / 2;
      var newX = midX + (Math.random() * 2 - 1) * currDiff;
      newSegments.push(start, {x: newX, y: (start.y + end.y) / 2});
    }

    newSegments.push(lightning.pop());
    lightning = newSegments;

    currDiff /= roughness;
    segmentHeight /= 2;
  }
  return lightning;
  };

  render();
};




//When the document is ready, evoke the followed function
$(document).ready(function(){
  getLocation();
  setInterval(getLocation,2000);
  //rain();
  // lightning();
});
