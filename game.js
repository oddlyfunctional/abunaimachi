window.onload = function() {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.
    var cursors;
    var logo;
    var speed = 1;
    var moves = ["forward", "forward", "forward"];
    var currentMove = 0;
    var target;
    var cellWidth = 55;

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
        render: render,
    });

    function preload () {
        game.load.image('logo', 'node_modules/phaser/phaser-logo-small.png');
        game.load.image('wall', 'images/wall.png');
        game.load.image('path', 'images/path.png');
    }

    function create () {
      var grid = [[0,1],[1,0],[0,1],[0,1],[0,1]];

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

        logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.angle = 270;

        cursors = game.input.keyboard.createCursorKeys();

        target = { x: logo.x, y: logo.y };
    }


    function update() {
      if (logo.y != target.y || logo.x != target.x) {
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
        switch(logo.angle) {
          case 0:
            target.y -= cellWidth;
            break;
          case 90:
            target.x += cellWidth;
            break;
          case -180:
            target.y += cellWidth;
            break;
          case -90:
            target.x -= cellWidth;
            break;
        }
        currentMove += 1;
      }
    }

    function render() {
    }
};
