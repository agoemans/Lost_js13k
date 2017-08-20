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

    canvas.width = width;
    canvas.height = height;

    canvas.style.marginLeft = (window.innerWidth - width)/2 + 'px';
    canvas.style.marginTop = (window.innerHeight - height)/2 + 'px';

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

    localContext.restore();

    context.setTransform(game.scale, 0, 0, game.scale, 0, 0);
    context.drawImage(localCanvas, 0, 0, canvasWidth, canvasHeight);



    if (drawFps) {
        context.fillStyle = "#000";
        context.fillRect(0, 0, 60, 15);
        context.fillStyle = "#fff";
        var fps = Math.floor(1 / deltaSeconds);

        context.font = "10px Roboto";
        context.fillText("FPS: " + fps, 10, 10);
    }


    requestAnimationFrame(update);

    then = now;
}
