var mobile = (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase()));

var then = Date.now();
var context = null;
var drawFps = true;

var canvasWidth = 768;
var canvasHeight = 768;

var localCanvas = null;
var localContext = null;

var localStorage = window.localStorage || {};