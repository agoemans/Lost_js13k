function Particle(x, y, w, h, vx, vy) {
    GameObject.call(this, x, y);

    this.width = w;
    this.height = h;

    this.gravity = 1500;
    this.velocity = {x: vx, y: vy};
};

inherit(Particle, GameObject);

ctor(Particle);

Particle.prototype.destroy = function () {
    Level.instance.removeAt(this.x, this.y);
};

Particle.prototype.update = function (deltaSeconds) {
    var elapsed = Math.min(deltaSeconds, 0.016);
    this.velocity.y += this.gravity * elapsed;
    this.x += this.velocity.x * elapsed;
    this.y += this.velocity.y * elapsed;
};

Particle.prototype.render = function (context) {
    context.fillRect(this.x, this.y, this.width, this.height);
};
