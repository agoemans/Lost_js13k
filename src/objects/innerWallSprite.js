function InnerWallSprite(x, y) {
    Sprite.call(this, x, y, "assets/wall2.png");
};

inherit(InnerWallSprite, Sprite);

ctor(InnerWallSprite);