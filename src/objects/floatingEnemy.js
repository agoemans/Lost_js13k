function FloatingEnemy(x, y) {
    Enemy.call(this, x, y, 'assets/eyeEnemy.png');
};

inherit(FloatingEnemy, Enemy);
ctor(FloatingEnemy);
