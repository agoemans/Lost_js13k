function LightLayer(level) {
    GameObject.call(this, 0, 0);

    this.lightingPos = { x: 0, y: 0 };

    this.width = game.width;

    this.height = game.height;

    this.level = level

    this.gradient = null;

    this.lightCanvas = document.createElement('canvas');
    
    this.lightCanvas.width = game.width;
    
    this.lightCanvas.height = game.height;

    this.lightContext = this.lightCanvas.getContext('2d');
};


inherit(LightLayer, GameObject);
ctor(LightLayer);

LightLayer.prototype.setLightSource = function(x,y) {
    this.lightingPos.x = x;
    this.lightingPos.y = y;
}

LightLayer.prototype.render = function(context) {

    var oldBlendingMode = this.lightContext.globalCompositeOperation;

    var ambientColor = '#777777'

    this.lightContext.fillStyle = ambientColor;

    this.lightContext.fillRect(0, 0, game.width,game.height);

    this.lightContext.fillStyle = '#ffffff';

    this.lightContext.beginPath()

    var iterations = 7;
    
    var sizeVar = 50;

    var minSize = 50;

    var minAlpha = 0.05

    for(var i=0;i<=iterations;i++)
    {
        this.lightContext.globalAlpha = minAlpha + (1-minAlpha) * 1/(i+1) * 1/(i+1);

        var size = minSize + sizeVar * i;

        this.lightContext.arc(this.lightingPos.x, this.lightingPos.y, size, 0, Math.PI * 2)

        this.lightContext.fill();
    }

    this.lightContext.closePath();

    this.lightContext.fillStyle = ambientColor;

    this.lightContext.globalAlpha = 1;

    var attenuation = minSize + sizeVar * iterations;

    this.width = attenuation*2;

    this.height = attenuation*2;

    this.x = this.lightingPos.x - this.width/2;

    this.y = this.lightingPos.y - this.height/2;


    this.level.renderList.forEach(function (obj) {
        if(obj instanceof BrickSprite && obj.visible){

            var points = obj.getPoints();

            var closest = this.getClosestPoint(points, this.lightingPos);

            var distanceSqr = mathHelper.distanceSqr(closest.x, closest.y, this.lightingPos.x, this.lightingPos.y);

            if(distanceSqr > attenuation*attenuation)
            {
                this.lightContext.fillRect(obj.x,obj.y,obj.width,obj.height);

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

            this.lightContext.moveTo(closest.x ,closest.y);

            this.lightContext.lineTo(points[0].x, points[0].y);

            this.lightContext.lineTo(points[0].x + (points[0].x - this.lightingPos.x)*distance, points[0].y + (points[0].y - this.lightingPos.y)*distance);

            this.lightContext.lineTo(closest.x + (closest.x - this.lightingPos.x)*distance, closest.y + (closest.y - this.lightingPos.y)*distance);

            this.lightContext.lineTo(closest.x, closest.y)

            this.lightContext.fill()

            this.lightContext.moveTo(closest.x ,closest.y);

            this.lightContext.lineTo(points[1].x, points[1].y);

            this.lightContext.lineTo(points[1].x + (points[1].x - this.lightingPos.x)*distance, points[1].y + (points[1].y - this.lightingPos.y)*distance);

            this.lightContext.lineTo(closest.x + (closest.x - this.lightingPos.x)*distance, closest.y + (closest.y - this.lightingPos.y)*distance);

            this.lightContext.lineTo(closest.x, closest.y)
            
            this.lightContext.fill()

            this.lightContext.closePath()

            var x = obj.x - this.lightingPos.x;
            var y = obj.y - this.lightingPos.y;
        }
    }.bind(this));

    this.lightContext.globalCompositeOperation = oldBlendingMode;

    


    var oldBlendingMode = context.globalCompositeOperation;

    context.globalCompositeOperation = 'overlay';

    context.drawImage(this.lightCanvas, 0, 0, game.width, game.height);

    context.globalCompositeOperation = oldBlendingMode;
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


