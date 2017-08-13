function Player(x, y) {
    Sprite.call(this, x, y, 'assets/player.png', 2, 2);

    this.walkSpeed = 300;
    this.moveDirX = 0;
    this.inputLocked = false;

    this.numKeys = 0;

    game.audio.add('jump', 1, [[0, , 0.22, , 0.1871, 0.3251, , 0.2199, , , , -0.2199, , 0.1513, 0.02, , , , 0.74, , , , -0.02, 0.3]]);
    game.audio.add('flip', 1, [[0, , 0.18, 0.49, , 0.49, , 0.7, -0.02, , , -0.24, , 0.12, -0.04, , -0.02, -0.02, 0.48, , , , , 0.3]]);
    game.audio.add('die', 1, [[1, 0.0273, 0.01, 0.16, 0.71, 0.56, , -0.4599, 0.3519, 0.4213, 0.0476, 0.1725, , 0.9815, 0.1661, 0.6997, 0.0006, -0.1146, 0.7501, 0.7435, 0.0332, 0.4191, 0.422, 0.3]]);
};

inherit(Player, Sprite);

Player.prototype.move = function (dir) {
    if (!this.inputLocked) {
        this.moveDirX = dir;
        this.play(0, true, 15);
    }
};

Player.prototype.die = function () {
    game.audio.play('die');
    this.physics = false;
    this.inputLocked = true;
    this.visible = false;
    this.stop();
};

Player.prototype.stop = function () {
    this.velocity.x = 0;
    this.moveDirX = 0;
    Sprite.prototype.stop.call(this);
};

Player.prototype.jump = function () {
    if (!this.inputLocked && (this.colliding.bottom || this.colliding.top)) {
        game.audio.play('jump');
        this.play(1, false);
        this.velocity.y = -1300 * Math.sign(this.gravity);
    }
};

Player.prototype.flip = function () {
    if (this.inputLocked)
        return;

    game.audio.play('flip');
    this.gravity *= -1;
    this.flipY = !this.flipY;
};

Player.prototype.update = function (deltaSeconds) {
    if (!this.inputLocked) {
        if (this.moveDirX !== 0)
            this.flipX = this.moveDirX < 0;

        this.velocity.x = this.moveDirX * this.walkSpeed;
    }

    Sprite.prototype.update.call(this, deltaSeconds);

    if (this.animation === 1 && (this.colliding.bottom || this.colliding.top)) {
        Sprite.prototype.stop.call(this);
        this.frame = 0;
        if (this.moveDirX !== 0)
            this.play(0, true, 15);
    }

};

ctor(Player);