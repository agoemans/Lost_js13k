function InnerWallSprite(x, y) {
    Sprite.call(this, x, y, "assets/wall2.png");
    this.tint = '2277aa';
};

inherit(InnerWallSprite, Sprite);

ctor(InnerWallSprite);