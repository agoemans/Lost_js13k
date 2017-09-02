/**
 * Created by David on 15-Aug-15.
 */
var game = (function () {
    var module = {};
    module.states = {};
    module.activeState = null;
    module.overlay = null;
    module.scale = 1;
    module.width = 0;
    module.height = 0;
    module.canvas = null;
    module.levels = [];
    module.keyName = "js13adg_currentLevel";
    module.onMouseUpCallback = null;

    module.initGame = function (w, h, scale, canvas) {
        module.scale = scale;
        module.canvas = canvas;
        module.width = w;
        module.height = h;
        module.audio = new AudioPlayer();
        module.addState("menu", new Menu());
        module.addState("game", new Game());
        module.addState("pp", new Popup());
        module.goto("menu");
    };

    module.addState = function(name, state) {
        module.states[name] = state;
    }

    module.updateGame = function (deltaSeconds) {
        module.activeState.update(deltaSeconds);

        if (module.overlay)
            module.overlay.update(deltaSeconds);
    };

    module.renderGame = function (context) {
        module.activeState.render(context);

        if (module.overlay)
            module.overlay.render(context);
    };

    module.goto = function (state, config) {
        if(module.overlay !== null){
            module.overlay.leave();
            module.overlay = null;
        }

        if (module.activeState) module.activeState.leave();
        module.activeState = module.states[state];
        module.activeState.enter(config);
    };

    module.popup = function (config) {
        module.overlay = module.states['pp'];
        module.overlay.enter(config);
    };

    module.mouseUp = function (x, y) {
        if (module.overlay && !module.overlay.permanent) {
            setTimeout(function(){
                game.audio.play('start');
                module.overlay.leave();
                module.overlay = null;
            }, 1000);
        } else
            module.activeState.mouseUp(x, y);
    };

    module.mouseDown = function (x, y) {
        if (!module.overlay)
            module.activeState.mouseDown(x, y);
    };

    module.mouseMove = function (x, y) {
        if (!module.overlay)
            module.activeState.mouseMove(x, y);
    };

    module.keyDown = function (key) {
        if (!module.overlay)
            module.activeState.keyDown(key);
    };

    module.keyUp = function (key) {
        if (module.overlay && !module.overlay.permanent) {
            module.overlay.leave();
            module.overlay = null;
        }
        else
            module.activeState.keyUp(key);
    };

    return module;
}());
