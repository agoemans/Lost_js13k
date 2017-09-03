function Game() {
    State.call(this);

    this.resources = new Resources();

    this.level = null;
    this.cameraOffset = 0;
    this.gameOver = false;
};

inherit(Game, State);

Game.prototype.enter = function (config) {
    console.error('game start');

    this.clear();

    game.canvas.style.backgroundColor = "#000000";

    State.prototype.enter.call(this, context);

    this.cameraOffset = 0;

    var level = getUrlParameter('level') || config.level;
    var levelInt = parseInt(level);

    this.level = new Level(this.resources);

    this.level.load(levelInt, this.levelLoaded, this);

    gameOverHelper.register(this.showGameOver, this);
};

Game.prototype.levelLoaded = function (room, rooms) {

    this.lightLayer = new LightLayer(this.level);

    this.add(this.lightLayer);

    this.player = new Player((room.x + room.w / 2) * this.level.tileSize, (room.y + room.h / 2) * this.level.tileSize, this.resources.health);
    this.level.player = this.player;

    console.log('player', room, this.level.tileSize, this.player);
    //todo move this to level
    this.level.enemies = enemyGenerator.placeEnemies(rooms, this.level.tileSize);

    itemGenerator.placeItems(rooms, this.level.tileSize, this.resources);

    //todo move this to items generator
    // for (var i = 0; i < 3; i++){
    //     var index = mathHelper.getRandomNumber(0, rooms.length);
    //     var roomObj = rooms[index];
    //     var teleport = new Teleport(roomObj.x + 25, roomObj.y + 15, this.level.resources);
    //     teleport.onActivate = this.level.teleportPlayer;
    //     this.level.enemies.push(teleport);
    // }
    //
    // var heart = new HealthPickup((room.x + room.w / 2) * this.level.tileSize, (room.y + room.h / 2) * this.level.tileSize + 30, this.level.resources);
    // this.level.enemies.push(heart);
    // console.log('this.player', this.player);
    // console.log('heart', heart);
    //
    // this.level.items = itemGenerator.placeItems(rooms, this.level.tileSize, this.resources);

    console.log(room);

    //this.add(this.player);

    this.effectsLayer = new EffectsLayer(this.level.tilesX * this.level.tilesY / 10, this.camera, this.level);

    this.add(this.effectsLayer);

    this.hud = new Hud(this.resources);
};

Game.prototype.showGameOver = function () {
    //todo clear arrays, create a shutdown function
    this.gameOver = true;
   // this.level.levelFailed();
};

Game.prototype.mouseUp = function (x, y) {
    if (this.gameOver) {
        this.gameOver = false;
    }
    else {
        State.prototype.mouseUp.call(this, x, y);
    }
}

Game.prototype.mouseMove = function (x, y) {
}


Game.prototype.keyDown = function (key) {
    if (!this.player)
        return;

    if (key == 37)
        this.player.moveHorizontally(-1);
    if (key == 39)
        this.player.moveHorizontally(1);
    if (key == 38)
        this.player.moveVertically(-1);
    if (key == 40)
        this.player.moveVertically(1);
};

Game.prototype.keyUp = function (key) {
    if (!this.player)
        return;

    if (key == 37 || key == 39) {
        this.player.stopHorizontal();
    } else if (key == 38 || key == 40) {
        this.player.stopVertical();
    }

};


Game.prototype.leave = function () {
    State.prototype.leave.call(this, context);
};

Game.prototype.update = function (deltaSeconds) {

    this.level.update(deltaSeconds);

    this.lightLayer.setLightSource(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

    this.camera.setPosition(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

    State.prototype.update.call(this, deltaSeconds);

    this.hud.update(deltaSeconds);

    if(Level.instance.player.health.currentValue === 0) {
        gameOverHelper.execute();
    }
};

Game.prototype.render = function (context) {

    this.camera.setWorld(context);

    this.level.render(context);

    State.prototype.render.call(this, context);

    this.camera.setHud(context);

    this.hud.render(context);

    if(this.level.miniMapTexture)
    {
        this.level.miniMapTexture.render(context);

        context.fillStyle = "#ff00ff";

        context.fillRect(this.level.miniMapTexture.x + this.level.miniMapScale * this.player.x / this.level.tileSize, this.level.miniMapTexture.y + this.level.miniMapScale * this.player.y / this.level.tileSize, this.level.miniMapScale, this.level.miniMapScale);

        //todo for debugging only
        for(var i = 0; i < this.level.items.length; i++){
            context.fillRect(this.level.miniMapTexture.x + this.level.miniMapScale * this.level.items[i].x / this.level.tileSize,
                this.level.miniMapTexture.y + this.level.miniMapScale * this.level.items[i].y / this.level.tileSize,
                this.level.miniMapScale, this.level.miniMapScale);
        }

    }

    this.camera.setWorld(context);
};

ctor(Game);
