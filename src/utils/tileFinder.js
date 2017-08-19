var tileFinder = (function () {
    var arrayWithNulls = [];
    function findNullNeighbors(row, col, tileArray) {
        arrayWithNulls.push([row, col]);

        for (var i = 0; i < arrayWithNulls.length; i++) {
            updateAllDirections(arrayWithNulls[i][0], arrayWithNulls[i][1], tileArray);
        }
    }

    function updateTile(list, row, col) {
        if (row == -1 || col == -1) {
            return;
        }
        try {
            var tileObj = list[row][col];
            if (tileObj !== undefined && tileObj.visible) {
                if (tileObj.nearbyBombs === 0) {
                    arrayWithNulls.push([row, col]);
                    arrayWithNulls.shift();
                }
                tileObj.disableInput();
                tileObj.hide();
            }

        } catch (e) {
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
        find: function (col, row, array) {
            console.log('this.arrayNulls', arrayWithNulls);
            return findNullNeighbors(row, col, array);
        }
    }

})();