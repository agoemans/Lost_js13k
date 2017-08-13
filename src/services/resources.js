function Resources() {
    this.resources = {}

    this.resources.health = new Resources(3,3)

    this.resources.chalk = new Resources(100,100)
};

ctor(Resources);

Resources.prototype.getResource = function(name) {
    return this.resources[name]
}