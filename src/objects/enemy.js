function Enemy(x, y, imgNum) {
    Sprite.call(this, x, y, 'assets/enemy' + imgNum + '.png');
    this.collided = false;

    this.walkSpeed = 65;
    this.moveDirX = 1;
    this.moveDirY = 1;

    this.dir = Math.floor(mathHelper.getRandomNumber(0, 2));

    this.canFloat = false;
    this.canMove = true;
    this.physics = true;
    this.gravity = 0;

    this.stabTimer = 0;
};

inherit(Enemy, Sprite);
ctor(Enemy);


Enemy.prototype.stabPlayer = function (deltaSeconds) {
    if(!Level.instance.player.collides) return;

    if(this.stabTimer > 0)
    {
        this.stabTimer -= deltaSeconds;
        return;
    }

    if (!this.collided && this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        console.log('this.stab player', Level.instance.player);
        Level.instance.player.decreaseHealth();
        Sprite.prototype.collide.call(this);
        this.collided = true;

        this.stabTimer = 2;
    }

    if (this.collided && !this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        this.collided = false;
    }
};

Enemy.prototype.float = function () {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
};

Enemy.prototype.moveUpDown = function () {

    if (this.colliding.top && this.velocity.y >= 0) {
        this.moveDirY = 1;
    }

    if (this.colliding.bottom && this.velocity.y <= 0) {
        this.moveDirY = -1;
    }

    this.velocity.y = this.moveDirY * this.walkSpeed;
};

Enemy.prototype.moveLeftRight = function () {

    if (this.colliding.right && this.velocity.x >= 0) {
        this.moveDirX = -1;
    }

    if (this.colliding.left && this.velocity.x <= 0) {
        this.moveDirX = 1;
    }
    this.velocity.x = this.moveDirX * this.walkSpeed;
};

Enemy.prototype.move = function () {
    if(this.dir == 1){
        this.moveUpDown();
    } else {
        this.moveLeftRight();
    }
};


Enemy.prototype.update = function (deltaSeconds) {
    if(this.canMove){
        this.move();
    }

    this.stabPlayer(deltaSeconds);

    Sprite.prototype.update.call(this, deltaSeconds);
};
