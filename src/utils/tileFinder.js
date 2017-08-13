var tileFinder = (function () {
    var arrayWithNulls = [];
    function findNullNeighbors(tileObj, tileArray) {
        //calculates mines around a box
        // let arrayWithNulls = [];
        arrayWithNulls.push(tileObj);
        console.log('findNullNeighbors, original tile', tileObj.row, tileObj.col);
        console.log('arrayWithNulls in find null neighbros', arrayWithNulls);

        for (var i = 0; i < arrayWithNulls.length; i++) {
            updateAllDirections(tileObj.row, tileObj.col, tileArray);
        }

        // for (var x = 0; x < tileArray.length; x++) {
        //     for (var y = 0; y < tileArray[x].length; y++) {
        //         var tileObj = tileArray[x][y];
        //         if (tileObj instanceof BrickSprite && tileObj.nearbyBombs === 0){
        //             updateAllDirections(tileArray, x, y);
        //         }
        //
        //     }
        //
        // }
    }

    function updateTile(list, row, col) {
        if (row == -1 || col == -1) {
            return;
        }
        try {
            var tileObj = list[row][col];
            if (tileObj !== undefined && tileObj.visible && tileObj instanceof BrickSprite) {
                console.log('what is the tile,', tileObj.nearbyBombs);
                console.log('what is the tileObj,', tileObj.row, tileObj.col);

                if (tileObj.nearbyBombs === 0) {
                    arrayWithNulls.push([row, col]);
                    arrayWithNulls.shift();
                }
                tileObj.disableInput();
                tileObj.hide();
            }

        } catch (e) {
            console.log('this is the row and col', row, col);
            console.log(e);
        }
    }

    /**
     * * to do
     * look at logic in the notebook
     * add to list, loop, find reeal, add all your find
     * pop first, do again
     * *
     * **/
    
    //todo move this and related funct to separate one
    function updateAllDirections(row, col, list) {
        updateTile(list, row - 1, col - 1);
        updateTile(list, row - 1, col);
        updateTile(list, row - 1, col + 1);
        updateTile(list, row, col - 1);
        updateTile(list, row, col + 1);
        updateTile(list, row + 1, col - 1);
        updateTile(list, row + 1, col);
        updateTile(list, row + 1, col + 1);
    }

    return {
        tileArray: [],
        find: function (row, col, array) {
            console.log('this.arrayNulls', arrayWithNulls);
            return findNullNeighbors(row, col, array);
        }
    }

})();