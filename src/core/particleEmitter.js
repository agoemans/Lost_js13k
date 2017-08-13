function ParticleEmitter(x, y, lifeTime) {
    GameObject.call(this, x, y);

    this.numParticles = 30;
    this.particles = [];
    this.time = 0;
    this.lifeTime = lifeTime;
    this.color = '#FFFFFF';

    for (var i = 0; i < this.numParticles; i++) {
        var xVel = Math.random() * 300 - 150;
        var yVel = -200 - Math.random() * 250;
        this.particles.push(new Particle(x, y, 8, 8, xVel, yVel));
    }

    this.alive = false;
};

inherit(ParticleEmitter, Object);

ParticleEmitter.prototype.emit = function (x, y, color) {
    this.color = color || this.color;
    this.particles.forEach(function (particle) {
        particle.x = x;
        particle.y = y;
    });
    this.alive = true;
};


ParticleEmitter.prototype.update = function (deltaSeconds) {
    if (!this.alive)
        return;

    this.time += deltaSeconds;
    if (this.time > this.lifeTime) {
        this.time = this.lifeTime;
        this.alive = false;
    }

    this.particles.forEach(function (particle) {
        particle.update(deltaSeconds);
    });
};

ParticleEmitter.prototype.render = function (context) {
    if (!this.alive)
        return;


    context.globalAlpha = (1 - this.time / this.lifeTime);
    //context.scale(this.time/this.lifeTime + 1,this.time/this.lifeTime + 1);
    context.fillStyle = this.color;

    this.particles.forEach(function (particle) {
        particle.render(context);
    });

    //context.setTransform(1,0,0,1,0,0);
    context.globalAlpha = 1;
};

ctor(ParticleEmitter);