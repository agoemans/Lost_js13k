function RenderTexture(x, y, width, height) {
    GameObject.call(this, x, y);

    this.width = width;

    this.height = height;

    this.canvas = document.createElement('canvas');

    this.canvas.width = width;

    this.canvas.height = height;

    this.context = this.canvas.getContext('2d');
}

ctor(RenderTexture);
inherit(RenderTexture, GameObject)

RenderTexture.prototype.render = function(context) {
    context.drawImage(this.canvas, this.x, this.y, this.width, this.height);
}
