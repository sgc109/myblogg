let map_row = 32,
  map_col = 64;
let tile_width = 28,
  tile_height = 28;
let ratio_x = document.body.clientWidth / (tile_width * map_col),
  ratio_y = document.body.clientHeight / (tile_height * map_row);
let player = new Player({
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
});

(function () {

  let world = new World({
    ratio_x: ratio_x,
    ratio_y: ratio_y,
    columns: map_col,
    rows: map_row,
    tile_width: tile_width,
    tile_height: tile_height
  });

  var controller, display, game;

  controller = {
    left: false,
    right: false,
    up: false,

    keyUpDown: function (event) {
      var key_state = (event.type == "keydown") ? true : false;

      switch (event.keyCode) {
        case 37: controller.left = key_state; break;
        case 38: controller.up = key_state; break;
        case 39: controller.right = key_state; break;
      }
    }
  };

  // draws everything and handles html elements
  display = {

    buffer: document.createElement("canvas").getContext("2d"),
    context: document.querySelector("canvas").getContext("2d"),
    // output: document.querySelector("p"),

    render: function () {

      for (let index = world.map.length - 1; index > -1; --index) {

        this.buffer.fillStyle = (world.map[index] > 0) ? ("#0000" + world.map[index] + "0") : "#ffffff";
        this.buffer.fillRect((index % world.columns) * world.tile_width, Math.floor(index / world.columns) * world.tile_height, world.tile_width, world.tile_height);

      }

      this.buffer.fillStyle = player.color;
      this.buffer.fillRect(player.x, player.y, player.width, player.height);

      var textWidth = this.buffer.measureText(player.name).width;
      this.buffer.textAlign = "center";
      this.buffer.fillStyle = "#eeeeee";
      this.buffer.font = "Arial";
      this.buffer.fillRect(player.x + player.width / 2 - textWidth / 2, player.y + player.height, textWidth, 15);
      this.buffer.fillStyle = "#000000";
      this.buffer.fillText(player.name, player.x + player.width / 2, player.y + player.height + 10);

      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    resize: function (event) {

      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.body.clientWidth;

      display.context.canvas.height = Math.floor(document.body.clientHeight);

      display.render();

    }

  };

  game = {

    collision: new Collision({ world: world })
    ,

    loop: function () {
      // console.log('hi! ' + userName);
      if (controller.left) {
        player.velocity_x -= 1.0;
      }
      if (controller.right) {
        player.velocity_x += 1.0;
      }
      if (controller.up && !player.jumping) {
        player.velocity_y = -30;
        player.jumping = true;
      }

      player.velocity_y += 1.5;

      player.old_x = player.x;
      player.old_y = player.y;

      player.x += player.velocity_x;
      player.y += player.velocity_y;

      if (player.x < 0) {
        player.velocity_x = 0;
        player.old_x = player.x = 0;

      } else if (player.x + player.width > display.buffer.canvas.width) {

        player.velocity_x = 0;
        player.old_x = player.x = display.buffer.canvas.width - player.width;

      }

      if (player.y < 0) {

        player.velocity_y = 0;
        player.old_y = player.y = 0;

      } else if (player.y + player.height > display.buffer.canvas.height) {

        player.velocity_y = 0;
        player.old_y = player.y = display.buffer.canvas.height - player.height;

      }

      // NOW FOR SOME GOOD STUFF!!! Here we do broadphase collision detection by checking
      // which tile value the player is standing on. If it is anything but 0 we have a possible collision.

      // calculate the player's x and y tile position in the tile map
      var tile_x = Math.floor((player.x + player.width * 0.5) / world.tile_width);
      var tile_y = Math.floor((player.y + player.height) / world.tile_height);
      // get the value at the tile position in the map
      var value_at_index = world.map[tile_y * world.columns + tile_x];

      // do some output so we can see it all in action
      // display.output.innerHTML = "tile_x: " + tile_x + "<br>tile_y: " + tile_y + "<br>map index: " + tile_y + " * " + world.columns + " + " + tile_x + " = " + String(tile_y * world.columns + tile_x) + "<br>tile value: " + world.map[tile_y * world.columns + tile_x];

      if (value_at_index != 0) {
        game.collision[value_at_index](player, tile_y, tile_x);
      }

      tile_x = Math.floor((player.x + player.width * 0.5) / world.tile_width);
      tile_y = Math.floor((player.y + player.height) / world.tile_height);
      value_at_index = world.map[tile_y * world.columns + tile_x];

      if (value_at_index != 0) {

        game.collision[value_at_index](player, tile_y, tile_x);

      }

      player.velocity_x *= 0.9;// apply some friction to the player's velocity
      player.velocity_y *= 0.9;// the reason we do this after the collision code

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
