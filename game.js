window.onload = function() {
    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
        render: render,
    });

    function preload () {

        game.load.image('wall', 'images/wall.png');
        game.load.image('path', 'images/path.png');
    }

    function create () {
      var grid = [[0,1],[1,0],[0,1],[0,1],[0,1]];

      var x = 0;
      var y = 0;

      grid.forEach(function(row) {
        row.forEach(function(cell) {
          if (cell == 0) {
            game.add.sprite(x, y, 'wall');
          } else {
            game.add.sprite(x, y, 'path');
          }

          x += 50;
        });

        x = 0
        y += 50;
      });
    }


    function update() {
    }

    function render() {
    }
};
