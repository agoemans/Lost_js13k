function DoorGoal(x, y) {
    Sprite.call(this, x, y, 'assets/closedDoor.png');
    this.onGoalReached = null;
};

inherit(DoorGoal, Sprite);

DoorGoal.prototype.collide = function (other) {
    this.collides = false;
    // this.image.src = 'assets/closedDoor.png';
    // this.destroy();
    if (this.onGoalReached) {
        this.onGoalReached(this.x + this.width / 2, this.y + this.height / 2);
    }
};

ctor(DoorGoal);