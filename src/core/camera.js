
function Camera() {
    this.x = 0;
    this.y = 0;
    this.state = 0;
};

ctor(Camera)

Camera.prototype.setPosition = function(x,y) {
    this.x = x;
    this.y = y;
}

Camera.prototype.transform = function (x,y) {

    if(this.state === 0)
    {
        return { x: x, y: y }
    }
    else if(this.state === 1)
    {
        return { x: x - game.width/2 + this.x, y: y - game.height/2 + this.y };
    }
};


Camera.prototype.setWorld = function (context) {
    this.state = 1;
    
    context.setTransform(1, 0, 0, 1, game.width/2 - this.x, game.height/2 - this.y);
};

Camera.prototype.setHud = function (context) {
    this.state = 0;

    context.setTransform(1, 0, 0, 1, 0, 0);
}

Camera.prototype.isOnScreen = function(gameObject) {

    var position = this.transform(gameObject.x, gameObject.y);

    var xFit = position.x > 0 || position.x + gameObject.width < game.width;

    var yFit = position.y > 0 || position.y + gameObject.height < game.height;

    return xFit || yFit;
}


ctor(Text);
