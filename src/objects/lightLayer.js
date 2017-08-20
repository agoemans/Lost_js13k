function LightLayer(level) {
    GameObject.call(this, 0, 0);

    this.lightingPos = { x: 0, y: 0 };

    this.level = level

    this.gradient = null;

    this.iterations = 10;

    this.sizeVar = 30;

    this.minSize = 50;

    this.minAlpha = 0.05

    this.attenuation = this.minSize + this.sizeVar * this.iterations;

    this.width = game.width;

    this.height = game.height;

    this.pointLightTexture = null;

    this.lightTexture = new RenderTexture(0,0,game.width,game.height);

    this.ambientLight = '#15171f';

    this.lightColor = '#ffeedd';
};


inherit(LightLayer, GameObject);
ctor(LightLayer);

LightLayer.prototype.setLightSource = function(x,y) {

    this.lightingPos.x = x;

    this.lightingPos.y = y;

    this.x = this.lightingPos.x - this.width/2;

    this.y = this.lightingPos.y - this.height/2;

    this.lightTexture.x = this.x;

    this.lightTexture.y = this.y;
}

LightLayer.prototype.renderLightRadius = function() {

    this.pointLightTexture = new RenderTexture(this.width/2 - this.attenuation,this.height/2 - this.attenuation,this.attenuation*2,this.attenuation*2);

    this.pointLightTexture.context.fillStyle = this.lightColor;

    this.pointLightTexture.context.beginPath()

    for(var i=0;i<=this.iterations;i++)
    {
        this.pointLightTexture.context.globalAlpha = this.minAlpha + (1-this.minAlpha) * 1/(i+1) * 1/(i+1);

        var size = this.minSize + this.sizeVar * i;

        this.pointLightTexture.context.arc(this.attenuation, this.attenuation, size, 0, Math.PI * 2)

        this.pointLightTexture.context.fill();
    }

    this.pointLightTexture.context.closePath();
 }

LightLayer.prototype.render = function(context) {

    this.lightTexture.context.fillStyle = this.ambientLight;

    this.lightTexture.context.globalAlpha = 1;

    this.lightTexture.context.fillRect(0, 0, this.width, this.height);

    if(this.pointLightTexture === null)
    {
        this.renderLightRadius();
    }

    this.pointLightTexture.render(this.lightTexture.context);

    this.lightTexture.context.setTransform(1, 0, 0, 1, -this.x, -this.y);

    var tilesInRange = [];

    this.level.renderList.forEach(function (obj) {
        if((obj instanceof BrickSprite || obj instanceof OuterWallSprite) && obj.visible){

            var points = obj.getPoints();

            var closest = this.getClosestPoint(points, this.lightingPos);

            var distanceSqr = mathHelper.distanceSqr(closest.x, closest.y, this.lightingPos.x, this.lightingPos.y);

            this.lightTexture.context.fillStyle = this.ambientLight;

            this.lightTexture.context.globalAlpha = 1;

            if(distanceSqr > this.attenuation*this.attenuation)
            {
                return;
            }

            points.remove(closest);

            var furthest = this.getFurthestPoint(points, this.lightingPos);

            points.remove(furthest);

            if(!points)
            {
                return
            }

            this.lightTexture.context.beginPath();

            var distance = 500;

            this.lightTexture.context.fillStyle = this.ambientLight;

            this.lightTexture.context.globalAlpha = 1;

            this.drawSegment(this.lightTexture.context, closest.x, closest.y, points[0].x, points[0].y);

            this.drawSegment(this.lightTexture.context, closest.x, closest.y, points[1].x, points[1].y);

            this.lightTexture.context.closePath();

            tilesInRange.push({ obj: obj, alpha: 1 - distanceSqr/(this.attenuation*this.attenuation) } );
        }

    }.bind(this));

    tilesInRange.forEach(function(tile) {
        this.lightTexture.context.fillStyle = this.lightColor;

        this.lightTexture.context.globalAlpha = tile.alpha/2;

        this.lightTexture.context.fillRect(tile.obj.x, tile.obj.y, tile.obj.width, tile.obj.height);
    }.bind(this));

    this.lightTexture.context.fillStyle = this.ambientLight;

    this.lightTexture.context.setTransform(1, 0, 0, 1, 1, 1);

    var oldBlendingMode = context.globalCompositeOperation;

    context.globalAlpha = 1;

    context.globalCompositeOperation = 'multiply';

    this.lightTexture.render(context);

    context.globalCompositeOperation = oldBlendingMode;
}

LightLayer.prototype.drawSegment = function(context, x1, y1, x2, y2) {
    var distance = 500;

    context.moveTo(x1, y1);

    context.lineTo(x2, y2);

    context.lineTo(x2 + (x2 - this.lightingPos.x)*distance, y2 + (y2 - this.lightingPos.y)*distance);

    context.lineTo(x1 + (x1 - this.lightingPos.x)*distance, y1 + (y1 - this.lightingPos.y)*distance);

    context.lineTo(x1, y1);

    context.fill();
}

LightLayer.prototype.getClosestPoint = function(points, source)
{
    var dist = Infinity;

    var closest = null;

    points.forEach(function(point){
        var distanceSqr = mathHelper.distanceSqr(point.x, point.y, source.x, source.y);

        if(distanceSqr < dist) {
            closest = point;
            dist = distanceSqr;
        }

    });

    return closest;
}

LightLayer.prototype.getFurthestPoint = function(points, source)
{
    var dist = 0;

    var furthest = null;

    points.forEach(function(point){
        var distanceSqr = mathHelper.distanceSqr(point.x, point.y, source.x, source.y);

        if(distanceSqr > dist) {
            furthest = point;
            dist = distanceSqr;
        }

    });

    return furthest;
}


