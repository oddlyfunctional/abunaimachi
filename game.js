window.onload = function() {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.
    var cursors;
    var logo;
    var speed = 1;
    var moves = [];
    var currentMove = 0;
    var targetPosition = {};
    var targetAngle;
    var cellWidth = 55;


    var game = new Phaser.Game(1100, 825, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
        render: render,
    });

    function preload () {
        game.load.image('logo', 'images/player.png');
        game.load.image('wall', 'images/wall.png');
        game.load.image('path', 'images/path.png');
    }

    function create () {
      var grid = [
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]
      ];

      var x = 0;
      var y = 0;
      var cellSize = 55;

      grid.forEach(function(row) {
        row.forEach(function(cell) {
          if (cell == 0) {
            game.add.sprite(x, y, 'wall');
          } else {
            game.add.sprite(x, y, 'path');
          }

          x += cellSize;
        });

        x = 0
        y += cellSize;
      });

      logo = game.add.sprite(0, 0, 'logo');
      logo.anchor.setTo(0.5, 0.5);
      logo.angle = 0;
      setPlayerInitialPosition(0, 14);

      cursors = game.input.keyboard.createCursorKeys();

      setNextMove();
    }

    function setPlayerInitialPosition(x, y){
      logo.x = (55 * x) + 27
      logo.y = (55 * y) + 27
    }


    function update() {
      switch (moves[currentMove]) {
        case "forward":
          if (isMovingForward()) {
            switch(logo.angle) {
              case 0:
                logo.y -= speed;
                break;
              case 90:
                logo.x += speed;
                break;
              case -180:
                logo.y += speed;
                break;
              case -90:
                logo.x -= speed;
                break;
            }
          } else if (currentMove < moves.length) {
            currentMove += 1;
            setNextMove();
          }
          break;
        case "turnRight":
          if (isTurning()) {
            logo.angle += speed;
          } else {
            currentMove += 1;
            setNextMove();
          }
          break;
        case "turnLeft":
          if (isTurning()) {
            logo.angle -= speed;
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
          forward();
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

    function forward() {
      targetPosition = { x: logo.x, y: logo.y };
      switch(logo.angle) {
        case 0:
          targetPosition.y -= cellWidth;
          break;
        case 90:
          targetPosition.x += cellWidth;
          break;
        case -180:
          targetPosition.y += cellWidth;
          break;
        case -90:
          targetPosition.x -= cellWidth;
          break;
      }
    }

    function turn(degrees) {
      targetAngle = logo.angle + degrees;
    }

    function isMovingForward() {
      return logo.y != targetPosition.y || logo.x != targetPosition.x;
    }

    function isTurning() {
      return logo.angle != targetAngle;
    }

    function render() {
    }
};
