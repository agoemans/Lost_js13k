function Level(resources) {
    this.tileSize = 64;
    this.respawnTime = 1;
    this.active = false;
    this.frames = 0;
    this.goal = null;

    this.levelNumber = 1;

    this.player = null;
    this.enemies = [];
    this.items = [];
    this.goals =  new Goals();
    this.gemHelper =  new GemHelper();

    this.width = 0;
    this.height = 0;

    // Sample level
    this.tiles = [];

    this.tileObects = [];

    this.bgTexture = null;

    this.bgLayer = [];
    this.renderList = [];

    this.resources = resources;

    this.tileCreator = new TileCreator();

    this.miniMapTexture = null;

    game.audio.add('win', 1, [[0, , 0.52, 0.39, 0.27, 0.35, , 0.12, , 0.14, 0.56, 0.2085, 0.673, , , , , , 1, , , , , 0.3]]);

    Level.instance = this;
};

inherit(Level, Object);

Level.prototype.load = function (number, onCompleteCallback, ctx) {
    var that = this;
    this.levelNumber = number;

    dungeonGenerator.create().then(function(result){

        this.rooms = result.rooms;

        this.corridors = result.corridors;

        that.levelLoaded(result.grid);

        // that.createLevelItems(result, that.tileSize, that.resources);
        that.goals.create(result, that.tileSize, that.resources);

        that.gemHelper.create(result, that.tileSize, that.resources);

        that.goals.onGoalsComplete = that.gemHelper.activate.bind(that.gemHelper);

        onCompleteCallback.call(ctx, result.rooms[0], result.rooms);
    }.bind(this));

};

Level.prototype.levelLoaded = function (data) {
    this.tiles = data;
    //todo delete golas if other goals work
   // goalHelper.setGoalsInArray(this.tiles);
    this.processLevel();

}

Level.prototype.teleportPlayer = function () {
    //todo move this to helper
    var index = mathHelper.getRandomNumber(0, Level.instance.rooms.length);
    var roomObj = Level.instance.rooms[index];
    Level.instance.player.x =  (roomObj.x) * Level.instance.tileSize;
    Level.instance.player.y =  (roomObj.y) * Level.instance.tileSize;
}

Level.prototype.processLevel = function () {

    this.tilesX = this.tiles[0].length;
    this.tilesY = this.tiles.length;

    this.width = this.tilesX * this.tileSize;

    this.height = this.tilesY * this.tileSize;

    this.bgTexture = new RenderTexture(0,0,this.width,this.height);


    this.miniMapScale = 2;
    this.miniMapTexture = new RenderTexture(game.width - this.tilesX*this.miniMapScale, game.height - this.tilesY*this.miniMapScale, this.tilesX*this.miniMapScale, this.tilesY*this.miniMapScale);

    this.miniMapTexture.context.fillStyle = "#ffffff";

    this.miniMapTexture.context.fillRect(0,0,this.miniMapTexture.wdith,this.miniMapTexture.height);

    for (var y = 0; y < this.tiles.length; y++) {

        var row = this.tiles[y];

        for (var x = 0; x < row.length; x++) {
            var tile = row[x];
            this.addTile(tile, x, y);
        }
    }

    this.bgTexture.context.fillStyle = "#000000";

    this.bgTexture.context.fillRect(0, 0, this.tilesX * this.tileSize, this.tilesY * this.tileSize);

    this.bgTexture.context.fillStyle = "#5a5a5a";

    this.corridors.forEach(function(corridor){

        corridor.floorTiles.forEach(function(tile){

            this.bgTexture.context.fillStyle = "#3F3333";

            this.bgTexture.context.fillRect(tile.x * this.tileSize, tile.y * this.tileSize, this.tileSize, this.tileSize);

        }, this);
    }, this);


    this.rooms.forEach(function(room){

        this.bgTexture.context.fillStyle = "#3F3333";

        this.bgTexture.context.fillRect(room.x * this.tileSize, room.y * this.tileSize, room.w * this.tileSize, room.h * this.tileSize);

        this.bgTexture.context.fillStyle = "#5a5a5a";

        for (var i = 0; i < room.w * room.h; i++) {
            var x = Math.random() * room.w * this.tileSize;
            var y = Math.random() * room.h * this.tileSize;
            var size = Math.random() * 10;
            this.bgTexture.context.fillRect(room.x * this.tileSize + x, room.y * this.tileSize + y, size, size);
        }

    }, this);
};

