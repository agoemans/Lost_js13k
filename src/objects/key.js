function Key(x, y) {
    Sprite.call(this, x, y, 'assets/key.png');
    this.onGoalReached = null;
    game.audio.add('key', 1, [[0, , 0.0289, 0.5117, 0.151, 0.7819, , , , , , , , , , , , , 1, , , , , 0.3]]);
};

inherit(Key, Sprite);
ctor(Key);

Key.prototype.collide = function (other) {
    if (!(other instanceof Player))
        return;

    this.collides = false;
    this.destroy();
    Level.instance.player.numKeys++;
    game.audio.play('key');
};