function GemAltar(x, y, resources) {
    Sprite.call(this, x, y, 'assets/altar.png');
    console.log('create gemAltar', x, y)
    this.onGemAltarReached = null;
    this.goalResource = resources.goals;

    this.collided = false;
};

inherit(GemAltar, Sprite);

GemAltar.prototype.collide = function (other) {
    if (!this.collided && this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        console.log('GemAltar collide with player');

        if(!this.goalResource.canAdd(1)){
            this.onGemAltarReached(this);
        }

        this.collided = true;
    }

    if (this.collided && !this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        this.collided = false;
    }

};


GemAltar.prototype.update = function (deltaSeconds) {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);

    if(!this.inputLocked){
        this.collide();
    }

};

ctor(GemAltar);
