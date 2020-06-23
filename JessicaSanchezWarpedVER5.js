var g = {};
var INITIAL_DELAY = 40;
var SAVE_ASTRONAUT = 10;
var SLOWING_DOWN = false;
var MAX_ASTRONAUT = 5;
var DELAY = 2000000000;

function initialize() {
  //CANVAS
  g.canvas = document.getElementById("canvas");
  g.context = g.canvas.getContext("2d");

  //DRAWING PLAYER
  g.shipStart = makePoint(Math.floor(g.canvas.width/2.5), Math.floor(g.canvas.height-g.canvas.width/4));
  g.ship = pullImage(g.shipStart, 150, 150, document.getElementById("ship"));

  //DRAWING ASTRONAUTS
  g.drop = 0;
  g.astronauts = [];
  g.aImages = [document.getElementById("astronaut"), document.getElementById("astronaut2"), document.getElementById("astronaut3")];

  //DRAWING stars
  g.stars  = [];

  //LISTEN TO MOVEMENT
  document.addEventListener("keydown", keyDownhandler);
  document.addEventListener("keyup", keyUphandler);

  //TURN ON GAME & CREATE ARRAY OBJECTS, COLLISION DETECTION ETC.
  g.gameOn = false;
  g.delay = INITIAL_DELAY;
  g.continue = 0;
  gameStep();
  alwaysDraw();
}

function pullImage(point, width, height, image, dx, dy){
  if (dx === undefined) {
    dx = 0;
  }
  if (dy === undefined) {
    dy = 0;
  }
  var obj = {
    corner: point,
    width: width,
    height: height,
    image: image,
    dx: dx,
    dy: dy,
    move: function() {
      var newPoint = translatePoint(this.corner, this.dx, this.dy);
      if (newPoint.x >= 0 && newPoint.x <= g.canvas.width - this.width) {
        this.corner = newPoint;
      }
    },
    draw: function() {
      g.context.drawImage(this.image, this.corner.x, this.corner.y,  this.width, this.height);
    },
    collision: function(thing) {
      var thisPoint = makePoint((this.corner.x + this.width/2),(this.corner.y + this.height/2));
      var thingPoint = makePoint((thing.corner.x + thing.width/2),(thing.corner.y + thing.height/2));
      var thisRadius = this.width/2;
      var thingRadius = thing.width/2;
      var d = distance(thisPoint, thingPoint);
      return (d < (thisRadius + thingRadius));
    }
  };
  return obj;
}

function createStars(point, width, height, dx, dy){
  if (dx === undefined) {
    dx = 0;
  }
  if (dy === undefined) {
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
    starDraw: function() {
      g.context.beginPath();
      g.context.rect(this.corner.x, this.corner.y, this.width, this.height);
      g.context.strokeStyle = "#E8E4F0";
      g.context.stroke();
    }
  };
  return obj;
}

function keyDownhandler(event) {
  if (event.key === "ArrowLeft") {
    SLOWING_DOWN = false;
    g.ship.dx = -5;
  } else if (event.key === "ArrowRight") {
    SLOWING_DOWN = false;
    g.ship.dx = +5;
  }
}

function keyUphandler(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight"){
    SLOWING_DOWN = true;
    slowStop();
  }
  if (event.key === " ") {
    g.gameOn = !g.gameOn;
  }
}

function slowStop() {
  if (SLOWING_DOWN) {
    if (Math.abs(g.ship.dx) > .001) {
      g.ship.dx = g.ship.dx * .9;
      setTimeout(slowStop, 100);
    } else {
      SLOWING_DOWN = false;
    }
  }
}

function gameStep() {
  var i;
  var collect = false;
  var last = null;
  if (g.gameOn === true) {
    i = 0;
    while (!collect && i < g.astronauts.length){
      if (g.ship.collision(g.astronauts[i])){
        collect = true;
      } else {
        i++;
      }
    }
    if (collect) {
      last = g.astronauts.pop();
      if (i !== g.astronauts.length) {
        g.astronauts[i] = last;
      }
    }
    if (g.astronauts.length < MAX_ASTRONAUT){
      var randomSpeed = Math.random() * 5;
      var picker = Math.floor(Math.random() * 3);
      g.astronauts.push(pullImage(astronautStart(), 100, 100, g.aImages[picker], 0, 1 + randomSpeed));
    }
    i = 0;
    while (i < g.astronauts.length) {
      g.astronauts[i].move();
      i++;
    }
    i = 0;
    while (i < g.stars.length) {
      g.stars[i].move();
      i++;
    }
    var randomSpeed = Math.random() * 5;
    var rndStarNum = (Math.random() * 10) + 8;
    g.ship.move();
    g.stars.push(createStars(starStart(), 1, rndStarNum, 0, 1 + randomSpeed));
    render();
    drop();
  }
  setTimeout(gameStep, g.delay);
}

function render() {
  g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
  g.ship.draw();
  var i;
  i = 0;
  while ((i < g.astronauts.length) && g.drop < DELAY) {
    g.astronauts[i].draw();
    i++;
  }
  i = 0;
  while (i < g.stars.length) {
    g.stars[i].starDraw();
    i++;
  }
}

function drop() {
  if (g.gameOn === true){
    if (g.drop > DELAY){
      console.log(g.drop);
      g.drop = g.drop - 1;
    } else if (g.drop < DELAY){
      g.drop = g.drop + 1;
    }
  }
  setTimeout(drop, g.delay);
}

function alwaysDraw() {
  if (g.gameOn === false) {
    var i;
    var rndStarNum = (Math.random() * 10) + 8;
    var randomSpeed = Math.random() * 5;
    g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.stars.push(createStars(starStart(), 1, rndStarNum, 0, 1 + randomSpeed));
    g.ship.draw();
    i = 0;
    while (i < g.stars.length) {
      g.stars[i].starDraw();
      g.stars[i].move();
      i++;
    }
    g.context.font = "30px Quicksand";
    g.context.fillStyle = "#F2EFC2";
    g.context.textAlign = "center";
    g.context.fillText("Press space to start", g.canvas.width/2, g.canvas.height/2);
    g.context.fillText("Left and Right arrow keys to move", g.canvas.width/2, g.canvas.height/4);
    g.context.fillText("Save the astronauts", g.canvas.width/2, g.canvas.height/6);
    g.context.fillText("Don't miss more than three", g.canvas.width/2, g.canvas.height/4.85);
    setTimeout(alwaysDraw, 40);
  }
  if (g.gameOn === true) {
    gameStep();
  }
}

function distance(p0, p1) {
  var dx = p0.x - p1.x;
  var dy = p0.y - p1.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function makePoint(x, y) {
  var obj = {x:x, y:y};
  return obj;
}

function translatePoint(point, dx, dy) {
  return makePoint(point.x + dx, point.y + dy);
}

function astronautStart() {
  return makePoint(Math.floor(Math.random() * g.canvas.width), 0);
}

function starStart() {
  return makePoint(Math.random() * g.canvas.width, 0);
}
