function State() {
    this.renderList = [];
    this.currentMouseOver = null;
};

inherit(State, Object);

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
    });
};

State.prototype.render = function (context) {

    this.renderList.forEach(function (obj) {
        obj.render(context);
    });
};


State.prototype.mouseUp = function (x, y) {
    for (var i = this.renderList.length - 1; i >= 0; i--) {
        var obj = this.renderList[i]
        //todo add interactable boolean
        if (obj.contains(x, y) && obj.interactable) {
            obj.mouseUp();
            return;
        }
    }
};

State.prototype.mouseDown = function (x, y) {
    for (var i = this.renderList.length - 1; i >= 0; i--) {
        var obj = this.renderList[i];
        //todo add interactable boolean
        if (obj.contains(x, y) && obj.interactable) {
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
        if (obj.contains(x, y)) {
            obj.mouseOver();
            this.currentMouseOver = obj;
            return;
        }
    }
};

State.prototype.keyDown = function (key) {};
State.prototype.keyUp = function (key) {};

ctor(State);



