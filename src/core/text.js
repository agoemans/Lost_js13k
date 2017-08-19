function Label(x, y, size, font, text) {
    GameObject.call(this, x, y);

    this.interactable = false;
    this.text = text;
    this.font = font;
    this.height = size;
    this.style = this.height + "px " + font;
    this.color = "#333";
    this.visible = true;
};

inherit(Label, GameObject);

Label.prototype.update = function (deltaSeconds) {

};

Label.prototype.enableInput = function () {
    this.interactable = true;
};

Label.prototype.render = function (context) {
    if (!this.visible)
        return;

    context.font = this.style;

    if (!this.width)
        this.width = context.measureText(this.text).width;

    context.fillStyle = this.color;
    context.fillText(this.text, this.x, this.y + this.height);
};

ctor(Label);
