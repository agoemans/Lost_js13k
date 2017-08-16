function BrickSprite(config) {
    Sprite.call(this, config.x, config.y, "assets/wall2.png");
    this.hasBomb = (config.type === 'b');
    this.nearbyBombs = (config.type !== 'b' ? config.type: 1);
    this.altImgSrc = null;
    this.image.src = (config.type === 'X' ? 'assets/wall_w.png' : 'assets/wall2.png');
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
        this.altImgSrc = "assets/" + "bomb" + ".png";
    } else {
        if(this.nearbyBombs === 0){
            this.altImgSrc = null;
        } else {
            this.altImgSrc = "assets/tile" + this.nearbyBombs + ".png";
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

    if(this.nearbyBombs === 0){
        this.hide();
        this.tileFinder.find(this.row, this.col, array);
    }
    else {
        this.image.src = this.altImgSrc;
    }
    if(this.hasBomb){
        gameOverHelper.execute();
    }
};
