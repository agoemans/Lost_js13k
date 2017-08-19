function EffectsLayer(particleCount, camera, level) {
    GameObject.call(this, 0, 0);

    this.effectsCanvas = document.createElement('canvas');
    
    this.effectsCanvas.width = game.width;
    
    this.effectsCanvas.height = game.height;

    this.camera = camera;

    this.level = level;

    this.effectsContext = this.effectsCanvas.getContext('2d');

    this.particleCount = particleCount;

    this.whiteFlakes = []

    for(var i=0; i<this.particleCount; i++)
    {
        var particle = new Particle();

        this.setupParticle(particle);
        
        this.whiteFlakes.push(particle);
    }
};


inherit(EffectsLayer, GameObject);
ctor(EffectsLayer);

EffectsLayer.prototype.setupParticle = function(particle)
{
    particle.x = Math.random() * this.level.width;

    particle.y = Math.random() * this.level.height;

    particle.width = 1;

    particle.height = 1;

    particle.targetWidth = 3 + Math.random() * 10;

    particle.targetHeight = particle.targetWidth;

    particle.lifeTime = 5 + Math.random() * 15;

    particle.time = particle.lifeTime;

    particle.gravity = 0;

    particle.velocity.x = 5 + Math.random() * 15;

    particle.velocity.y = 5 + Math.random() * 7;
}


EffectsLayer.prototype.updateParticle = function(deltaSeconds, particle) {
    
    particle.update(deltaSeconds);

    particle.time -= deltaSeconds;

    particle.width = (1-particle.time/particle.lifeTime) * particle.targetWidth;

    particle.height = (1-particle.time/particle.lifeTime) * particle.targetHeight;

    particle.x = particle.x % this.level.width;

    particle.y = particle.y % this.level.height;

    if(particle.time <= 0)
    {
        this.setupParticle(particle);
    }
}

EffectsLayer.prototype.update = function(deltaSeconds) {
    this.whiteFlakes.forEach(function (particle) {
        this.updateParticle(deltaSeconds, particle)
    }.bind(this));
}

EffectsLayer.prototype.render = function(context) {

    this.effectsContext.clearRect(0,0,game.width,game.height)

    this.effectsContext.fillStyle = '#ffffff';

    var position = this.camera.transform(0,0);

    this.effectsContext.setTransform(1,0,0,1,-position.x,-position.y);

    this.whiteFlakes.forEach(function (particle) {
        this.effectsContext.globalAlpha = particle.time/particle.lifeTime;
        particle.render(this.effectsContext);
    }.bind(this));

    var oldBlendingMode = context.globalCompositeOperation;

    context.save();

    context.setTransform(1,0,0,1,0,0);

    //context.globalCompositeOperation = 'source-over';

    context.drawImage(this.effectsCanvas, 0, 0, game.width, game.height);

    //context.globalCompositeOperation = oldBlendingMode;

    context.restore();

    this.effectsContext.setTransform(1, 0, 0, 1, 1, 1);
}