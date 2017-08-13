function loadFile(cb, ctx, file) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        var data = xmlhttp.responseText;
        cb.call(ctx, data);
    };

    xmlhttp.open("GET", file, true);
    xmlhttp.send();
}
