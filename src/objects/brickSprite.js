function BrickSprite(config) {
    Sprite.call(this, config.x, config.y, "assets/wall2.jpg");
    this.hasBomb = (config.type === 'b');
    this.nearbyBombs = (config.type !== 'b' ? config.type: 1);
    this.altImgSrc = null;
    this.image.src = (config.type === 'G' ? 'assets/goal.jpg' : 'assets/wall2.jpg');
    this.isFlagged = false;
    this.canClick = false;
    this.tint = '2277aa';
    this.interactable = false;
    this.tileFinder = tileFinder;
    this.row = config.row;
    this.col = config.col;

    //console.log('create bricksprite', config.row, config.col);
};

inherit(BrickSprite, Sprite);

ctor(BrickSprite);

BrickSprite.prototype.calcBombs = function () {
    this.nearbyBombs++;
};

BrickSprite.prototype.flag = function () {
    if(this.canClick){
        this.isFlagged = !this.isFlagged;
    }
};

BrickSprite.prototype.setAltImg = function () {
    if(this.hasBomb){
        this.altImgSrc = "assets/" + "goal" + ".jpg";
    } else {
        if(this.nearbyBombs === 0){
            this.altImgSrc = null;
        } else {
            this.altImgSrc = "assets/tile" + this.nearbyBombs + ".jpg";
        }
    }

};


BrickSprite.prototype.disableInput = function () {
    this.interactable = false;
};

BrickSprite.prototype.hide = function () {
    this.visible = false;
};

BrickSprite.prototype.onClickBrick = function (array) {
    console.log('onClickBrick', this.nearbyBombs);
    this.disableInput();

    if(this.hasBomb){
        gameOverHelper.execute();
    }
};
