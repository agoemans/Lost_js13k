function LightLayer(level) {

    this.lightingPos = { x: 0, y: 0 }

    this.level = level

    this.gradient = null;

    this.lightCanvas = document.createElement('canvas');
    
    this.lightCanvas.width = game.width;
    
    this.lightCanvas.height = game.height;

    this.lightContext = this.lightCanvas.getContext('2d');
};

ctor(LightLayer);

LightLayer.prototype.setLightSource = function(x,y) {
    this.lightingPos.x = x;
    this.lightingPos.y = y;
}

LightLayer.prototype.render = function(context) {

    var oldBlendingMode = this.lightContext.globalCompositeOperation;

    this.lightContext.fillStyle = '#999999';

    this.lightContext.fillRect(0, 0, game.width,game.height);

    this.lightContext.fillStyle = '#ffffff';

    this.lightContext.beginPath()

    for(var i=1;i<=10;i++)
    {
        this.lightContext.globalAlpha = 1/i;

        var sizeVar = 20;

        var minSize = 50;

        var size = minSize + sizeVar * i;

        var originalSize = minSize + sizeVar * (i-1)

        this.lightContext.arc(this.lightingPos.x, this.lightingPos.y, size, 0, Math.PI * 2)

        //this.lightContext.fillRect(this.lightingPos.x - size/2,this.lightingPos.y - originalSize/2,size,originalSize);

        //this.lightContext.fillRect(this.lightingPos.x - originalSize/2,this.lightingPos.y - size/2,originalSize,size);

        this.lightContext.fill()
    }

    this.lightContext.closePath()

    this.lightContext.fillStyle = '#555555';

    this.lightContext.globalAlpha = 1;

    var attenuation = 50;

    this.level.renderList.forEach(function (obj) {
        if(obj instanceof BrickSprite && obj.visible){

            var points = obj.getPoints();

            var closest = this.getClosestPoint(points, this.lightingPos);

            var distanceSqr = mathHelper.distanceSqr(closest.x, closest.y, this.lightingPos.x, this.lightingPos.y);

            if(distanceSqr > attenuation*attenuation)
            {
                //this.lightContext.fillRect(obj.x,obj.y,obj.width,obj.height);

                //return;
            }

            points.remove(closest);
            
            var furthest = this.getFurthestPoint(points, this.lightingPos);

            points.remove(furthest);

            //points = this.getBestPoints(points, this.lightingPos)

            if(!points)
            {
                return
            }

            this.lightContext.beginPath();
            
            var distance = 500;

            this.lightContext.moveTo(closest.x ,closest.y);

            this.lightContext.lineTo(points[0].x, points[0].y);

            this.lightContext.lineTo(points[0].x + (points[0].x - this.lightingPos.x)*distance, points[0].y + (points[0].y - this.lightingPos.y)*distance);

            this.lightContext.lineTo(points[1].x + (points[1].x - this.lightingPos.x)*distance, points[1].y + (points[1].y - this.lightingPos.y)*distance);

            this.lightContext.lineTo(points[1].x, points[1].y);

            //this.lightContext.lineTo(closest.x, closest.y)

            //this.lightContext.lineTo(points[0].x, points[0].y);

            this.lightContext.fill()

            this.lightContext.closePath()

            //this.lightContext.fillRect(obj.x,obj.y,obj.width,obj.height);

            var x = obj.x - this.lightingPos.x;
            var y = obj.y - this.lightingPos.y;
        }
    }.bind(this));

    this.lightContext.globalCompositeOperation = oldBlendingMode;

    


    var oldBlendingMode = context.globalCompositeOperation;

    context.globalCompositeOperation = 'overlay';

    context.globalAlpha = 0.5;

    context.drawImage(this.lightCanvas, 0, 0, game.width, game.height);

    context.globalCompositeOperation = oldBlendingMode;
}

LightLayer.prototype.getBestPoints = function(points, source)
{
    var points = points;

    var closest = this.getClosestPoint(points, this.lightingPos);

    points.remove(closest);

    var furthest = this.getFurthestPoint(points, this.lightingPos);

    points.remove(furthest);

    var closestMag = mathHelper.distance(closest.x, closest.y, source.x, source.y);

    var closestP1Dot = mathHelper.dot(closest.x - source.x, closest.y - source.y, points[0].x - source.x, points[0].y - source.y);

    var p1Mag = mathHelper.distance(points[0].x, points[0].y, source.x, source.y);

    var closestP2Dot = mathHelper.dot(closest.x - source.x, closest.y - source.y, points[1].x - source.x, points[1].y - source.y);

    var p2Mag = mathHelper.distance(points[1].x, points[1].y, source.x, source.y);

    var p1P2Dot = mathHelper.dot(points[0].x - source.x, points[0].y - source.y, points[1].x - source.x, points[1].y - source.y);

    /*var p1P2 = Math.acos(p1P2Dot/(p1Mag*p2Mag));

    var closestP1 = Math.acos(closestP1Dot/(closestMag*p1Mag));

    var closestP2 = Math.acos(closestP2Dot/(closestMag*p2Mag));

    //console.log('Angles', p1P2, closestP1, closestP2, ' - ', p1P2Dot/(p1Mag*p2Mag), closestP1Dot/(closestMag*p1Mag), closestP2Dot/(closestMag*p2Mag))
    */

    if(p1P2Dot > closestP1Dot && p1P2Dot > closestP2Dot)
    {
        //console.log('WIDE')
        return [points[0], points[1]]
    }
    else if(closestP1Dot < closestP2Dot)
    {
        //console.log('P2')
        return [closest, points[1]]
    }
    else if(closestP2Dot < closestP1Dot)
    {
        //console.log('P1')
        return [closest, points[0]]
    }
    else 
    {
        console.log('THE FUCK')
        return null
    }

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


