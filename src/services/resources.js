function Resources() {
    this.resources = {}

    this.resources.health = new Resource(3,3)

    this.resources.chalk = new Resource(100,100)
};

ctor(Resources);

Resources.prototype.getResource = function(name) {
    return this.resources[name]
}