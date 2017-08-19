function HealthPickup(x, y, resources) {
    Sprite.call(this, x, y, 'assets/key.png');

    game.audio.add('key', 1, [[0, , 0.0289, 0.5117, 0.151, 0.7819, , , , , , , , , , , , , 1, , , , , 0.3]]);

    this.healthResource = resources.get('health')
};

inherit(HealthPickup, Sprite);
ctor(HealthPickup);

HealthPickup.prototype.collide = function (other) {
    
    if (!(other instanceof Player))
        return;

    if(this.healthResource.canAdd(1))
    {
        this.collides = false;
        this.destroy();
        
        this.healthResource.add(1);

        game.audio.play('key');
    }

};