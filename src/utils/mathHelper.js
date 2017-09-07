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
        },
        getRandomNumber: function(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        overlaps: function(x1, y1, w1, h1, x2, y2, w2, h2) {
            var left = x2;
            var right = x2 + w2;
            var xOver = (left >= x1 && left <= x1 + w1) || (right >= x1 && right <= x1 + w1)
                || (left <= x1 && right >= x1) || (left <= x1 + w1 && right >= x1 + w1);

            var top = y2;
            var bottom = y2 + h2;
            var yOver = (top >= y1 && top <= y1 + h1) || (bottom >= y1 && bottom <= y1 + h1)
                || (top <= y1 && bottom >= y1) || (top <= y1 + h1 && bottom >= y1 + h1);

            return xOver && yOver;
        },
        contains: function(x, y, x2, y2, w2, h2) {
            return this.overlaps(x,y,0,0,x2,y2,w2,h2);
        },
        rectOverlaps: function(rect1, rect2) {
            return !((rect1.x + rect1.w < rect2.x) || (rect1.x > rect2.x + rect2.w) || (rect1.y + rect1.h < rect2.y) || (rect1.y > rect2.y + rect2.h));
        }
    }
})();
