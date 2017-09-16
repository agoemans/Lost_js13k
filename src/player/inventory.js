function Inventory() {

    this.items = {};

    this.items.weapons = [];

    this.items.goals = [];

    this.items.armor = [];

    this.equipped = [];
};

inherit(Inventory, BaseObject);
ctor(Inventory);

Inventory.prototype.getItems = function(category)
{
    return this.items[category];
}

Inventory.prototype.addItem = function(item, category)
{
    if(this.items[category].contains(item) && item.stackable && item.stackSize < item.maxStackSize)
    {
        item.stackSize++;
    }
    else
    {
        this.items[category].push(item);
    }

    console.log(this.items);
}

Inventory.prototype.unequip = function(item)
{
    this.equipped.remove(item);
}

Inventory.prototype.equip = function(item)
{
    this.equipped.push(item);
}

Inventory.prototype.removeItem = function(item, category)
{
    this.items[category].remove(item);
}

Inventory.prototype.update = function(deltaSeconds)
{
    this.equipped.forEach(function(item) {
        item.update(deltaSeconds);
    });
}

Inventory.prototype.render = function(context)
{
    this.equipped.forEach(function(item) {
        item.render(context);
    });
}
