function HealthPickup(x, y, resources) {
    Sprite.call(this, x, y, 'assets/heart.png');
    this.collided = false;
    // this.physics = false;

    game.audio.add('key', 1, [[0, , 0.0289, 0.5117, 0.151, 0.7819, , , , , , , , , , , , , 1, , , , , 0.3]]);

    this.healthResource = resources.health;
};

inherit(HealthPickup, Sprite);
ctor(HealthPickup);

HealthPickup.prototype.collide = function (other) {

    if (!this.collided && this.overlap(Level.instance.player.x, Level.instance.player.y, Level.instance.player.width, Level.instance.player.height)) {
        // this.collided = true;
        if(this.healthResource.canAdd(1)) {
            // this.destroy();

            this.healthResource.add(1);

            game.audio.play('key');
        }
    }



};

HealthPickup.prototype.update = function (deltaSeconds) {
    //this.y = this.baseY + this.height * Math.sin(this.time * 3) * 0.2;
    Sprite.prototype.update.call(this, deltaSeconds);

    this.collide();
};

ctor(HealthPickup);
