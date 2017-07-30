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

  var FONT_WIDTH = 20;
  var FONT_HEIGHT = 20;
  var CURSOR_WIDTH = 12;
  var CURSOR_HEIGHT = 26;
  var CHARS_PER_LINE = 23;
  var LINES = 24;

  var ENERGY_RELOAD = 5;

  var drop_stone;
  var pick_stone;
  var hit_wall;
  var step;
  var rotate;

  var editor;
  var editorText;
  var editorCursor;

  var robot;
  var speed = 1;
  var testScript = "" +
    "function run() {\n" +
    "  turnRight();\n" +
    "  turnRight();\n" +
    "  forward();\n" +
    "  turnLeft();\n" +
    "  forward();\n" +
    "  forward();\n" +
    "  forward();\n" +
    "  turnRight();\n" +
    "  forward();\n" +
    "  turnRight();\n" +
    "  forward();\n" +
    "  forward();\n" +
    "  turnLeft();\n" +
    "  forward();\n" +
    "  turnLeft();\n" +
    "  forward();\n" +
    "  forward();\n" +
    "}";

  var moves = [];
  eval(testScript);
  run();
  var currentMove = -1;
  var targetPosition = {};
  var targetAngle;
  var energy = 7;
  var stones = [];
  var boxes = [];
  var batteries = [];

  var energyLabel;

  var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', {
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
    game.load.image('stone', 'images/pedra.png');
    game.load.image('box', 'images/box.png');
    game.load.image('battery', 'images/battery.png');
    game.load.image('editor', 'images/editor.png');
    game.load.image('cursor', 'images/cursor.png');

    game.load.audio('drop_stone', 'sounds/drop_stone.wav');
    game.load.audio('pick_stone', 'sounds/pick_stone.wav');
    game.load.audio('hit_wall', 'sounds/hit_wall.wav');
    game.load.audio('step', 'sounds/step.wav');
    game.load.audio('rotate', 'sounds/rotate.wav');
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

    editor = game.add.sprite(300, 50, 'editor');

    editorText = game.add.text(0, 0, testScript);
    editorText.font = "'Courier New', Courier, monospace";
    editorText.fontSize = FONT_WIDTH;
    editor.addChild(editorText);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(robot, Phaser.Physics.ARCADE);


    drop_stone = game.add.audio('drop_stone');
    drop_stone.allowMultiple = true;

    pick_stone = game.add.audio('pick_stone');
    pick_stone.allowMultiple = true;

    hit_wall = game.add.audio('hit_wall');
    hit_wall.allowMultiple = true;

    step = game.add.audio('step');
    step.allowMultiple = true;

    rotate = game.add.audio('rotate');
    rotate.allowMultiple = true;
    rotate.addMarker('turn', 0.4, 1.0);
    rotate.addMarker('step', 0, 0.3);

    editorCursor = game.add.sprite(0, 0, 'cursor');
    editorCursor.width = CURSOR_WIDTH;
    editorCursor.height = CURSOR_HEIGHT;
    editor.addChild(editorCursor);

    game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR]);
    game.input.keyboard.onDownCallback = write;

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
        rotate.play('turn');
      turn(90);
      break;
      case "turnLeft":
        rotate.play('turn');
      turn(-90);
      break;
      default:
        throw new Error("Deu merda! " + moves[currentMove]);
    }

    energyLabel.setText(energy);
  }

  function moveForward() {
    targetPosition = { x: robot.x, y: robot.y };
    playNextMoveSound();

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

  function turn(degrees) {
    var oldAngle = robot.angle;
    robot.angle += degrees;
    targetAngle = Math.round(robot.angle);
    robot.angle = oldAngle;
  }

  function render() {
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

  function playNextMoveSound() {
    console.log("WTF")
    switch(nextCell()) {
      case STONE:
        console.log("STONE")
        pick_stone.play();
      break;
      case BOX:
        console.log("BOX")
        drop_stone.play();
      break;
      default:
        console.log("STEP")
        step.play();
      break;
    }
  }

  function write(event) {
    var keyCode = event.keyCode;

    var isBackspace = keyCode == 8;
    var isReturn = keyCode == 13;
    var isUp = keyCode == 38;
    var isRight = keyCode == 39;
    var isDown = keyCode == 40;
    var isLeft = keyCode == 37;
    var isPrintable = 
      (keyCode > 47 && keyCode < 58)   || // number keys
      keyCode == 32 || keyCode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
      (keyCode > 64 && keyCode < 91)   || // letter keys
      (keyCode > 95 && keyCode < 112)  || // numpad keys
      (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
      (keyCode > 218 && keyCode < 223);   // [\]' (in order)

    var coords = getCursorCoordinates();
    if (isReturn) {
      writeChar("\n");
      setCursorCoordinates(0, coords.y + 1);
    } else if (isPrintable) {
      writeChar(event.key);
      setCursorCoordinates(coords.x + 1, coords.y);
    } else if (isBackspace) {
      deleteChar();
    } else if (isUp) {
      setCursorCoordinates(coords.x, coords.y - 1);
    } else if (isRight) {
      setCursorCoordinates(coords.x + 1, coords.y);
    } else if (isDown) {
      setCursorCoordinates(coords.x, coords.y + 1);
    } else if (isLeft) {
      setCursorCoordinates(coords.x - 1, coords.y);
    }
  };

  function writeChar(char) {
    var lines = getLines();
    var coords = getCursorCoordinates();
    var line = lines[coords.y];
    if (line.length >= CHARS_PER_LINE) { return; }
    line = line.substr(0, coords.x) + char + line.substr(coords.x);
    lines[coords.y] = line;
    editorText.text = lines.join("\n");
  }

  function deleteChar() {
    var lines = getLines();
    var coords = getCursorCoordinates();
    var line = lines[coords.y];

    if (coords.x > 0) {
      line = line.substr(0, coords.x - 1) + line.substr(coords.x);
      lines[coords.y] = line;
      setCursorCoordinates(coords.x - 1, coords.y);
    } else {
      var previousLine = lines[coords.y - 1];
      var previousLength = previousLine.length;
      previousLine = previousLine + line;
      lines[coords.y - 1] = previousLine;
      lines.splice(coords.y, 1);
      setCursorCoordinates(previousLength, coords.y - 1);
    }
    editorText.text = lines.join("\n");
  }

  function setCursorCoordinates(column, row) {
    var lines = getLines();
    if (column < 0) {
      row -= 1;
      var line = lines[row];
      column = line && line.length || 0;
    } else if (column > CHARS_PER_LINE) {
      column = CHARS_PER_LINE;
    } else if (lines[row] && column > lines[row].length && row < lines.length) {
      column = 0;
      row += 1;
    }

    if (row < 0) {
      row = 0;
    } else if (row > lines.length - 1) {
      row = lines.length - 1;
    }

    editorCursor.x = column * CURSOR_WIDTH;
    editorCursor.y = row * CURSOR_HEIGHT;
  }

  function getCursorCoordinates() {
    return {
      x: Math.floor((editorCursor.x + 1) / CURSOR_WIDTH),
      y: Math.floor((editorCursor.y + 1) / CURSOR_HEIGHT),
    };
  }

  function getLines() {
    return editorText.text.split("\n");
  }
};
