function TileCreator() {
};

TileCreator.prototype.tile = BrickSprite;

TileCreator.prototype.createTile = function (config) {
    if (config.type === '_' || config.type === 0 || config.type === 'H') {
        return null;
    }

    switch (config.type) {
        case 'Y':
            this.tile = OuterWallSprite;
            break;
        case 'W':
            this.tile = BrickSprite;
            break;
        case 'G':
            this.tile = Goal;
            console.log('G');
            break;
        default:
            this.tile = BrickSprite;
            break;
    }

    return new this.tile(config);
};

ctor(TileCreator);
