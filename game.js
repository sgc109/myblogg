// Frank Poth 11/16/2017
let map_row = 32,
  map_col = 64;
let tile_width = 28,
  tile_height = 28;
let ratio_x = document.body.clientWidth / (tile_width * map_col),
  ratio_y = document.body.clientHeight / (tile_height * map_row);

(function () {
  "use strict"

  // the three main components of the example
  var controller, display, game;

  // a basic controller object that handles key input
  controller = {

    left: false,
    right: false,
    up: false,

    keyUpDown: function (event) {

      var key_state = (event.type == "keydown") ? true : false;

      switch (event.keyCode) {

        case 37: controller.left = key_state; break; // left key
        case 38: controller.up = key_state; break; // up key
        case 39: controller.right = key_state; break; // right key

      }

    }

  };

  // draws everything and handles html elements
  display = {

    buffer: document.createElement("canvas").getContext("2d"),
    context: document.querySelector("canvas").getContext("2d"),
    // output: document.querySelector("p"),

    render: function () {

      for (let index = game.world.map.length - 1; index > -1; --index) {

        this.buffer.fillStyle = (game.world.map[index] > 0) ? ("#0000" + game.world.map[index] + "0") : "#ffffff";
        this.buffer.fillRect((index % game.world.columns) * game.world.tile_width, Math.floor(index / game.world.columns) * game.world.tile_height, game.world.tile_width, game.world.tile_height);

      }

      this.buffer.fillStyle = game.player.color;
      this.buffer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);

      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    resize: function (event) {

      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.body.clientWidth - 32;

      display.context.canvas.height = Math.floor(document.body.clientHeight);

      display.render();

    }

  };

  game = {
    player: new Player({
      ratio_x: ratio_x,
      ratio_y: ratio_y,
      color: "#ff0000",
      width: 12,
      height: 12,
      jumping: true,
      old_x: 160,
      old_y: 160,
      velocity_x: 0,
      velocity_y: 0,
      x: 160,
      y: 90
    }),

    world: new World({
      ratio_x: ratio_x,
      ratio_y: ratio_y,
      columns: map_col,
      rows: map_row,
      tile_width: tile_width,
      tile_height: tile_height
    }),

    collision: {

      1: function (object, row, column) {

        if (this.topCollision(object, row)) { return; }
        this.rightCollision(object, column);

      },

      2: function (object, row, column) {

        if (this.topCollision(object, row)) { return; }
        this.leftCollision(object, column);

      },

      3: function (object, row, column) {

        this.rightCollision(object, column);

      },

      4: function (object, row, column) {

        if (this.topCollision(object, row)) { return; }// you only want to do one
        if (this.leftCollision(object, column)) { return; }// of these collision
        this.rightCollision(object, column);// responses. that's why there are if statements

      },

      5: function (object, row, column) {

        this.topCollision(object, row);

      },

      leftCollision(object, column) {

        if (object.velocity_x > 0) {// If the object is moving right

          var left = column * game.world.tile_width;// calculate the left side of the collision tile

          if (object.x + object.width * 0.5 > left && object.old_x <= left) {// If the object was to the right of the collision object, but now is to the left of it

            object.velocity_x = 0;// Stop moving
            object.x = object.old_x = left - object.width * 0.5 - 0.001;// place object outside of collision
            // the 0.001 is just to ensure that the object is no longer in the same tile space as the collision tile
            // due to the way object tile position is calculated, moving the object to the exact boundary of the collision tile
            // would not move it out if its tile space, meaning that another collision with an adjacent tile might not be detected in another broad phase check

            return true;

          }

        }

        return false;

      },

      // these are all basically the same concept as the leftCollision function,
      // only for the different sides.

      rightCollision(object, column) {

        if (object.velocity_x < 0) {

          var right = (column + 1) * game.world.tile_width;

          if (object.x + object.width * 0.5 < right && object.old_x + object.width * 0.5 >= right) {

            object.velocity_x = 0;
            object.old_x = object.x = right - object.width * 0.5;

            return true;

          }

        }

        return false;

      },

      topCollision(object, row) {

        if (object.velocity_y > 0) {

          var top = row * game.world.tile_height;

          if (object.y + object.height > top && object.old_y + object.height <= top) {

            object.jumping = false;
            object.velocity_y = 0;
            object.old_y = object.y = top - object.height - 0.01;

            return true;

          }

        }

        return false;

      }

    },

    // Here's the game loop, where it all goes down!!!
    loop: function () {

      // get and use keyboard input
      if (controller.left) {

        game.player.velocity_x -= 1.0;

      }

      if (controller.right) {

        game.player.velocity_x += 1.0;

      }

      if (controller.up && !game.player.jumping) {

        game.player.velocity_y = -30;
        game.player.jumping = true;

      }

      game.player.velocity_y += 1.5; // add gravity

      game.player.old_x = game.player.x;// store the last position of the player
      game.player.old_y = game.player.y;// before we move it on this cycle

      game.player.x += game.player.velocity_x;// move the player's current position
      game.player.y += game.player.velocity_y;

      // do collision detection with the level boundaries so the player can't leave
      // the screen. Nothing you haven't seen before...
      if (game.player.x < 0) {

        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = 0;

      } else if (game.player.x + game.player.width > display.buffer.canvas.width) {

        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = display.buffer.canvas.width - game.player.width;

      }

      if (game.player.y < 0) {

        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = 0;

      } else if (game.player.y + game.player.height > display.buffer.canvas.height) {

        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = display.buffer.canvas.height - game.player.height;

      }

      // NOW FOR SOME GOOD STUFF!!! Here we do broadphase collision detection by checking
      // which tile value the player is standing on. If it is anything but 0 we have a possible collision.

      // calculate the player's x and y tile position in the tile map
      var tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_width);
      var tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_height);
      // get the value at the tile position in the map
      var value_at_index = game.world.map[tile_y * game.world.columns + tile_x];

      // do some output so we can see it all in action
      // display.output.innerHTML = "tile_x: " + tile_x + "<br>tile_y: " + tile_y + "<br>map index: " + tile_y + " * " + game.world.columns + " + " + tile_x + " = " + String(tile_y * game.world.columns + tile_x) + "<br>tile value: " + game.world.map[tile_y * game.world.columns + tile_x];

      // if it's not an empty tile, we need to do narrow phase collision detection and possibly response!
      if (value_at_index != 0) {

        // simply call one of the routing functions in the collision object and pass
        // in values for the collision tile's location in grid/map space
        game.collision[value_at_index](game.player, tile_y, tile_x);

      }

      tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_width);
      tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_height);
      value_at_index = game.world.map[tile_y * game.world.columns + tile_x];

      if (value_at_index != 0) {

        game.collision[value_at_index](game.player, tile_y, tile_x);

      }

      game.player.velocity_x *= 0.9;// apply some friction to the player's velocity
      game.player.velocity_y *= 0.9;// the reason we do this after the collision code

      display.render();

      window.requestAnimationFrame(game.loop);

    }

  };

  display.buffer.canvas.height = document.body.clientHeight;
  display.buffer.canvas.width = document.body.clientWidth;

  window.addEventListener("resize", display.resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  display.resize();

  game.loop();

})();
