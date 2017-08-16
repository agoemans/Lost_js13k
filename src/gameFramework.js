// Required functions to implementation
// function initGame(canvasWidth, canvasHeight)
// function updateGame(deltaSeconds)
// function renderGame(context)
// function mouseMove(x,y)

var width = 768;
var height = 768;

window.onload = function () {
    var canvas = document.getElementById("game");

    canvasWidth = width / height * canvasHeight;

    var scale = width / canvasHeight;

    context = canvas.getContext("2d");

    context.canvas.width = width;
    context.canvas.height = height;

    localCanvas = document.createElement('canvas');
    localCanvas.width = canvasWidth;
    localCanvas.height = canvasHeight;
    localContext = localCanvas.getContext('2d');

    game.initGame(canvasWidth, canvasHeight, scale, canvas);

    requestAnimationFrame(update);

    document.addEventListener("keydown", function (event) {
        game.keyDown(event.keyCode || event.which)
    }, false);

    document.addEventListener("keyup", function (event) {
        game.keyUp(event.keyCode || event.which)
    }, false);

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        game.mouseMove(mousePos.x / game.scale, mousePos.y / game.scale);
    }, false);

    canvas.addEventListener('mousedown', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        game.mouseDown(mousePos.x / game.scale, mousePos.y / game.scale);
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        game.mouseUp(mousePos.x / game.scale, mousePos.y / game.scale);
    }, false);

};

function update() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    localContext.save();

    localContext.clearRect(0, 0, canvasWidth, canvasHeight);

    var now = Date.now();
    var delta = Math.min(1000, now - then); // Worst case = 1fps
    var deltaSeconds = delta / 1000;

    game.updateGame(deltaSeconds);
    game.renderGame(localContext);

    if (drawFps) {
        localContext.fillStyle = "#000";
        localContext.fillRect(0, 0, 60, 15);
        localContext.fillStyle = "#fff";
        var fps = Math.floor(1 / deltaSeconds);

        localContext.font = "10px Roboto";
        localContext.fillText("FPS: " + fps, 10, 10);
    }

    localContext.restore();

    context.setTransform(game.scale, 0, 0, game.scale, 0, 0);
    context.drawImage(localCanvas, 0, 0, canvasWidth, canvasHeight);
    requestAnimationFrame(update);

    then = now;
}