Level.prototype.addTile = function (char, x, y) {
    var object = null;
    var pX = x * this.tileSize;
    var pY = y * this.tileSize;

    if(char === 'Y')
    {
        this.miniMapTexture.context.fillStyle = "#000000";
    }
    else if(char === 'E')
    {
        this.miniMapTexture.context.fillStyle = "#ffff00";
    }
    else if(char === '_')
    {
        this.miniMapTexture.context.fillStyle = "#00ffff";
    }
    else if(char === 'X')
    {
        this.miniMapTexture.context.fillStyle = "#555555";
    }
    else if(char === 'H')
    {
        this.miniMapTexture.context.fillStyle = "#330033";
    }

    this.miniMapTexture.context.fillRect(this.miniMapScale*x, this.miniMapScale*y, this.miniMapScale, this.miniMapScale);

    object = this.tileCreator.createTile({
        type: char, x: pX, y: pY, row: x, col: y, resources: this.resources
    });

    if (object) {

        this.renderList.push(object);

        if(!this.tileObects[y])
        {
            this.tileObects[y] = [];
        }

        this.tileObects[y][x] = object;

        return object;
    }

    return null;
};

Level.prototype.levelFailed = function () {
    console.error('level failed');
    var levelStr = localStorage[game.keyName] || 1;
    var topLevel = parseInt(levelStr);

    game.popup({title: "GameOVer", lines: ['Game over! Try again!']});

    // TODO:
    // Show lose popup
    //
    setTimeout(function () {
        game.goto("game", {level: topLevel});
    }.bind(this), 1000);
};

Level.prototype.levelComplete = function (x, y) {
    game.audio.play('win');
    console.log('win', this);
    Level.instance.player.stop();
    // Level.instance.particles.emit(x, y, '#AAFFAA');
    var levelStr = localStorage[game.keyName] || 1;

    var topLevel = parseInt(levelStr);
    topLevel++;

    if (topLevel > game.levels.length) {
        game.popup({
            title: "Congrats!",
            lines: ['You finished the game!', 'Reload the page to play again!'],
            permanent: true
        });
        topLevel = 1;
    }
    else {
        setTimeout(function () {
            game.goto("game", {level: topLevel});
        }, Level.instance.respawnTime * 1000);
    }

    localStorage[game.keyName] = topLevel;
};

Level.prototype.tileAt = function (x, y) {
    var tileX = Math.floor(x / this.tileSize);
    var tileY = Math.floor(y / this.tileSize);
    if (tileY >= this.tileObects.length || tileX > this.tileObects[tileY].length)
        return null;

    return this.tileObects[tileY][tileX];
};

Level.prototype.removeAt = function (x, y) {
    var tileX = Math.floor(x / this.tileSize);
    var tileY = Math.floor(y / this.tileSize);
    if (tileY >= this.tileObects.length || tileX > this.tileObects[tileY].length)
        return null;

    var object = this.tileObects[tileY][tileX];
    this.tileObects[tileY][tileX] = null;

    this.renderList.remove(object);

    return object;
};


Level.prototype.update = function (deltaSeconds) {
    if (this.player)
        this.player.update(deltaSeconds);

    this.enemies.forEach(function (obj) {
        obj.update(deltaSeconds);
    });
    //
    this.items.forEach(function (obj) {
        obj.update(deltaSeconds);
    });

    this.goals.update(deltaSeconds);

    this.gemHelper.update(deltaSeconds);

    if (this.key)
        this.key.update(deltaSeconds);
};

Level.prototype.render = function (context) {

    context.fillStyle = "#ffffff";

    this.bgTexture.render(context);

    this.renderList.forEach(function (obj) {
        obj.render(context);
    });

    this.enemies.forEach(function (obj) {
        obj.render(context);
    });

    this.items.forEach(function (obj) {
        obj.render(context);
    });

    this.goals.render(context);

    this.gemHelper.render(context);

    if (this.player)
        this.player.render(context);
};

ctor(Level);
