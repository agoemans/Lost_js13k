function Collision() {

    this.world = {};

    this.world.items = [];

    this.world.collisions = [];

    this.object = {};

    this.object.items = [];

    this.object.collisions = [];

    this.level = null;
};

ctor(Collision);

Collision.prototype.setLevel = function(level)
{
    this.level = level;
}

Collision.prototype.register = function(item, world, object)
{
    if(world && !this.world.items.contains(item))
    {
        this.world.items.push(item);
    }

    if(object && !this.object.items.contains(item))
    {
        this.object.items.push(item);
    }
}

Collision.prototype.resolve = function()
{
    this.resolveWorld();
    this.resolveObjects();
}

Collision.prototype.resolveWorld = function()
{
    var items = this.world.items;

    this.world.collisions = [];

    items.forEach(function(item) {
        var tile = this.level.tileAt(item.x, item.y);
        if(tile  && !this.containsCollision(this.world.collisions, item, tile) && item.overlapObject(tile))
        {
            item.collide(tile);

            this.world.collisions.push({item1: item, item2: tile});
        }
    }, this);

    if(this.world.collisions.length)
        console.log('world col', this.world.collisions);
};

Collision.prototype.resolveObjects = function()
{
    var items = this.object.items;

    this.object.collisions = [];

    items.forEach(function(item1) {
        items.forEach(function(item2) {
            if(item1 !== item2 && !this.containsCollision(this.object.collisions, item1, item2))
            {
                if(item1.overlapObject(item2))
                {
                    item1.collide(item2);
                    item2.collide(item1);

                    this.object.collisions.push({item1: item1, item2: item2});
                }
            }
        }, this);
    }, this);

    if(this.object.collisions.length)
        console.log('object col', this.object.collisions);
};

Collision.prototype.containsCollision = function(list, object1, object2)
{
    for(var i=0; i<list.length; i++)
    {
        var pair = list[i];

        if( (pair.item1 === object1 && pair.item2 === object2)
            || (pair.item1 === object2 && pair.item2 === object1) )
        {
            return true;
        }
    }

    return false;
}
