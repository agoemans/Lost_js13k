var mathHelper = (function() {
    return {
        distanceSqr: function(x1,y1,x2,y2){
            return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)
        },
        distance: function(x1,y1,x2,y2){
            return Math.sqrt(mathHelper.distanceSqr(x1,y1,x2,y2))
        },
        dot: function(x1,y1,x2,y2){
            return x1*x2 + y1*y1;
        }
    }
})();