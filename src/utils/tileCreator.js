function TileCreator() {
};

TileCreator.prototype.tile = BrickSprite;

TileCreator.prototype.createTile = function (config) {
    if (config.type === '_' || config.type === 'X' || config.type === 0) {
        return null;
    }

    switch (config.type) {
        case 'Y':
            this.tile = OuterWallSprite;
            console.log('Y');
            break;
        case 'W':
        case 'E':
            this.tile = BrickSprite;
            console.log('E');
            break;
        // case 'G':
        //     this.tile = Goal;
        //     console.log('G');
        //     break;
        case 'H':
            this.tile = Door;
            break;
        default:
            this.tile = BrickSprite;
            break;
    }

    return new this.tile(config);
};

ctor(TileCreator);
