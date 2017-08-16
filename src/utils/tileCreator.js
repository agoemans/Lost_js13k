function TileCreator() {
};

TileCreator.prototype.tileClass = BrickSprite;

TileCreator.prototype.createTile = function (config) {
    if (config.type === '_') {
        return null;
    }

    switch (config.type) {
        case 'Y':
            this.tileClass = OuterWallSprite;
            break;
        case 'W':
            this.tileClass = BrickSprite;
            break;
        default:
            this.tileClass = BrickSprite;
            break;
    }

    return new this.tileClass(config);
};

ctor(TileCreator);
