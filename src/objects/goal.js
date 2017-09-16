function Goal(x, y, resources) {
    InventoryItem.call(this, x, y, 'assets/scroll.png');
    console.log('create goal', x, y)
    this.goalResource = resources.goals;
    this.onGoalReached = null;
    this.baseY = y;
    this.collided = false;
    this.isPickedUp = false;
    this.beaconOn = false;
    this.radiusOnMap = 0;
    this.alpha = 1;
};

inherit(Goal, InventoryItem);
ctor(Goal);

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

        Level.instance.player.inventory.addItem(this, "goals");
    }

    if (this.collided && !this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        this.collided = false;
    }

};

Goal.prototype.drawOnMap = function(context, goalX, goalY, radius){
    // context.clearRect(goalX, goalY, 100, 100);
    // console.log('radius', radius);
    context.beginPath();
    context.arc(goalX, goalY, this.radiusOnMap, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = 'rgba(152, 8, 8,' + this.alpha + ')';
    context.fill();

};

Goal.prototype.update = function (deltaSeconds) {
    this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    InventoryItem.prototype.update.call(this, deltaSeconds);

    this.radiusOnMap += 10 * deltaSeconds;

    this.alpha -= 1 * deltaSeconds;

    if(this.alpha <= 0){
        this.alpha = 1;
    }

    if(this.radiusOnMap >= 10)
    {
        this.radiusOnMap = 0;
    }

    this.collide();
};
