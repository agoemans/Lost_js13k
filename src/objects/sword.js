function Sword(parent) {
    InventoryItem.call(this, parent.x, parent.y, 'assets/book1.png');

    this.parent = parent;

    this.physics = true;
};

inherit(Sword, InventoryItem);
ctor(Sword);

Sword.prototype.collide = function (other) {
    console.log("sword:",other);
};

Sword.prototype.update = function(deltaSeconds) {
    InventoryItem.prototype.update.call(this, deltaSeconds);

    this.x = this.parent.x;

    this.y = this.parent.y;
};
