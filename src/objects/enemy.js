function Enemy(x, y) {
    Sprite.call(this, x, y, 'assets/Enemy.png');
    this.collided = false;
    this.velocity.x = 55;
    this.canFloat = false;
    this.canMove = false;
};

inherit(Enemy, Sprite);
ctor(Enemy);


Enemy.prototype.stabPlayer = function (other) {
    console.log('this.stab player');
    if (!this.collided && this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        Sprite.prototype.collide.call(this);
        this.collided = true;
    }
};

Enemy.prototype.float = function () {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
};

Enemy.prototype.move = function () {
    this.nextTileY = this.flipY ? this.y - 1 : this.y + this.height;

    var right = Level.instance.tileAt(this.x + this.width, this.nextTileY);
    if (this.colliding.right || (!right || right instanceof Spike) && this.velocity.x > 0) {
        this.velocity.x = -55;
    }

    var left = Level.instance.tileAt(this.x, this.nextTileY);
    if (this.colliding.left || (!left || left instanceof Spike) && this.velocity.x < 0) {
        this.velocity.x = 55;
    }
};


Enemy.prototype.update = function (deltaSeconds) {
    if(this.canFloat){
        this.float();
    }
    if(this.canMove){
        this.move();
    }

    // this.stabPlayer();

    Sprite.prototype.update.call(this, deltaSeconds);
};