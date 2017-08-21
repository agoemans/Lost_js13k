function Resources() {
    this.resources = {};

    this.health = new Resource(3, 3);

    this.chalk = new Resource(100, 100);

    this.goals = new Resource(3, 0);
};

ctor(Resources);
