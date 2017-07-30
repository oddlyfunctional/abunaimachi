window.onload = function() {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var grid = [
      [1,0,1],
      [1,1,1],
      [0,1,1]
    ];

    var cellWidth = 55;
    var WALL = 0;
    var PATH = 1;

    var FACE_UP = 0;
    var FACE_RIGHT = 90;
    var FACE_DOWN = -180;
    var FACE_LEFT = -90;

    var GRID_LEFT = 0;
    var GRID_TOP = 0;
    var GRID_WIDTH = grid[0].length * cellWidth;
    var GRID_HEIGHT = grid.length * cellWidth;
    var GRID_BOTTOM = GRID_TOP + GRID_HEIGHT;
    var GRID_RIGHT = GRID_LEFT + GRID_WIDTH;

    var cursors;
    var robot;
    var speed = 1;
    var testScript = "" +
    "function run() {" +
    "  turnRight();" +
    "  forward();" +
    "  turnRight();" +
    "  forward();" +
    "  forward();" +
    "  turnLeft();" +
    "  forward();" +
    "}";
    var moves = [];
    eval(testScript);
    run();
    console.log(moves);
    var currentMove = 0;
    var targetPosition = {};
    var targetAngle;

    var game = new Phaser.Game(1100, 825, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
        render: render,
    });

    function preload () {
        game.load.image('robot', 'images/player.png');
        game.load.image('wall', 'images/wall.png');
        game.load.image('path', 'images/path.png');
    }

    function create () {
      var x = 0;
      var y = 0;

      grid.forEach(function(row) {
        row.forEach(function(cell) {
          if (cell == 0) {
            var newWall = game.add.sprite(x, y, 'wall');
          } else {
            game.add.sprite(x, y, 'path');
          }

          x += cellWidth;
        });

        x = 0
        y += cellWidth;
      });

      robot = game.add.sprite(0, 0, 'robot');
      robot.anchor.setTo(0.5, 0.5);
      robot.angle = 0;
      setPlayerInitialPosition(0, 0);

      cursors = game.input.keyboard.createCursorKeys();

      setNextMove();
    }

    function setPlayerInitialPosition(x, y){
      robot.x = (55 * x) + 27;
      robot.y = (55 * y) + 27;
    }


    function update() {
      switch (moves[currentMove]) {
        case "forward":
          if (isMovingForward()) {
            switch(Math.round(robot.angle)) {
              case FACE_UP: //FACE_UP
                robot.y -= speed;
                break;
              case FACE_RIGHT: //FACE_RIGHT
                robot.x += speed;
                break;
              case FACE_DOWN: //FACE_DOWN
                robot.y += speed;
                break;
              case FACE_LEFT: //FACE_LEFT
                robot.x -= speed;
                break;
              default:
                throw new Error("Unrecognized angle: " + robot.angle);
            }
          } else if (currentMove < moves.length) {
            currentMove += 1;
            setNextMove();
          }
          break;
        case "turnRight":
          if (isTurning()) {
            robot.angle = Math.round(robot.angle + speed);
          } else {
            currentMove += 1;
            setNextMove();
          }
          break;
        case "turnLeft":
          if (isTurning()) {
            robot.angle = Math.round(robot.angle - speed);
          } else {
            currentMove += 1;
            setNextMove();
          }
          break;
      }
    }

    function setNextMove() {
      if (currentMove >= moves.length) { return; }
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
    }

    function moveForward() {
      targetPosition = { x: robot.x, y: robot.y };
      switch(Math.round(robot.angle)) {
        case FACE_UP:
          targetPosition.y -= cellWidth;
          break;
        case FACE_RIGHT:
          targetPosition.x += cellWidth;
          break;
        case FACE_DOWN:
          targetPosition.y += cellWidth;
          break;
        case FACE_LEFT:
          targetPosition.x -= cellWidth;
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
      var a = nextCell();
      console.log(a);
      return a != WALL;
    }

    function nextCell() {
      var robotCoords = getRobotCoordinates();
      console.log("player:", robotCoords);
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

      console.log("next cell:", robotCoords);
      return grid[robotCoords.y][robotCoords.x];
    }

    function getRobotCoordinates() {
      var relativeX = robot.x - GRID_LEFT;
      var relativeY = robot.y - GRID_TOP;

      return {
        x: Math.floor(relativeX / cellWidth),
        y: Math.floor(relativeY / cellWidth),
      };
    }
};
