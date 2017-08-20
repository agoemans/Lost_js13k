function Door(config) {
    Sprite.call(this, config.x, config.y, 'assets/door.jpg');
    this.onGoalReached = null;
    game.audio.add('door', 1, [[1, , 0.01, , 0.2298, 0.6306, , -0.53, , , , , , , , , , , 1, , , , , 0.3]]);
    game.audio.add('door_no', 1, [[0, , 0.18, 0.41, , 0.24, , , , , , 0.4625, 0.6586, , , , , , 1, , , , , 0.3]]);
};

inherit(Door, Sprite);
ctor(Door);

Door.prototype.collide = function (other) {
    if (!(other instanceof Player))
        return;

    this.collides = false;
    this.destroy();
    game.audio.play('door');
    // if (Level.instance.player.numKeys) {
    //     Level.instance.player.numKeys--;
    //     this.collides = false;
    //     this.destroy();
    //     game.audio.play('door');
    // }
    // else
    //     game.audio.play('door_no');

};
