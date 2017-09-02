function OuterWallSprite(config) {
    Sprite.call(this, config.x, config.y, "assets/outerWall" + Level.instance.levelNumber + ".jpg");
};

inherit(OuterWallSprite, Sprite);

ctor(OuterWallSprite);
