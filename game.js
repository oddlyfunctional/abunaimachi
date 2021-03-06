window.onload = function() {
  //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
  //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
  //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

  var grids = [
		[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,6,2,3,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		],
		[
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,0,2,1,3,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		],
	];

  var grid;
	var currentGrid = 0;

  var CELL_WIDTH = 55;
  var WALL = 0;
  var PATH = 1;
  var STONE = 2;
  var BOX = 3;
  var BATTERY = 4;
  var ROBOT_UP = 5;
  var ROBOT_RIGHT = 6;
  var ROBOT_DOWN = 7;
  var ROBOT_LEFT = 8;

  var FACE_UP = 0;
  var FACE_RIGHT = 90;
  var FACE_DOWN = -180;
  var FACE_LEFT = -90;

	var GRID_ROWS = 15;
	var GRID_COLUMNS = 20;
  var GRID_LEFT = 700;
  var GRID_TOP = 200;
  var GRID_WIDTH = GRID_COLUMNS * CELL_WIDTH;
  var GRID_HEIGHT = GRID_ROWS * CELL_WIDTH;
  var GRID_BOTTOM = GRID_TOP + GRID_HEIGHT;
  var GRID_RIGHT = GRID_LEFT + GRID_WIDTH;

  var EDITOR_WIDTH = 660;
  var EDITOR_HEIGHT = 830;

  var FONT_WIDTH = 30;
  var FONT_HEIGHT = 20;
  window.CURSOR_WIDTH = 17.5;
  window.CURSOR_HEIGHT = 32;
  window.CHARS_PER_LINE = 35;
  var LINES = 23;

  var ENERGY_RELOAD = 5;

  var dropStoneSound;
  var pickStoneSound;
  var hitWallSound;
  var stepSound;
  var rotateSound;
  var pickBatterySound;
  var alertSound;
  var typeSound;
  var bgMusic;

  window.editor;
  window.editorText;
  window.editorCursor;

  var robot;
  var speed = 1;
  var testScript = "" +
    "function run() {\n" +
    "}";

  var moves = [];
  var currentMoveIndex = -1;
  var currentMove;
  var targetPosition = {};
  var targetAngle;
  var isPlaying = false;
  var initialRobotPosition = { row: 1, column: 1 };
  var stones = [];
  var box;
  var batteries = [];
  var paths = [];
  var walls = [];
  var gridBackground;
  var taskbar;

  var initialEnergy = 7;
  var energy = initialEnergy;
  var energyLabel;

  window.mrPointy = null;
  window.mrPointyLabel;
  var mrPointyLines = [
    "Hi, I'm Mr. Pointy!\n" +
    "You have a message\n" +
    "from Mr. Notthere.\n" +
    "Let me read it for you:",

    "''Dear Whatsyourface,\n" +
    "We're out for lunch\n" +
    "celebrating Debra's\n" +
    "(from HR not IT)\n" +
    "birthday.''",

    "''We're still eating,\n" +
    "can u check out this\n" +
    "nuclear nonsense ppl\n" +
    "keep interrupting my\n" +
    "lunch about?''",

    "''Everyone's being\n" +
    "so dramatic, geez,\n" +
    "it's just a little\n" +
    "uranium, grow up\n" +
    "already.''",

    "''Sorry for venting,\n" +
    "It's just that\n" +
    "they're ruining my\n" +
    "kung pow chicken.\n" +
    "It's cold now.''",

    "''Sort it out, ok?\n" +
    "We'll have cake soon\n" +
    "and I wish to enjoy\n" +
    "it without all the\n" +
    "doom drama.''",

    "''See you at 4!\n" +
    "More or less.\n" +
    "Make it 5.\n" +
    "\n" +
    "Mr. Notthere.''",

    "That's all your\n" +
    "messages.\n" +
    "\n" +
    "Keep sharp!\n" +
    "Mr. Pointy out."
  ];

  var mrPointyCurrentLine = -1;

  var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '');

  var LEVEL_1 = {
    preload: preload,
    create: create,
    update: update,
    render: render,
  };

  var SPLASH_SCREEN = {
    preload: function() {
      game.load.image('splash', 'images/splash.png');
    },

    create: function() {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.add.sprite(0, 0, 'splash');
      game.input.keyboard.onDownCallback = function() {
        game.state.start("Level1");
      };
    }
  };

  game.state.add("Level1", LEVEL_1);
  game.state.add("SplashScreen", SPLASH_SCREEN);
  game.state.start("SplashScreen");

  window.game = game;

  function preload () {
    game.load.image('robot', 'images/robot.png');
    game.load.image('wall', 'images/wall.png');
    game.load.image('path', 'images/path.png');
    game.load.image('stone', 'images/stone.png');
    game.load.image('box', 'images/box.png');
    game.load.image('battery', 'images/battery.png');
    game.load.image('editor', 'images/editor.png');
    game.load.image('cursor', 'images/cursor.png');
    game.load.image('play-button', 'images/play-button.png');
    game.load.image('alert', 'images/alert.png');
    game.load.image('alert-button', 'images/alert-button.png');
    game.load.image('grid-window', 'images/grid-window.png');
    game.load.image('energy', 'images/energy.png');
    game.load.image('taskbar', 'images/taskbar.png');
    game.load.image('mrPointy', 'images/mr_pointy.png');

    game.load.audio('dropStoneSound', 'sounds/drop_stone.wav');
    game.load.audio('pickStoneSound', 'sounds/pick_stone.wav');
    game.load.audio('hitWallSound', 'sounds/hit_wall.wav');
    game.load.audio('stepSound', 'sounds/step.wav');
    game.load.audio('rotateSound', 'sounds/rotate.wav');
    game.load.audio('pickBatterySound', 'sounds/pick_battery.wav');
    game.load.audio('alertSound', 'sounds/alert.wav');
    game.load.audio('typeSound', 'sounds/type.wav');
    game.load.audio('mrPointyShow', 'sounds/mr_pointy_show.wav');
    game.load.audio('mrPointyHide', 'sounds/mr_pointy_hide.wav');
    game.load.audio('bgMusic', 'sounds/bgMusic.m4a');
  }

  function destroy(sprite) {
    sprite.destroy();
  }

  function reset() {
    isPlaying = false;
    bgMusic.play();
    grid = JSON.parse(JSON.stringify(grids[currentGrid]));

    while (robot.children.length > 0) {
      robot.removeChildAt(0);
    }

    batteries.forEach(destroy);
    stones.forEach(destroy);
    // boxes.forEach(destroy);
    paths.forEach(destroy);
    walls.forEach(destroy);
    // box.destroy();

    batteries = [];
    stones = [];
    boxes = [];
    paths = [];
    walls = [];

    grid.forEach(function(cells, row) {
      cells.forEach(function(cell, column) {
        switch(cell) {
          case WALL:
            var wall = game.add.sprite(0, 0, 'wall');
            wall.anchor.setTo(0.5, 0.5);
            setPosition(wall, row, column);
            walls.push(wall);
            gridBackground.addChild(wall);
            break;
          case PATH:
            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            break;
          case STONE:
            var stone = game.add.sprite(0, 0, 'stone');
            stone.anchor.setTo(0.5, 0.5);
            setPosition(stone, row, column);
            stones.push(stone);

            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            gridBackground.addChild(stone);
            break;
          case BOX:
            box = game.add.sprite(0, 0, 'box');
            box.anchor.setTo(0.5, 0.5);
            setPosition(box, row, column);
            // boxes.push(box);

            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            gridBackground.addChild(box);
            break;
          case BATTERY:
            var battery = game.add.sprite(0, 0, 'battery');
            battery.anchor.setTo(0.5, 0.5);
            setPosition(battery, row, column);
            batteries.push(battery);

            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            gridBackground.addChild(battery);
            break;
          case ROBOT_UP:
            setPosition(robot, row, column);
            robot.angle = FACE_UP;
            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            break;
          case ROBOT_RIGHT:
            setPosition(robot, row, column);
            robot.angle = FACE_RIGHT;
            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            break;
          case ROBOT_DOWN:
            setPosition(robot, row, column);
            robot.angle = FACE_DOWN;
            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            break;
          case ROBOT_LEFT:
            setPosition(robot, row, column);
            robot.angle = FACE_LEFT;
            var path = addPath(column, row);
            paths.push(path);
            gridBackground.addChild(path);
            break;
        }
      });
    });

    gridBackground.addChild(robot);
    gridBackground.moveDown();
    window.gridBackground = gridBackground;

    boxes.forEach(function(box) {
      box.bringToTop();
    });

    stones.forEach(function(stone) {
      stone.bringToTop();
    });

    batteries.forEach(function(battery) {
      battery.bringToTop();
    });

    currentMoveIndex = -1;
    energy = initialEnergy;
    setEnergyLabel();
    robot.bringToTop();
    taskbar.bringToTop();
  }

  function create() {
    Promise.all([
      new FontFaceObserver('interface').load(),
      new FontFaceObserver('editor').load(),
    ]).then(delayedCreate);
  }

  function delayedCreate() {
    bgMusic = game.add.audio('bgMusic');
    bgMusic.loop = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    var gridWindow = game.add.sprite(GRID_LEFT, GRID_TOP, 'grid-window');
    enableDrag(gridWindow);
    addCloseButton(gridWindow);
    addMinimizeButton(gridWindow, 150, 1100);

    var bg = game.add.bitmapData(GRID_WIDTH, GRID_HEIGHT);
    gridBackground = game.add.sprite(12, 52, bg);
    gridWindow.addChild(gridBackground);

    robot = game.add.sprite(0, 0, 'robot');
    window.robot = robot;
    robot.anchor.setTo(0.5, 0.5);

    editor = game.add.sprite(300, 50, 'editor');
    enableDrag(editor);
    addCloseButton(editor);
    addMinimizeButton(editor, 50, 1100);

    bg = game.add.bitmapData(EDITOR_WIDTH, EDITOR_HEIGHT);
    var editorBackground = game.add.sprite(25, 65, bg);
    editor.addChild(editorBackground);

    editorText = game.add.text(0, 0, testScript, { font: 'editor', });
    editorText.addColor("#c5ff00", 0);
    editorText.fontSize = FONT_WIDTH;
    editorBackground.addChild(editorText);

    dropStoneSound = game.add.audio('dropStoneSound');
    dropStoneSound.volume = 0.5;
    pickStoneSound = game.add.audio('pickStoneSound');
    pickStoneSound.volume = 0.5;
    hitWallSound = game.add.audio('hitWallSound');
    hitWallSound.volume = 0.5;
    stepSound = game.add.audio('stepSound');
    stepSound.volume = 0.2;
    rotateSound = game.add.audio('rotateSound');
    rotateSound.volume = 0.2;
    pickBatterySound = game.add.audio('pickBatterySound');
    pickBatterySound.volume = 0.5;
    alertSound = game.add.audio('alertSound');
    alertSound.volume = 0.5;
    typeSound = game.add.audio('typeSound');
    typeSound.volume = 0.2;

    editorCursor = game.add.sprite(0, 0, 'cursor');
    editorCursor.width = CURSOR_WIDTH;
    editorCursor.height = CURSOR_HEIGHT;
    editorCursor.alpha = 0.6;
    editorCursor.anchor.set(0, 0.15);
    editorBackground.addChild(editorCursor);

    playButton = game.add.button(editorBackground.centerX, editorBackground.height - 20, 'play-button', play);
    playButton.anchor.set(0.5, 1);
    editorBackground.addChild(playButton);

    game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR]);
    game.input.keyboard.onDownCallback = write;

    game.stage.backgroundColor = 0xed2d75;

    energyLabel = game.add.group()
    energyLabel.x = 170
    energyLabel.y = 890;
    gridWindow.addChild(energyLabel);

    taskbar = game.add.sprite(0, game.height, 'taskbar');
    taskbar.anchor.set(0, 1);

    reset();

    mrPointy = game.add.sprite(game.width, game.height, 'mrPointy');
    mrPointy.x -= mrPointy.width;
    mrPointy.inputEnabled = true;
    mrPointy.input.useHandCursor = true
    bgMusic.stop();

    var mrPointyTween = game.add.tween(mrPointy);
    mrPointyTween .onComplete.add(function() {
      mrPointyCurrentLine = 0;
    });
    mrPointyTween.to({ y: mrPointy.y - mrPointy.height }, 500, Phaser.Easing.Bounce.Out, true);

    game.add.audio('mrPointyShow').play();

    mrPointy.events.onInputDown.add(function() {
      var currentLine = mrPointyLines[mrPointyCurrentLine];
      if (currentLine && mrPointyLabel.text.length < currentLine.length) {
        mrPointyLabel.text = currentLine;
        return;
      }

      mrPointyCurrentLine++;
      if (mrPointyCurrentLine < mrPointyLines.length) {
        mrPointyLabel.text = "";
      } else {
        game.add.audio('mrPointyHide').play();

        var mrPointyTween = game.add.tween(mrPointy);
        mrPointyTween .onComplete.add(function() {
          mrPointy.destroy();
          bgMusic.play();
        });
        mrPointyTween.to({ y: mrPointy.y + mrPointy.height }, 500, Phaser.Easing.Quadratic.In, true);
      }
    });

    bg = game.add.bitmapData(300, 120);
    window.mrPointyBg = game.add.sprite(40, 30, bg);
    mrPointy.addChild(mrPointyBg);

    mrPointyLabel = game.add.text(0, 0, "", { font: 'interface' });
    mrPointyLabel.fontSize = 16;
    mrPointyLabel.wordWrap = true;
    mrPointyLabel.wordWrapWidth = 350;
    mrPointyBg.addChild(mrPointyLabel);

    setTimeout(function() {
      editorText.text = editorText.text + " ";
    }, 0);
  }

  function setEnergyLabel() {
    while (energyLabel.children.length > 0) {
      energyLabel.children[0].destroy();
    }

    for(var i = 0; i < energy; i++) {
      energyLabel.addChild(game.add.sprite(35 * i, 0, 'energy'));
    }
  }

  function play() {
    try {
      moves = [];
      eval(editorText.text);
      run();
      reset();
      isPlaying = true;
      bgMusic.pause();
      setNextMove();
    } catch(error) {
      alertSound.play();
      bgMusic.play();
      createAlert("Script error: " + error.message, "Got it");
    }
  }

  function addPath(row, column) {
    var path = game.add.sprite(0, 0, 'path');
    path.sendToBack();
    path.anchor.setTo(0.5, 0.5);
    setPosition(path, column, row);
    return path;
  }

  function setPosition(sprite, row, column){
    sprite.x = (55 * column) + 27;
    sprite.y = (55 * row) + 27;
  }

  function typeMrPointy() {
    var currentLine = mrPointyLines[mrPointyCurrentLine];
    if (currentLine && mrPointyLabel.text.length < currentLine.length) {
      typeSound.play();
      mrPointyLabel.text = currentLine.substr(0, mrPointyLabel.text.length + 1);
    }
  }

  function update() {
    if (mrPointy && mrPointy.alive) { typeMrPointy(); }
    if (!isPlaying) { return; }

    switch (currentMove) {
      case "forward":
        if (isMoving()) {
          updateForward(speed);
        } else {
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
      case "bouncingForward":
        if (isMoving()) {
          updateBouncingForward();
        } else {
          startBouncingBack();
        }
        break;
      case "bouncingBack":
        if (isMoving()) {
          updateBouncingBack();
        } else {
          setNextMove();
        }
        break;
    }
  }

  function startBouncingForward() {
    currentMove = "bouncingForward";
    setTarget(10);
  }

  function startBouncingBack() {
    stepSound.stop();
    hitWallSound.play();
    currentMove = "bouncingBack";
    setTarget(-10);
  }

  function updateBouncingForward() {
    updateForward(speed);
  }

  function updateBouncingBack() {
    updateForward(-speed);
  }

  function updateForward(speed) {
    switch(Math.round(robot.angle)) {
      case FACE_UP:
        robot.y -= speed;
        break;
      case FACE_RIGHT:
        robot.x += speed;
        console.log(robot.x, speed);
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
  }

  function pickStone() {
    if (canMoveForward()) {
      var stone = findSprite(stones);
      var robotCoords = getRobotCoordinates();

      robot.addChild(stone);
      stone.x = 0;
      stone.y = 0;
      grid[robotCoords.y][robotCoords.x] = PATH;
      pickStoneSound.play();
    } else {
      hitWall();
    }
  }

  function hitWall() {
    startBouncingForward();
  }

  function dropStone() {
    if (robot.children.length > 0) {
      var stone = robot.removeChildAt(0);
      stone.x = robot.x;
      stone.y = robot.y;

      box.addChild(stone);
      dropStoneSound.play();
    }
  }

  function setNextMove() {
    [stepSound, rotateSound, hitWallSound, dropStoneSound, dropStoneSound].forEach(function(sound) { sound.stop(); });

    switch (getCurrentCell()) {
      case BATTERY:
        pickBattery();
        break;
      case STONE:
        pickStone();
        break;
      case BOX:
        dropStone();
        break;
    }

    if (hasWon()) {
      createAlert("Congratz, you saved the world!", "Weeee!!", function() {
        currentGrid++;
        if (currentGrid < grids.length) {
          reset();
        } else {
          createAlert("There's nothing more to do now.", "Okay...");
        }
      });
      return;
    }

    if (currentMoveIndex + 1 >= moves.length) {
      reset();
      return;
    }

    if (!hasEnergy()) {
      alertSound.play();
      createAlert("You've ran out of power.", "Fuck.", reset);
      return;
    }
    currentMoveIndex += 1;
    currentMove = moves[currentMoveIndex];
    energy = energy - 1;
    setEnergyLabel();
    switch(currentMove) {
      case "forward":
        if (canMoveForward()) {
          stepSound.play();
          startForward();
        } else {
          hitWall();
        }
        break;
      case "turnRight":
        rotateSound.play();
        turn(90);
        break;
      case "turnLeft":
        rotateSound.play();
        turn(-90);
        break;
      default:
        throw new Error("Deu merda! " + currentMove);
    }
  }

  function hasWon() {
    var withoutBox = stones.filter(function(stone) {
      return stone.parent.key != "box";
    });

    return withoutBox.length == 0;
  }

  function startForward() {
    setTarget(CELL_WIDTH);
  }

  function setTarget(offset) {
    targetPosition = { x: robot.x, y: robot.y };

    switch(Math.round(robot.angle)) {
      case FACE_UP:
        targetPosition.y -= offset;
      break;
      case FACE_RIGHT:
        targetPosition.x += offset;
      break;
      case FACE_DOWN:
        targetPosition.y += offset;
      break;
      case FACE_LEFT:
        targetPosition.x -= offset;
      break;
      default:
        throw new Error("Unrecognized angle: " + robot.angle);
    }
  }

  function pickBattery() {
    pickBatterySound.play();
    energy += ENERGY_RELOAD;
    var battery = findSprite(batteries);
    var robotCoords = getRobotCoordinates();

    battery.destroy();
    batteries.splice(batteries.indexOf(battery), 1);
    grid[robotCoords.y][robotCoords.x] = PATH;

    setEnergyLabel();
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

  function isMoving() {
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

  function canMoveForward() {
    if ((nextCell() == WALL) || (nextCell() == STONE && hasStone())) {
      return false;
    } else {
      return true;
    }
    // return nextCell() != WALL;
  }

  function hasStone() {
    return robot.children.length > 0;
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
    var relativeX = sprite.x;
    var relativeY = sprite.y;

    return {
      x: Math.floor(relativeX / CELL_WIDTH),
      y: Math.floor(relativeY / CELL_WIDTH),
    };
  }

  function write(event) {
    if (!editor.alive) { return; }
    var keyCode = event.keyCode;

    var isBackspace = keyCode == 8;
    var isReturn = keyCode == 13;
    var isUp = keyCode == 38;
    var isRight = keyCode == 39;
    var isDown = keyCode == 40;
    var isLeft = keyCode == 37;
    var isPrintable =
      (keyCode > 47 && keyCode < 58)   || // number keys
      (keyCode == 32)                  || // spacebar & return key(s) (if you want to allow carriage returns)
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
    if (line.length >= CHARS_PER_LINE || coords.y >= LINES) {
      alertSound.play();
      return;
    }
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

  function enableDrag(sprite) {
    sprite.inputEnabled = true;
    sprite.input.enableDrag();
    sprite.events.onDragStart.add(setFocus, this);
  }

  function setFocus(sprite) {
    sprite.bringToTop();
    taskbar.bringToTop();
    mrPointy.bringToTop();
  }

  function createAlert(text, buttonText, callback) {
    isPlaying = false;
    var alert = game.add.sprite(0, 0, "alert");
    enableDrag(alert);
    alert.anchor.set(0.5, 0.5);
    alert.x = game.world.centerX;
    alert.y = game.world.centerY;

    var style = { align: 'center', wordWrap: true, wordWrapWidth: alert.width - 30 };
    var textLabel = game.add.text(0, 0, text, style);
    textLabel.anchor.set(0.5, 0.5);
    alert.addChild(textLabel);

    var button = game.add.button(0, 0, 'alert-button', close);
    button.anchor.set(0.5, 0.5);
    button.y = 80;
    alert.addChild(button);

    var buttonLabel = game.add.text(0, 0, buttonText);
    buttonLabel.anchor.set(0.5, 0.5);
    button.addChild(buttonLabel);

    function close() {
      alert.destroy(true);
      callback && callback();
    }
  }

  function addCloseButton(window) {
    var bg = game.add.bitmapData(35, 35);
    var closeButton = game.add.sprite(window.width - 10, 10, bg);
    closeButton.x -= closeButton.width;
    window.addChild(closeButton);
    closeButton.inputEnabled = true;
    closeButton.input.useHandCursor = true
    closeButton.events.onInputDown.add(function() {
      var tween = game.add.tween(window.scale);
      tween.onComplete.add(function() {
        window.kill();
      });
      tween.to({ x: 0, y: 0 }, 150, null, true);
    });
  }

  function addMinimizeButton(window, pivotX, pivotY) {
    var bg = game.add.bitmapData(35, 35);
    var minimizeButton = game.add.sprite(window.width - 135, 10, bg);
    window.addChild(minimizeButton);
    minimizeButton.inputEnabled = true;
    minimizeButton.input.useHandCursor = true
    minimizeButton.events.onInputDown.add(function() {
      var tween = game.add.tween(window.scale);
      tween.onComplete.add(function() {
        window.kill();
      });
      tween.to({ x: 0, y: 0 }, 150, null, true);
      game.add.tween(window).to({ x: pivotX, y: pivotY }, 150, null, true);
    });
  }
};
