function Goal(config) {
    Sprite.call(this, config.x, config.y, 'assets/goal.jpg');
    this.goalResource = config.resources.goals;
    this.onGoalReached = null;
    this.baseY = config.y;
};

inherit(Goal, Sprite);

Goal.prototype.collide = function (other) {
    this.collides = false;
    // this.destroy();
    this.goalResource.add(1);
    this.image.src = 'assets/underWall.jpg';
    if (this.onGoalReached) this.onGoalReached(this.x + this.width / 2, this.y + this.height / 2);
};

Goal.prototype.update = function (deltaSeconds) {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);
};

ctor(Goal);
