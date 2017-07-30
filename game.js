window.onload = function() {
  //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
  //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
  //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

  var grid = [
    [1,0,1,1,1,1],
    [1,2,4,3,1,1],
    [0,1,1,4,1,1],
    [0,2,1,3,1,1],
    [0,1,1,1,1,1],
  ];

  var CELL_WIDTH = 55;
  var WALL = 0;
  var PATH = 1;
  var STONE = 2;
  var BOX = 3;
  var BATTERY = 4;

  var FACE_UP = 0;
  var FACE_RIGHT = 90;
  var FACE_DOWN = -180;
  var FACE_LEFT = -90;

  var GRID_LEFT = 0;
  var GRID_TOP = 0;
  var GRID_WIDTH = grid[0].length * CELL_WIDTH;
  var GRID_HEIGHT = grid.length * CELL_WIDTH;
  var GRID_BOTTOM = GRID_TOP + GRID_HEIGHT;
  var GRID_RIGHT = GRID_LEFT + GRID_WIDTH;

  var ENERGY_RELOAD = 5;

  var robot;
  var speed = 1;
  var testScript = "" +
  "function run() {" +
  "  turnRight();" +
  "  turnRight();" +
  "  forward();" +
  "  turnLeft();" +
  "  forward();" +
  "  forward();" +
  "  forward();" +
  "  turnRight();" +
  "  forward();" +
  "  turnRight();" +
  "  forward();" +
  "  forward();" +
  "  turnLeft();" +
  "  forward();" +
  "  turnLeft();" +
  "  forward();" +
  "  forward();" +
  "}";
  var moves = [];
  eval(testScript);
  run();
  var currentMove = -1;
  var targetPosition = {};
  var targetAngle;
  var energy = 7;
  var energyLabel;

  var stones = [];
  var boxes = [];
  var batteries = [];

  var game = new Phaser.Game(1100, 825, Phaser.AUTO, '', {
      preload: preload,
      create: create,
      update: update,
      render: render,
  });
  window.game = game;

  function preload () {
      game.load.image('robot', 'images/player.png');
      game.load.image('wall', 'images/wall.png');
      game.load.image('path', 'images/path.png');
      game.load.image('battery', 'images/battery.png');
      game.load.image('stone', 'images/pedra.png');
      game.load.image('box', 'images/box.png');
  }

  function create () {
    grid.forEach(function(cells, row) {
      cells.forEach(function(cell, column) {
        switch(cell) {
          case WALL:
            var wall = game.add.sprite(0, 0, 'wall');
            wall.anchor.setTo(0.5, 0.5);
            setPosition(wall, row, column);
            break;
          case PATH:
            addPath(column, row);
            break;
          case STONE:
            var stone = game.add.sprite(0, 0, 'stone');
            stone.anchor.setTo(0.5, 0.5);
            setPosition(stone, row, column);
            stones.push(stone);
            addPath(column, row);
            break;
          case BOX:
            var box = game.add.sprite(0, 0, 'box');
            box.anchor.setTo(0.5, 0.5);
            setPosition(box, row, column);
            boxes.push(box);
            addPath(column, row);
            break;
          case BATTERY:
            var battery = game.add.sprite(0, 0, 'battery');
            battery.anchor.setTo(0.5, 0.5);
            setPosition(battery, row, column);
            batteries.push(battery);
            addPath(column, row);
            break;
        }
      });
    });

    boxes.forEach(function(box) {
      box.bringToTop();
      game.physics.enable(box, Phaser.Physics.ARCADE);
    });

    stones.forEach(function(stone) {
      stone.bringToTop();
      game.physics.enable(stone, Phaser.Physics.ARCADE);
    });

    batteries.forEach(function(battery) {
      battery.bringToTop();
    });

    robot = game.add.sprite(0, 0, 'robot');
    robot.anchor.setTo(0.5, 0.5);
    robot.angle = 0;
    setPosition(robot, 0, 0);


    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(robot, Phaser.Physics.ARCADE);

    game.stage.backgroundColor = 0xcccccc;
    energyLabel = game.add.text(400, 0, energy);
    setNextMove();
  }

  function addPath(row, column) {
      var path = game.add.sprite(0, 0, 'path');
      path.sendToBack();
      path.anchor.setTo(0.5, 0.5);
      setPosition(path, column, row);
  }

  function setPosition(sprite, row, column){
    sprite.x = (55 * column) + 27;
    sprite.y = (55 * row) + 27;
  }


  function update() {
    stones.forEach(function(stone) {
      game.physics.arcade.collide(robot, stone, collisionStoneHandler);
    });

    boxes.forEach(function(box) {
      game.physics.arcade.collide(robot, box, collisionBoxHandler);
    });

    switch (moves[currentMove]) {
      case "forward":
        if (isMovingForward()) {
          switch(Math.round(robot.angle)) {
            case FACE_UP:
              robot.y -= speed;
              break;
            case FACE_RIGHT:
              robot.x += speed;
              break;
            case FACE_DOWN:
              robot.y += speed;
              break;
            case FACE_LEFT:
              robot.x -= speed;
              break;
            default:
              throw new Error("Unrecognized angle: " + robot.angle);
          }
        } else if (currentMove < moves.length) {
          setNextMove();
        }
        break;
      case "turnRight":
        if (isTurning()) {
          robot.angle = Math.round(robot.angle + speed);
        } else {
          setNextMove();
        }
        break;
      case "turnLeft":
        if (isTurning()) {
          robot.angle = Math.round(robot.angle - speed);
        } else {
          setNextMove();
        }
        break;
    }
  }

  function setNextMove() {
    if (getCurrentCell() == BATTERY) {
      pickBattery();
    }

    if (currentMove + 1 >= moves.length) { return; }
    if (!hasEnergy()) { return; }
    currentMove += 1;
    energy = energy - 1;
    switch(moves[currentMove]) {
      case "forward":
        if (canMoveForward()) {
          moveForward();
        } else {
          currentMove++;
          setNextMove();
        }
        break;
      case "turnRight":
        turn(90);
        break;
      case "turnLeft":
        turn(-90);
        break;
      default:
        throw new Error("Deu merda! " + moves[currentMove]);
    }


    energyLabel.setText(energy);
  }

  function pickBattery() {
    energy += ENERGY_RELOAD;
    var battery = findSprite(batteries);
    var robotCoords = getRobotCoordinates();

    battery.destroy();
    batteries.splice(batteries.indexOf(battery), 1);
    grid[robotCoords.y][robotCoords.x] = PATH;
  }

  function findSprite(sprites) {
    var robotCoords = getRobotCoordinates();
    return sprites.filter(function(sprite) {
      var coords = getSpriteCoordinates(sprite);
      return coords.x == robotCoords.x && coords.y == robotCoords.y;
    })[0];
  }

  function hasEnergy() {
    return energy >= 1;
  }

  function moveForward() {
    targetPosition = { x: robot.x, y: robot.y };
    switch(Math.round(robot.angle)) {
      case FACE_UP:
        targetPosition.y -= CELL_WIDTH;
        break;
      case FACE_RIGHT:
        targetPosition.x += CELL_WIDTH;
        break;
      case FACE_DOWN:
        targetPosition.y += CELL_WIDTH;
        break;
      case FACE_LEFT:
        targetPosition.x -= CELL_WIDTH;
        break;
      default:
        throw new Error("Unrecognized angle: " + robot.angle);
    }
  }

  function turn(degrees) {
    var oldAngle = robot.angle;

    robot.angle += degrees;
    targetAngle = Math.round(robot.angle);

    robot.angle = oldAngle;
  }

  function isMovingForward() {
    return robot.y != targetPosition.y || robot.x != targetPosition.x;
  }

  function isTurning() {
    return Math.round(robot.angle) != targetAngle;
  }

  function forward() {
    moves.push("forward");
  }

  function turnLeft() {
    moves.push("turnLeft");
  }

  function turnRight() {
    moves.push("turnRight");
  }

  function render() {
    game.debug.bodyInfo(robot);
  }

  function canMoveForward() {
    return nextCell() != WALL;
  }

  function nextCell() {
    var robotCoords = getRobotCoordinates();
    switch(Math.round(robot.angle)) {
      case FACE_UP:
        robotCoords.y--;
        break;
      case FACE_RIGHT:
        robotCoords.x++;
        break;
      case FACE_DOWN:
        robotCoords.y++;
        break;
      case FACE_LEFT:
        robotCoords.x--;
        break;
      default:
        throw new Error("Unrecognized angle: " + robot.angle);
    }

    return grid[robotCoords.y][robotCoords.x];
  }

  function getCurrentCell() {
    return getCell(getRobotCoordinates());
  }

  function getCell(coords) {
    return grid[coords.y][coords.x];
  }

  function getRobotCoordinates() {
    return getSpriteCoordinates(robot);
  }

  function getSpriteCoordinates(sprite) {
    var relativeX = sprite.x - GRID_LEFT;
    var relativeY = sprite.y - GRID_TOP;

    return {
      x: Math.floor(relativeX / CELL_WIDTH),
      y: Math.floor(relativeY / CELL_WIDTH),
    };
  }

  function collisionStoneHandler(robot, stone) {
    robot.addChild(stone);
    stone.x = 0;
    stone.y = 0;
  }

  function collisionBoxHandler(robot, box) {
    var stone = robot.removeChildAt(0);
    stone.x = box.x;
    stone.y = box.y;
    boxes.splice(boxes.indexOf(box), 1);
    stones.splice(stones.indexOf(stone), 1);
  }
};
