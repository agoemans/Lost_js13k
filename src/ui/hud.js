function Hud(resources) {
  
    this.resources = resources;

    this.hearts = [];

    for(var i=0; i<3; i++)
    {
        var heart = new Sprite(20 + i * 40, 20, 'assets/heart.png', 2);
        this.hearts.push(heart);    
    }
};

ctor(Hud);

Hud.prototype.update = function(deltaSeconds) {

    var currentHealth = this.resources.get('health').currentValue;

    for(var i=0; i<3; i++)
    {
        this.hearts[i].frame = i < currentHealth ? 1 : 0
    }
}

Hud.prototype.render = function(context) {
    this.hearts.forEach(function(heart) {
        heart.render(context);
    });
}