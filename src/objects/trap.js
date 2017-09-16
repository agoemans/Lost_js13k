function Trap(x, y) {
    Sprite.call(this, x, y, 'assets/trap1.png');
    this.visible = true;
    this.collided = false;
    this.canMove = false;
    this.physics = true;
    this.gravity = 0;
    this.stabTimer = 0;
};

inherit(Trap, Sprite);
ctor(Trap);

Trap.prototype.stabPlayer = function (deltaSeconds) {
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
}

Trap.prototype.update = function (deltaSeconds) {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);

    this.radiusOnMap += 10 * deltaSeconds;

    this.alpha -= 1 * deltaSeconds;

    if(this.alpha <= 0){
        this.alpha = 1;
    }

    if(this.radiusOnMap >= 10)
    {
        this.radiusOnMap = 0;
    }

};

Trap.prototype.update = function (deltaSeconds) {
    if(this.canMove){
        this.move();
    }

    this.stabPlayer(deltaSeconds);

    Sprite.prototype.update.call(this, deltaSeconds);
};


