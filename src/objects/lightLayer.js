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

    this.pointLightCanvas = null;

    this.lightCanvas = document.createElement('canvas');

    this.lightCanvas.width = game.width;

    this.lightCanvas.height = game.height;

    this.lightContext = this.lightCanvas.getContext('2d');

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
}

LightLayer.prototype.renderLightRadius = function() {

    this.pointLightCanvas = document.createElement('canvas');

    this.pointLightCanvas.width = this.attenuation*2;

    this.pointLightCanvas.height = this.attenuation*2;

    var pointLightContext = this.pointLightCanvas.getContext('2d');

    pointLightContext.fillStyle = this.lightColor;

    pointLightContext.beginPath()

    for(var i=0;i<=this.iterations;i++)
    {
        pointLightContext.globalAlpha = this.minAlpha + (1-this.minAlpha) * 1/(i+1) * 1/(i+1);

        var size = this.minSize + this.sizeVar * i;

        pointLightContext.arc(this.attenuation, this.attenuation, size, 0, Math.PI * 2)

        pointLightContext.fill();
    }

    pointLightContext.closePath();
 }

LightLayer.prototype.render = function(context) {

    this.lightContext.fillStyle = this.ambientLight;

    this.lightContext.globalAlpha = 1;

    this.lightContext.clearRect(0, 0, this.width, this.height);

    this.lightContext.fillRect(0, 0, this.width, this.height);

    if(this.pointLightCanvas === null)
    {
        this.renderLightRadius();
    }

    this.lightContext.drawImage(this.pointLightCanvas, this.width/2 - this.attenuation, this.height/2 - this.attenuation, this.pointLightCanvas.width, this.pointLightCanvas.height);


    this.lightContext.setTransform(1, 0, 0, 1, -this.x, -this.y);

    var tilesInRange = [];

    this.level.renderList.forEach(function (obj) {
        if((obj instanceof BrickSprite || obj instanceof OuterWallSprite) && obj.visible){

            var points = obj.getPoints();

            var closest = this.getClosestPoint(points, this.lightingPos);

            var distanceSqr = mathHelper.distanceSqr(closest.x, closest.y, this.lightingPos.x, this.lightingPos.y);

            this.lightContext.fillStyle = this.ambientLight;

            this.lightContext.globalAlpha = 1;

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

            this.lightContext.beginPath();

            var distance = 500;

            this.lightContext.fillStyle = this.ambientLight;

            this.lightContext.globalAlpha = 1;

            this.drawSegment(closest.x, closest.y, points[0].x, points[0].y);

            this.drawSegment(closest.x, closest.y, points[1].x, points[1].y);

            this.lightContext.closePath();

            tilesInRange.push({ obj: obj, alpha: 1 - distanceSqr/(this.attenuation*this.attenuation) } );
        }

    }.bind(this));

    tilesInRange.forEach(function(tile) {
        this.lightContext.fillStyle = this.lightColor;

        this.lightContext.globalAlpha = tile.alpha/2;

        this.lightContext.fillRect(tile.obj.x, tile.obj.y, tile.obj.width, tile.obj.height);
    }.bind(this));

    this.lightContext.fillStyle = this.ambientLight;

    this.lightContext.setTransform(1, 0, 0, 1, 1, 1);

    var oldBlendingMode = context.globalCompositeOperation;

    context.globalAlpha = 1;

    context.globalCompositeOperation = 'multiply';

    context.drawImage(this.lightCanvas, this.x, this.y, this.lightCanvas.width, this.lightCanvas.height);

    context.globalCompositeOperation = oldBlendingMode;
}

LightLayer.prototype.drawSegment = function(x1, y1, x2, y2) {
    var distance = 500;

    this.lightContext.moveTo(x1, y1);

    this.lightContext.lineTo(x2, y2);

    this.lightContext.lineTo(x2 + (x2 - this.lightingPos.x)*distance, y2 + (y2 - this.lightingPos.y)*distance);

    this.lightContext.lineTo(x1 + (x1 - this.lightingPos.x)*distance, y1 + (y1 - this.lightingPos.y)*distance);

    this.lightContext.lineTo(x1, y1);

    this.lightContext.fill();
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


