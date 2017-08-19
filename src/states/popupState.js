function Popup() {
    this.permanent = false;
    State.call(this);
    this.width = 400;
    this.height = 150;
};

inherit(Popup, State);

Popup.prototype.enter = function (config) {
    State.prototype.enter.call(this);

    this.permanent = config.permanent;

    this.height = 150;
    this.clear();

    var text = new Label(this.width / 2 - 50, 6, 28, "Trebuchet MS", config.title);
    text.color = "#222";
    this.add(text);

    var height = 100;
    var lineHeight = 40;
    config.lines.forEach(function (line) {
        text = new Label(this.width / 2 - 160, height, 24, "Trebuchet MS ", line);
        this.add(text);
        height += lineHeight;
        this.height += lineHeight;
    }.bind(this));

};

Popup.prototype.render = function (context) {
    context.globalAlpha = 0.5;
    context.fillStyle = "#000";
    context.fillRect(0, 0, game.width, game.height);
    context.globalAlpha = 1.0;

    context.setTransform(1, 0, 0, 1, (game.width - this.width) / 2, game.height / 2 - this.height / 2);
    context.strokeStyle = "#999";
    context.lineWidth = 10;
    context.strokeRect(0, 0, this.width, this.height);
    context.fillStyle = "#eee";
    context.fillRect(0, 0, this.width, this.height);
    context.fillStyle = "#999";
    context.fillRect(-1, 0, this.width + 2, 50);
    State.prototype.render.call(this, context);
    context.setTransform(1, 0, 0, 1, 0, 0);
};

ctor(Popup);