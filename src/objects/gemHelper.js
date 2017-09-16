function GemHelper() {
    this.altar = null;
    this.gem = null;
}

GemHelper.prototype.create = function (result, tileSize, resources){
    var rooms = result.rooms;
    var index = mathHelper.getRandomNumber(0, rooms.length);
    var roomObj = rooms[index];

    // this.altar = new GemAltar((roomObj.x + roomObj.w / 2) * tileSize, (roomObj.y + roomObj.h / 2) * tileSize, resources);
    this.gem = new Gem((roomObj.x + roomObj.w / 2) * tileSize, (roomObj.y + roomObj.h / 2) * tileSize, resources);

    // this.altar.onGemAltarReached = this.gem.deactivate.bind(this.gem);
};

GemHelper.prototype.activate = function () {
    this.gem.activate();
};

GemHelper.prototype.update = function (deltaSeconds) {
    // this.altar.update(deltaSeconds);
    this.gem.update(deltaSeconds);
};

GemHelper.prototype.render = function (context) {
    // this.altar.render(context);
    this.gem.render(context);
};


GemHelper.prototype.drawOnMap = function (context, miniMapTexture, miniMapScale, tileSize) {
    var x = miniMapTexture.x + miniMapScale * this.gem.x / tileSize;
    var y = miniMapTexture.y + miniMapScale * this.gem.y / tileSize;
    if(this.gem.beaconOn){
        this.gem.drawOnMap(context, x, y)
    }

};

GemHelper.prototype.removeAt = function () {

};
