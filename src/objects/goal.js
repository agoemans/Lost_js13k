function Goal(x, y) {
    Sprite.call(this, x, y, 'assets/win.png');
    this.onGoalReached = null;
    this.baseY = y;
};

inherit(Goal, Sprite);

Goal.prototype.collide = function (other) {
    this.collides = false;
    this.destroy();
    if (this.onGoalReached) this.onGoalReached(this.x + this.width / 2, this.y + this.height / 2);
};

Goal.prototype.update = function (deltaSeconds) {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);
};

ctor(Goal);