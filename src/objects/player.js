function Player(x, y, health) {
    Sprite.call(this, x, y, 'assets/character.png', 4, 4);

    this.walkSpeed = 200;
    this.moveDirX = 0;
    this.moveDirY = 0;
    this.inputLocked = false;

    this.health = health;

    this.numKeys = 0;

    this.gravity = 0;

    this.physics = true;

    this.inventory = new Inventory();

    this.sword = new Sword(this);

    this.inventory.addItem(this.sword, 'weapons');

    this.inventory.equip(this.sword);

    this.fps = 10;

    game.audio.add('jump', 1, [[0, , 0.22, , 0.1871, 0.3251, , 0.2199, , , , -0.2199, , 0.1513, 0.02, , , , 0.74, , , , -0.02, 0.3]]);
    game.audio.add('flip', 1, [[0, , 0.18, 0.49, , 0.49, , 0.7, -0.02, , , -0.24, , 0.12, -0.04, , -0.02, -0.02, 0.48, , , , , 0.3]]);
    game.audio.add('die', 1, [[1, 0.0273, 0.01, 0.16, 0.71, 0.56, , -0.4599, 0.3519, 0.4213, 0.0476, 0.1725, , 0.9815, 0.1661, 0.6997, 0.0006, -0.1146, 0.7501, 0.7435, 0.0332, 0.4191, 0.422, 0.3]]);
};

inherit(Player, Sprite);

Player.prototype.moveHorizontally = function (xdir) {
    if (!this.inputLocked) {
        this.moveDirX = xdir;
        this.play((this.moveDirX > 0) ? 1 : 2, true, this.fps);
    }
};

Player.prototype.moveVertically = function (ydir) {
    if (!this.inputLocked) {
        this.moveDirY = ydir;
        this.play((this.moveDirY > 0) ? 0 : 3, true, this.fps);
    }
};

Player.prototype.die = function () {
    game.audio.play('die');
    this.physics = false;
    this.inputLocked = true;
    this.visible = false;
    this.physics = false;
    this.collides = false;
    this.stop();
};

Player.prototype.decreaseHealth = function () {
    console.log('decrease health', this.health);
    if(this.health.currentValue > 0){
        this.health.subtract(1);
    } else {
        this.die();
    }
};

Player.prototype.stopHorizontal = function () {
    this.velocity.x = 0;
    this.moveDirX = 0;

    if(this.moveDirY !== 0)
    {
        this.play((this.moveDirY > 0) ? 0 : 3, true, this.fps);
    }
};

Player.prototype.stopVertical = function () {
    this.velocity.y = 0;
    this.moveDirY = 0;

    if(this.moveDirX !== 0)
    {
        this.play((this.moveDirX > 0) ? 1 : 2, true, this.fps);
    }
};

Player.prototype.update = function (deltaSeconds) {
    if (!this.inputLocked)
    {
        this.velocity.x = this.moveDirX * this.walkSpeed;

        this.velocity.y = this.moveDirY * this.walkSpeed;
    }

    if(this.moveDirX === 0 && this.moveDirY === 0)
    {
        this.stop();
    }

    Sprite.prototype.update.call(this, deltaSeconds);

    this.inventory.update(deltaSeconds);
};

Player.prototype.render = function (context) {
    Sprite.prototype.render.call(this, context);

    this.inventory.render(context);
};

ctor(Player);
