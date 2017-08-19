function OuterWallSprite(config) {
    Sprite.call(this, config.x, config.y, "assets/outerWall.jpg");
    this.tint = '644637';
};

inherit(OuterWallSprite, Sprite);

ctor(OuterWallSprite);