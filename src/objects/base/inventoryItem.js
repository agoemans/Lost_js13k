function InventoryItem(x, y, image) {
    Sprite.call(this, x, y, image);

    this.stackable = true;

    this.stackSize = 0;

    this.maxStackSize = 99;
};

inherit(InventoryItem, Sprite);
ctor(InventoryItem);
