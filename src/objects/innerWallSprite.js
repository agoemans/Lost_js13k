function InnerWallSprite(x, y) {
    Sprite.call(this, x, y, "assets/underWall.jpg");
};

inherit(InnerWallSprite, Sprite);

ctor(InnerWallSprite);
