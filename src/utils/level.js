function Level(resources) {
    this.tileSize = 64;
    this.xOffset = 1;
    this.yOffset = 1;
    this.respawnTime = 1;
    this.active = false;
    this.frames = 0;
    this.goal = null;

    this.player = null;
    this.enemies = [];

    this.width = 0;
    this.height = 0;

    // Sample level
    this.tiles = [];

    this.tileObects = [];

    this.bgLayer = [];
    this.renderList = [];

    this.resources = resources;

    //determine if read level from file or generated
    this.generated = true;

    this.tileCreator = new TileCreator();

    this.onCompleteCallback = null;
    this.onCompleteCtx = null;
    // this.loadLevel(number);

    game.audio.add('win', 1, [[0, , 0.52, 0.39, 0.27, 0.35, , 0.12, , 0.14, 0.56, 0.2085, 0.673, , , , , , 1, , , , , 0.3]]);

    Level.instance = this;
};

inherit(Level, Object);

Level.prototype.load = function (number, onCompleteCallback, ctx) {
    this.onCompleteCallback = onCompleteCallback;
    this.onCompleteCtx = ctx;
    if(this.generated){
        var that = this;
        gridCreator.create().then(function(result){
            that.levelLoaded(result);
            console.log('gridcreator', result);
        });
    } else {
        console.log('level else');
        this.loadLevel(number);
    }
}

Level.prototype.levelLoaded = function (data) {
    this.tiles = data;
    goalHelper.setGoalsInArray(this.tiles);
    this.processLevel();

   console.log(this.tiles);
}

Level.prototype.processFileData = function (data) {
    var templist = [];
    var mainlist = [];
    var i;
    templist = data.split("\n");
    for (i = 0; i < templist.length; i++) {
        mainlist.push(templist[i].trim().split(""));
    }
    this.levelLoaded(mainlist);
}


Level.prototype.loadLevel = function (number) {
    if (number > game.levels.length)
        number = 1;

    var level = game.levels[number - 1];
    this.processFileData(level);
};

Level.prototype.processLevel = function () {
    this.tilesX = this.tiles[0].length + 2;
    this.tilesY = this.tiles.length + 2;

    for (var y = 0; y < this.tilesY; y++) {
        this.tileObects[y] = [];
        for (var x = 0; x < this.tilesX; x++) {
            if (x === 0 || x === this.tilesX - 1 || y === 0 || y === this.tilesY - 1)
                this.addTile('Y', x, y);
        }
    }

    for (var y = 0; y < this.tiles.length; y++) {
        var row = this.tiles[y];
        for (var x = 0; x < row.length; x++) {
            var newX = x + this.xOffset;
            var newY = y + this.yOffset;
            var tile = row[x];
            this.addTile(tile, newX, newY);
        }
    }
    
    this.width = this.tilesX * this.tileSize;
    this.height = this.tilesY * this.tileSize;

    for (var i = 0; i < this.tilesX * this.tilesY; i++)
        this.bgLayer.push({
            x: Math.random() * (this.tilesX * this.tileSize - 40) + 20,
            y: Math.random() * (this.tilesY * this.tileSize - 40) + 20,
            size: Math.random() * 10
        });

    console.log('this.tileObects', this.tileObects);

    this.onCompleteCallback.call(this.onCompleteCtx, this.renderList);
};

Level.prototype.addTile = function (char, x, y) {
    var object = null;
    var pX = x * this.tileSize;
    var pY = y * this.tileSize;

    //create brick obj first
    object = this.tileCreator.createTile({
        type: char, x: pX, y: pY, row: x, col: y, resources: this.resources
    });

    if (object instanceof BrickSprite){
        object.setAltImg();
        var self = this;
        object.onClick = function(){
            object.onClickBrick(self.tileObects);
        }
    }

    if (object) {
        this.renderList.push(object);

        this.tileObects[y][x] = object;

        return object;
    }

    return null;
};

Level.prototype.levelFailed = function () {
    var player = Level.instance.player;
    Level.instance.particles.emit(player.x + player.width / 2, player.y + player.height / 2, '#AAAAAA');
    Level.instance.player.die();
    var levelStr = localStorage[game.keyName] || 1;
    var topLevel = parseInt(levelStr);


    // TODO:
    // Show lose popup
    //
    setTimeout(function () {
        // game.goto("game", {level: topLevel});
    }.bind(this), Level.instance.respawnTime * 1000);
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

    if (this.key)
        this.key.update(deltaSeconds);

    // if (this.goal)
    //     this.goal.update(deltaSeconds);

    if (!this.active && this.player) {
        this.frames++;
        if (this.frames > 3) {
            this.active = true;
            this.enemies.forEach(function (obj) {
                obj.activate();
            });
            this.player.activate();
        }
    }
};

Level.prototype.render = function (context) {
    context.fillStyle = "#333333";
    context.fillRect(0, 0, this.tilesX * this.tileSize, this.tilesY * this.tileSize);
    context.fillStyle = "#5a5a5a";
    this.bgLayer.forEach(function (obj) {
        context.fillRect(obj.x, obj.y, obj.size, obj.size);
    });

    this.renderList.forEach(function (obj) {
        obj.render(context);
    });

    this.enemies.forEach(function (obj) {
        obj.render(context);
    });

    if (this.player)
        this.player.render(context);

};

ctor(Level);
