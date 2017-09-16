function Teleport(x, y) {
    Sprite.call(this, x, y, 'assets/goal.jpg');
    // this.frame = 0;
    this.onActivate = null;
    this.collided = false;
    //this.baseY = y;
};

inherit(Teleport, Sprite);

Teleport.prototype.collide = function (other) {
    if (!this.collided && this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        this.onActivate();
        this.collided = true;
    }

    if (this.collided && !this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        this.collided = false;
    }

};

Teleport.prototype.update = function (deltaSeconds) {
    //this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);

    this.collide();
};

ctor(Teleport);
