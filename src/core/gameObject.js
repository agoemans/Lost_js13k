function GameObject(x, y) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;

    //todo add interactable cos moving level thingy somewhere

    this.interactable = false;
    this.onClick = null;
    this.onMouseOver = null;
    this.onMouseOut = null;
    this.onMouseDown = null;
    this.onMouseUp = null;
};

inherit(GameObject, Object);

GameObject.prototype.update = function (deltaSeconds) {

};

GameObject.prototype.render = function (context) {
};

GameObject.prototype.dispatch = function (obj) {
    if (obj)
        obj(this);
};

GameObject.prototype.mouseDown = function () {
    this.dispatch(this.onMouseDown);
};

GameObject.prototype.mouseUp = function () {
    this.dispatch(this.onClick);
    this.dispatch(this.onMouseUp);
};

GameObject.prototype.mouseOut = function () {
    this.dispatch(this.onMouseOut);
};

GameObject.prototype.mouseOver = function () {
    this.dispatch(this.onMouseOver);
};


GameObject.prototype.contains = function (x, y) {
    if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) {
        return true;
    }
    return false;
};


ctor(GameObject);