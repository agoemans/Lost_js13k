function Text(x, y, size, font, text) {
    GameObject.call(this, x, y);

    this.interactable = false;
    this.text = text;
    this.font = font;
    this.height = size;
    this.style = this.height + "px " + font;
    this.color = "#333";
    this.visible = true;
};

inherit(Text, GameObject);

Text.prototype.update = function (deltaSeconds) {

};

Text.prototype.enableInput = function () {
    this.interactable = true;
};

Text.prototype.render = function (context) {
    if (!this.visible)
        return;

    context.font = this.style;

    if (!this.width)
        this.width = context.measureText(this.text).width;

    context.fillStyle = this.color;
    context.fillText(this.text, this.x, this.y + this.height);
};

ctor(Text);
