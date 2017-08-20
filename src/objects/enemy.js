function Enemy(config) {
    Sprite.call(this, config.x, config.y, 'assets/enemy1.png');
    this.collided = false;

    this.walkSpeed = 65;
    this.moveDirX = 1;
    this.moveDirY = 1;

    this.dir = Math.floor(mathHelper.getRandomNumber(0, 2));

    this.canFloat = false;
    this.canMove = true;
    this.physics = true;
    this.gravity = 0;
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

Enemy.prototype.moveUpDown = function () {

    if (this.colliding.top && this.velocity.y >= 0) {
        this.moveDirY = 1;
        // this.velocity.y = this.moveDirY * this.walkSpeed;
    }

    if (this.colliding.bottom && this.velocity.y <= 0) {
        this.moveDirY = -1;
        // this.velocity.y = this.moveDirY * this.walkSpeed;
    }

    this.velocity.y = this.moveDirY * this.walkSpeed;
};

Enemy.prototype.moveLeftRight = function () {

    if (this.colliding.right && this.velocity.x >= 0) {
        this.moveDirX = -1;
        // this.velocity.x = this.moveDirX * this.walkSpeed;
    }

    if (this.colliding.left && this.velocity.x <= 0) {
        this.moveDirX = 1;
        // this.velocity.x = this.moveDirX * this.walkSpeed;
    }
    this.velocity.x = this.moveDirX * this.walkSpeed;
};

Enemy.prototype.move = function () {
    if(this.dir == 1){
        this.moveUpDown();
    } else {
        this.moveLeftRight();
    }

    // var right = Level.instance.tileAt(this.x + this.width, this.nextTileY);
    // if (this.colliding.right && this.velocity.x > 0) {
    //     this.velocity.x = -200;
    // }
    //
    // var left = Level.instance.tileAt(this.x, this.nextTileY);
    // if (this.colliding.left && this.velocity.x < 0) {
    //     this.velocity.x = 200;
    // }
};


Enemy.prototype.update = function (deltaSeconds) {
    if(this.canMove){
        this.move();
    }

    // this.stabPlayer();

    Sprite.prototype.update.call(this, deltaSeconds);
};
