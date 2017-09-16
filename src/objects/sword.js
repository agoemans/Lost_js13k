function Sword(parent) {
    InventoryItem.call(this, parent.x, parent.y, 'assets/Item__01.png');

    this.parent = parent;

    this.physics = true;

    this.direction = 1;
};

inherit(Sword, InventoryItem);
ctor(Sword);

Sword.prototype.collide = function (other) {
    console.log("sword:",other);
};

Sword.prototype.update = function(deltaSeconds) {
    InventoryItem.prototype.update.call(this, deltaSeconds);

    if(this.parent.moveDirX !== 0)
    {
        this.direction = this.parent.moveDirX;
    }

    this.x = this.parent.x + this.direction*15;

    this.y = this.parent.y + 10;

    this.flipX = (this.direction > 0);
};
