function Game() {
    State.call(this);

    this.resources = new Resources()

    this.level = null;
    this.cameraOffset = 0;
    this.gameOverPopup = null;
    this.gameOver = false;
};

inherit(Game, State);

Game.prototype.enter = function (config) {
    this.clear();
    game.canvas.style.backgroundColor = "#111";
    State.prototype.enter.call(this, context);

    this.cameraOffset = 0;
    
    this.level = new Level();
    this.level.load(null, this.addToRenderList, this);

    this.lightLayer = new LightLayer(this.level)

    this.player = new Player(10,10)

    gameOverHelper.register(this.showGameOver, this);
};

Game.prototype.addToRenderList = function (renderList) {
    for(var i = 0; i < renderList.length; i++){
        if(renderList[i] instanceof BrickSprite){
            this.add(renderList[i]);
        }
    }
};

Game.prototype.showGameOver = function () {
    //todo clear arrays, create a shutdown function
    this.gameOver = true;
    game.popup({title: "GameOVer", lines: ['Game over! Try again!'], permanent: true});
};

Game.prototype.mouseUp = function (x, y) {
    if(this.gameOver) {
        game.goto("game");
        this.gameOver = false;
    }
    else {
        State.prototype.mouseUp.call(this, x, y);
    }
}

Game.prototype.mouseMove = function(x,y) {
}


Game.prototype.keyDown = function (key)
{
    if (!this.player)
        return;

    if (key == 37)
        this.player.moveHorizontally(-1);
    if (key == 39)
        this.player.moveHorizontally(1);
    if (key == 38)
        this.player.moveVertically(1);
    if (key == 40)
        this.player.moveVertically(-1);
};

Game.prototype.keyUp = function (key)
{
    if (!this.player)
        return;

    if (key == 37 || key == 39 || key == 38 || key == 40)
        this.player.stop();
};


Game.prototype.leave = function () {
    State.prototype.leave.call(this, context);
};

Game.prototype.update = function (deltaSeconds) {
    this.level.update(deltaSeconds);

    this.player.update(deltaSeconds);

    this.lightLayer.setLightSource(this.player.x + this.player.width/2, this.player.y + this.player.height/2)
    
    State.prototype.update.call(this, deltaSeconds);
};

Game.prototype.render = function (context) {
    if (this.level.player) {
        var xOffset = (game.width - (this.level.tilesX * this.level.tileSize)) / 2;
        var yOffset = (game.height - (this.level.tilesY * this.level.tileSize)) / 2;

        this.cameraOffset = Math.floor(Math.clamp(-this.level.player.x + game.width / 2, -Level.instance.width + game.width, 0));
        context.setTransform(1, 0, 0, 1, this.cameraOffset + Math.max(xOffset, 0), yOffset);
    }

    this.level.render(context);

    State.prototype.render.call(this, context);

    this.player.render(context);

    this.lightLayer.render(context)

    context.setTransform(1, 0, 0, 1, 0, 0);
};

ctor(Game);