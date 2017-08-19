function Player(x, y) {
    Sprite.call(this, x, y, 'assets/character.png', 4, 4);

    this.walkSpeed = 200;
    this.moveDirX = 0;
    this.moveDirY = 0;
    this.inputLocked = false;

    this.numKeys = 0;

    this.gravity = 0;

    this.physics = true;

    game.audio.add('jump', 1, [[0, , 0.22, , 0.1871, 0.3251, , 0.2199, , , , -0.2199, , 0.1513, 0.02, , , , 0.74, , , , -0.02, 0.3]]);
    game.audio.add('flip', 1, [[0, , 0.18, 0.49, , 0.49, , 0.7, -0.02, , , -0.24, , 0.12, -0.04, , -0.02, -0.02, 0.48, , , , , 0.3]]);
    game.audio.add('die', 1, [[1, 0.0273, 0.01, 0.16, 0.71, 0.56, , -0.4599, 0.3519, 0.4213, 0.0476, 0.1725, , 0.9815, 0.1661, 0.6997, 0.0006, -0.1146, 0.7501, 0.7435, 0.0332, 0.4191, 0.422, 0.3]]);
};

inherit(Player, Sprite);

Player.prototype.moveHorizontally = function (xdir) {
    if (!this.inputLocked) {
        this.moveDirX = xdir;
        this.play(1, true, 15);
    }
};

Player.prototype.moveVertically = function (ydir) {
    if (!this.inputLocked) {
        this.moveDirY = ydir;
        this.play((ydir > 0) ? 0 : 3, true, 15);
    }
};

Player.prototype.die = function () {
    game.audio.play('die');
    this.physics = false;
    this.inputLocked = true;
    this.visible = false;
    this.stop();
};

Player.prototype.stopHorizontal = function () {
    this.velocity.x = 0;
    this.moveDirX = 0;
};

Player.prototype.stopVertical = function () {
    this.velocity.y = 0;
    this.moveDirY = 0;
};

Player.prototype.update = function (deltaSeconds) {
    if (!this.inputLocked) {

        if (this.moveDirX !== 0) {
            this.flipX = this.moveDirX < 0;
        }
        
        this.velocity.x = this.moveDirX * this.walkSpeed;

        this.velocity.y = this.moveDirY * this.walkSpeed;
    }

    if(this.moveDirX === 0 && this.moveDirY === 0)
    {
        this.stop();
    }

    Sprite.prototype.update.call(this, deltaSeconds);

    if (this.colliding.bottom || this.colliding.top || this.colliding.left || this.colliding.right) {
        Sprite.prototype.stop.call(this);
        this.frame = 0;
        if (this.moveDirX !== 0 || this.moveDirY !== 0) {
            this.play(0, true, 15);
        }
    }

};

ctor(Player);