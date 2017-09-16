function Sprite(x, y, image, frameCount, animCount) {
    GameObject.call(this, x, y);

    this.frameCount = frameCount || 1;
    this.animCount = animCount || 1;
    this.frame = 0;
    this.time = 0;
    this.fps = 15;
    this.animating = false;
    this.animation = 0;
    this.loop = false;

    this.visible = true;

    this.onDestroyed = null;
    this.loaded = false;
    if (typeof image === "string") {
        var img = new Image();
        img.src = image;
        this.image = img;
        this.image.onload = function () {
            this.width = this.image.width / this.frameCount;
            this.height = this.image.height / this.animCount;
            this.loaded = true;
        }.bind(this);
    }
    else if (typeof image === "object") {
        this.image = image;
        this.loaded = true;
    }


    this.flipY = false;
    this.flipX = false;

    this.collides = true;
    this.colliding = {top: false, bottom: false, left: false, right: false};
    this.onCollide = null;

    this.physics = false;
    this.gravity = 8500;
    this.velocity = {x: 0, y: 0};
};

inherit(Sprite, GameObject);

Sprite.prototype.resetCollision = function () {
    this.colliding.top = this.colliding.bottom = this.colliding.left = this.colliding.right = false;
};

Sprite.prototype.overlap = function (x, y, width, height) {

    if (!this.collides)
        return false;

    return mathHelper.overlaps(x,y,width,height,this.x,this.y,this.width,this.height);
};

Sprite.prototype.doCollision = function (elapsed) {
    var totalSteps = 10;
    var x = this.x;
    var y = this.y;
    var steps = totalSteps;
    var progress = 0;
    var velX = this.velocity.x;
    var velY = this.velocity.y;
    var collidingObjects = [];


    // First integrate over Y
    for (var i = 0; i < totalSteps; i++) {
        y += this.velocity.y * elapsed / totalSteps;

        if (this.velocity.y < 0) {
            var tl = Level.instance.tileAt(x, y);
            var tr = Level.instance.tileAt(x + this.width - 1, y);
            var tlOverlap = tl && tl.visible && tl.overlap(x, y, this.width, this.height);
            var trOverlap = tr && tr.visible && tr.overlap(x, y, this.width, this.height);

            if (tlOverlap)
                collidingObjects.push(tl);
            if (trOverlap)
                collidingObjects.push(tr);

            this.colliding.top = (tlOverlap || trOverlap);
        }
        else if (this.velocity.y > 0) {
            var bl = Level.instance.tileAt(x, y + this.height - 1);
            var br = Level.instance.tileAt(x + this.width - 1, y + this.height - 1);
            var blOverlap = bl && bl.visible && bl.overlap(x, y, this.width, this.height);
            var brOverlap = br && br.visible && br.overlap(x, y, this.width, this.height);

            if (blOverlap)
                collidingObjects.push(bl);
            if (brOverlap)
                collidingObjects.push(br);

            this.colliding.bottom = (blOverlap || brOverlap);
        }

        if (this.colliding.bottom || this.colliding.top) {
            this.velocity.y = 0;
            //console.log(this.colliding, bl, br)
            steps = i;
            break;
        }
    }

    progress = elapsed * steps / totalSteps;
    this.y += velY * progress;
    y = this.y;

    steps = totalSteps;

    // Then integrate over X
    for (var i = 0; i < totalSteps; i++) {
        x += this.velocity.x * elapsed / totalSteps;

        if (this.velocity.x < 0) {
            var tl = Level.instance.tileAt(x, y);
            var bl = Level.instance.tileAt(x, y + this.height - 1);
            var tlOverlap = tl && tl.visible && tl.overlap(x, y, this.width, this.height);
            var blOverlap = bl && bl.visible && bl.overlap(x, y, this.width, this.height);

            if (tlOverlap)
                collidingObjects.push(tl);
            if (blOverlap)
                collidingObjects.push(bl);

            this.colliding.left = (tlOverlap || blOverlap);
        }
        else if (this.velocity.x > 0) {
            var tr = Level.instance.tileAt(x + this.width - 1, y);
            var br = Level.instance.tileAt(x + this.width - 1, y + this.height - 1);

            var trOverlap = tr && tr.visible && tr.overlap(x, y, this.width, this.height);
            var brOverlap = br && br.visible && br.overlap(x, y, this.width, this.height);

            if (trOverlap)
                collidingObjects.push(tr);
            if (brOverlap)
                collidingObjects.push(br);

            this.colliding.right = (trOverlap || brOverlap);
        }

        if (this.colliding.left || this.colliding.right) {
            this.velocity.x = 0;
            steps = i;
            break;
        }
    }

    if(collidingObjects.length > 1){
        collidingObjects.forEach(function (other) {
            if (other && other.collides) other.collide(this);
        }.bind(this));
    }

    progress = elapsed * steps / totalSteps;
    this.x += velX * progress;
};

Sprite.prototype.collide = function () {
    if (this.onCollide) this.onCollide();
};

Sprite.prototype.destroy = function () {
    Level.instance.removeAt(this.x, this.y);
    if (this.onDestroyed) this.onDestroyed(this);
};

Sprite.prototype.play = function (animation, loop, fps) {
    if (this.animation != animation)
        this.time = 0;

    this.loop = loop === undefined ? this.loop : loop;

    this.animation = animation || 0;
    this.fps = fps || this.fps;
    this.animating = true;
};

Sprite.prototype.stop = function () {
    this.animating = false;
};

Sprite.prototype.isActive = function () {
    return this.physics;
};

Sprite.prototype.activate = function () {
    this.physics = true;
};

Sprite.prototype.update = function (deltaSeconds) {
    if (this.physics) {
        this.velocity.y += this.gravity * deltaSeconds;

        this.resetCollision();
        this.doCollision(deltaSeconds);
    }

    if (this.animating) {
        this.time += deltaSeconds;
        this.frame = Math.floor(this.fps * this.time);
        if (this.loop)
            this.frame = this.frame % this.frameCount;
        else
            this.frame = Math.min(this.frameCount - 1, this.frame);
    }
    else
        this.time += deltaSeconds;
};

Sprite.prototype.render = function (context) {

    if (!this.visible)
        return;

    if (this.flipY || this.flipX) {
        context.save();
        var flipX = this.x + this.width / 2;
        var flipY = this.y + this.height / 2;
        context.translate(flipX, flipY);
        context.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
        context.translate(-flipX, -flipY);
    }

    if (this.loaded)
        context.drawImage(this.image, this.frame * this.width, this.animation * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

    if (this.flipY || this.flipX)
        context.restore();
};

Sprite.prototype.getPoints = function()
{
    var points = [];

    points.push({x: this.x, y: this.y});

    points.push({x: this.x + this.width, y: this.y});

    points.push({x: this.x + this.width, y: this.y + this.height});

    points.push({x: this.x, y: this.y + this.height});

    return points;
}

ctor(Sprite);
