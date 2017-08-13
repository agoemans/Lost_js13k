function Spike(x, y, imageName) {
    Sprite.call(this, x, y, imageName);
    this.collided = false;

};

inherit(Spike, Sprite);
ctor(Spike);

Spike.prototype.collide = function (other) {
    if (!this.collided && other instanceof Player) {
        Sprite.prototype.collide.call(this, other);
        this.collided = true;
    }
};