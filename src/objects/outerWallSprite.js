function OuterWallSprite(config) {
    Sprite.call(this, config.x, config.y, "assets/outerWall.jpg");
};

inherit(OuterWallSprite, Sprite);

ctor(OuterWallSprite);
