function EffectsLayer(particleCount) {
    GameObject.call(this, 0, 0);

    this.effectsCanvas = document.createElement('canvas');
    
    this.effectsCanvas.width = game.width;
    
    this.effectsCanvas.height = game.height;

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
    particle.x = Math.random() * game.width;

    particle.y = Math.random() * game.height;

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

    particle.x = particle.x % game.width;

    particle.y = particle.y % game.height;

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
    
    this.whiteFlakes.forEach(function (particle) {
        this.effectsContext.globalAlpha = particle.time/particle.lifeTime;
        particle.render(this.effectsContext);
    }.bind(this));

    var oldBlendingMode = context.globalCompositeOperation;

    context.globalCompositeOperation = 'source-over';

    context.drawImage(this.effectsCanvas, 0, 0, game.width, game.height);

    context.globalCompositeOperation = oldBlendingMode;
}