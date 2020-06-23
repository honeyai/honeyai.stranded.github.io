var g = {};
var INITIAL_DELAY = 40;
var SHIP_RADIUS = 10;
var ASTRONAUT_RADIUS = 5;
var SAVE_ASTRONAUT = 10;
var SLOWING_DOWN = false;

function initialize(){
  //CANVAS
  g.canvas = document.getElementById("canvas");
  g.context = g.canvas.getContext("2d");

  //DRAWING PLAYER
  g.shipStart = makePoint(g.canvas.width/2, (g.canvas.height-g.canvas.width/4));
  g.ship = pullImage(g.shipStart, 100, 100, document.getElementById("ship"));

  //DRAWING ASTRONAUTS
  g.astronauts = [];

  //DRAWING stars
  g.stars  = [];

  //LISTEN TO MOVEMENT
  document.addEventListener("keydown", keyDownhandler);
  document.addEventListener("keyup", keyUphandler);
  document.addEventListener("keyup", slowStop);

  //TURN ON GAME & CREATE ARRAY OBJECTS, COLLISION DETECTION ETC.
  g.gameOn = true;
  g.delay = INITIAL_DELAY;
  g.continue = 0;
  gameStep();
}

function pullImage(point, width, height, image, dx, dy){
  if (dx === undefined){
    dx = 0;
  }
  if (dy === undefined){
    dy = 0;
  }
  var obj = {
    image: image,
    corner: point,
    width: width,
    height: height,
    dx: dx,
    dy: dy,
    move: function() {
      var newPoint = translatePoint(this.corner, this.dx, this.dy);
      if (newPoint.x >= 0 && newPoint.x <= g.canvas.width - this.width) {
        this.corner = newPoint;
      }
    },
    imageDraw: function(){
      g.context.drawImage(this.image, this.corner.x, this.corner.y, this.width, this.height);
    },
    collision: function(thing) {
      var d = distance(this.corner.x, thing.center);
      return (d < this.corner + thing.radius);
    }
  };
  return obj;
}

function createStars(point, width, height, dx, dy){
  if (dx === undefined){
    dx = 0;
  }
  if (dy === undefined){
    dy = 0;
  }
  var obj = {
    corner: point,
    width: width,
    height: height,
    dx: dx,
    dy: dy,
    move: function() {
      this.corner = translatePoint(this.corner, this.dx, this.dy);
    },
    starDraw: function(){
      g.context.beginPath();
      g.context.rect(this.corner.x, this.corner.y, this.width, this.height);
      g.context.strokeStyle = "#E8E4F0";
      g.context.stroke();
    }
  };
  return obj;
}

function createCircle(point, r, dx, dy, color, type){
  if (dx === undefined){
    dx = 0;
  }
  if (dy === undefined){
    dy = 0;
  }
  var obj = {
    type: type,
    radius: r,
    center: point,
    dx: dx,
    dy: dy,
    move: function() {
      if (this.center.x <= 0 || this.center.x >= g.canvas.width) {
        this.dx = -this.dx;
      }
      this.center = translatePoint(this.center, this.dx, this.dy);
    },
    objDraw: function(){
      g.context.beginPath();
      g.context.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
      g.context.strokeStyle = "black";
      g.context.stroke();
    },
    collision: function(thing) {
      var d = distance(this.center, thing.center);
      return (d < this.radius + thing.radius);
    }
  };
  return obj;
}

function keyDownhandler(event){
  if (event.key === "ArrowLeft") {
    SLOWING_DOWN = false;
    g.ship.dx = -5;
  } else if (event.key === "ArrowRight"){
    SLOWING_DOWN = false;
    g.ship.dx = +5;
  }
}

function keyUphandler(event){
  if (event.key === "ArrowLeft" || event.key === "ArrowRight"){
    SLOWING_DOWN = true;
    slowStop();
  }
}

function makePoint(x, y){
  var obj = {x:x, y:y};
  return obj;
}

function translatePoint(point, dx, dy){
  return makePoint(point.x + dx, point.y + dy);
}

function astronautStart(){
  return makePoint(Math.random() * g.canvas.width, 0);
}

function starStart(){
  return makePoint(Math.random() * g.canvas.width, 0);
}

function distance(p0, p1) {
  var dx = p0.x - p1.x;
  var dy = p0.y - p1.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function slowStop(){
  if (SLOWING_DOWN){
    if (Math.abs(g.ship.dx) > .001) {
      g.ship.dx = g.ship.dx * .9;
      setTimeout(slowStop, 100);
    } else {
      SLOWING_DOWN = false;
    }
  }
}

function gameStep(){
  var i;
  var collect = false;
  var last = null;
  if (g.gameOn){
    i = 0;
    var rndStarNum = (Math.random() * 10) + 8;
    var randomSpeed = Math.random() * 5;
    while (!collect && i < g.astronauts.length){
      if (g.ship.collision(g.astronauts[i])){
        collect = true;
      } else {
        i++;
      }
    }
    if (collect) {
      last = g.astronauts.pop();
      if (i !== g.astronauts.length){
        g.astronauts[i] = last;
      }
    }
    if (g.continue % SAVE_ASTRONAUT === 0){
      g.astronauts.push(createCircle(astronautStart(),ASTRONAUT_RADIUS, 0, 1 + randomSpeed));
    }
    i = 0;
    while (i < g.astronauts.length){
      g.astronauts[i].move();
      i++;
    }
    i = 0;
    while (i < g.stars.length){
      g.stars[i].move();
      i++;
    }
    g.ship.move();
    g.stars.push(createStars(starStart(), 1, rndStarNum, 0, 1 + rndStarNum));
    render();
  }
  setTimeout(gameStep, g.delay);
}

//PROBLEM == WILL GENERATE MORE 'astronauts' IF COLLECTED BUT NOT IF YOU MISS THEM
function render(){
  g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
  g.ship.imageDraw();
  var i = 0;
    if (i < g.astronauts.length) {
      g.astronauts[i].objDraw();
      i++;
    }
    i = 0;
    while (i < g.stars.length){
      g.stars[i].starDraw();
      i++;
    }
}
