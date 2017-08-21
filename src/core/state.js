function State() {
    BaseObject.call(this);
    this.renderList = [];
    this.currentMouseOver = null;

    this.camera = new Camera();
};

inherit(State, BaseObject);

State.prototype.enter = function () {};

State.prototype.leave = function () {};

State.prototype.add = function (obj) {
    this.renderList.push(obj);
};

State.prototype.remove = function (obj) {
    var i = this.renderList.indexOf(obj);
    if (i != -1)
        this.renderList.splice(i, 1);
};

State.prototype.clear = function () {
    this.renderList = [];
}

State.prototype.update = function (deltaSeconds) {
    this.renderList.forEach(function (obj) {
        obj.update(deltaSeconds);
    }.bind(this));
};

State.prototype.render = function (context) {

    this.renderList.forEach(function (obj) {
        if(this.camera.isOnScreen(obj)) {
            obj.render(context);
        }
    }.bind(this));
};


State.prototype.mouseUp = function (x, y) {
    for (var i = this.renderList.length - 1; i >= 0; i--) {
        var obj = this.renderList[i]

        if (obj.interactable && obj.contains(x, y)) {
            obj.mouseUp();
            return;
        }
    }
};

State.prototype.mouseDown = function (x, y) {
    for (var i = this.renderList.length - 1; i >= 0; i--) {
        var obj = this.renderList[i];

        if (obj.interactable && obj.contains(x, y)) {
            obj.mouseDown();
            return;
        }
    }
};

State.prototype.mouseMove = function (x, y) {
    if (this.currentMouseOver) {
        if (this.currentMouseOver.contains(x, y)) {
            return;
        }
        else {
            this.currentMouseOver.mouseOut();
            this.currentMouseOver = null;
        }
    }

    for (var i = this.renderList.length - 1; i >= 0; i--) {
        var obj = this.renderList[i];

        if (obj.interactable && obj.contains(x, y)) {
            obj.mouseOver();
            this.currentMouseOver = obj;
            return;
        }
    }
};

State.prototype.keyDown = function (key) {};
State.prototype.keyUp = function (key) {};

ctor(State);



