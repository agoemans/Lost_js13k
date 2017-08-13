var gameOverHelper = (function() {
    var onFailCallback;
    var onFailCtx;

    return {
        register: function(failCB, failCtx){
            onFailCallback = failCB;
            onFailCtx = failCtx;
        },
        execute: function(){
            onFailCallback.call(onFailCtx);
        }
    }
})();