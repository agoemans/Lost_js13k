function InnerWallSprite(x, y) {
    Sprite.call(this, x, y, "assets/bomb.png");
    this.tint = '2277aa';
};

inherit(InnerWallSprite, Sprite);

ctor(InnerWallSprite);