function Menu() {
    State.call(this);
};

inherit(Menu, State);

Menu.prototype.enter = function () {

    game.canvas.style.backgroundColor = "#ffffff";
    game.audio.add('start', 1, [[2, , 0.18, , , 0.23, , , , , , , , , , , , , 1, , , 0.1, , 0.3]]);

    State.prototype.enter.call(this);
    var text = new Label(canvasWidth / 2 - 110, canvasHeight / 5, 120, "Trebuchet MS", "Lost");
    this.add(text);

    this.playButton = new Label(canvasWidth / 2 - 50, 3 * canvasHeight / 5, 60, "Trebuchet MS ", "Play");
    this.playButton.enableInput();

    loadFile(function (data) {
        game.levels = data.split('&');
        this.add(this.playButton);
    }, this, 'assets/level1.txt');

    this.playButton.onClick = function () {
        var levelStr = localStorage[game.keyName] || 1;
        var topLevel = parseInt(levelStr);

        game.audio.play('start');
        game.goto("game", {level: topLevel});
    };

    text = new Label(canvasWidth / 2 - 130, canvasHeight - 40, 20, "Trebuchet MS", "by David & Amy Goemans");
    this.add(text);
};

Menu.prototype.update = function (deltaSeconds) {
    State.prototype.update.call(this, deltaSeconds);
};

ctor(Menu);