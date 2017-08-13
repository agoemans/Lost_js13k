var mobile = (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase()));

var then = Date.now();
var context = null;
var drawFps = true;

var canvasWidth = 800;
var canvasHeight = 896;

var localCanvas = null;
var localContext = null;