class Collision {
    constructor({world}) {
        this.world = world;
    }
    1(object, row, column) {
        if (this.topCollision(object, row)) { return; }
        this.rightCollision(object, column);
    }

    2(object, row, column) {
        if (this.topCollision(object, row)) { return; }
        this.leftCollision(object, column);
    }

    3(object, row, column) {
        this.rightCollision(object, column);
    }

    4(object, row, column) {
        if (this.topCollision(object, row)) { return; }// you only want to do one
        if (this.leftCollision(object, column)) { return; }// of these collision
        this.rightCollision(object, column);// responses. that's why there are if statements
    }

    5(object, row, column) {
        this.topCollision(object, row);
    }

    leftCollision(object, column) {

        if (object.velocity_x > 0) {// If the object is moving right

            var left = column * this.world.tile_width;// calculate the left side of the collision tile

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

    }

    // these are all basically the same concept as the leftCollision function,
    // only for the different sides.

    rightCollision(object, column) {

        if (object.velocity_x < 0) {

            var right = (column + 1) * this.world.tile_width;

            if (object.x + object.width * 0.5 < right && object.old_x + object.width * 0.5 >= right) {

                object.velocity_x = 0;
                object.old_x = object.x = right - object.width * 0.5;

                return true;

            }

        }

        return false;

    }

    topCollision(object, row) {

        if (object.velocity_y > 0) {

            var top = row * this.world.tile_height;

            if (object.y + object.height > top && object.old_y + object.height <= top) {

                object.jumping = false;
                object.velocity_y = 0;
                object.old_y = object.y = top - object.height - 0.01;

                return true;

            }

        }

        return false;

    }
}