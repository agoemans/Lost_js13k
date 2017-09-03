function Goal(x, y, resources) {
    Sprite.call(this, x, y, 'assets/scroll.png');
    this.goalResource = resources.goals;
    this.onGoalReached = null;
    this.baseY = y;
    this.collided = false;
    this.isPickedUp = false;
    this.beaconOn = false;
};

inherit(Goal, Sprite);

Goal.prototype.collide = function (other) {
    if (!this.collided && this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        console.log('Goal collide with player');
        this.isPickedUp = true;
        if(this.beaconOn) this.beaconOn = false;
        this.onGoalReached(this);
        this.collided = true;

        this.visible = false;
        this.inputLocked = true;
        this.goalResource.add(1);
    }

    if (this.collided && !this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        this.collided = false;
    }

};

Goal.prototype.update = function (deltaSeconds) {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);

    this.collide();
};

ctor(Goal);
