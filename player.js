class Player {
    constructor({
        ratio_x,
        ratio_y,
        width,
        height,
        old_x,
        old_y,
        x,
        y,
        velocity_x,
        velocity_y,
        jumping,
        color
    }) {
        this.ratio_x = ratio_x;
        this.ratio_y = ratio_y;
        this.width = width * ratio_x;
        this.height = height * ratio_y;
        this.old_x = old_x * ratio_x;
        this.old_y = old_y * ratio_y;
        this.x = x * ratio_x;
        this.y = y * ratio_y;
        this.velocity_x = velocity_x;
        this.velocity_y = velocity_y;
        this.jumping = jumping;
        this.color = color;
    }
}