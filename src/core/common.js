// Override for requestAnimationFrame so it works on all browsers

(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();


Math.sign = function (x) {
    return x ? x < 0 ? -1 : 1 : 0;
};


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

Array.prototype.clone = function () {
    return this.slice(0);
};

Math.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

Array.prototype.remove = function (object) {
    this.splice(this.indexOf(object), 1);
};

Array.prototype.contains = function (object) {
    return this.indexOf(object) !== -1;
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function ctor(func) {
    func.prototype.constructor = func;
}

function inherit(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.p = child.prototype;
}


function proto(cls) {
    return cls.prototype;
}
