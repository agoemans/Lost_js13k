var gridCreator = (function () {
    var outerArrLength = 12;
    var innerArrLength = 12;
    var minePositions = setMinePositions();

    function createBaseGrid(outerArr, innerArr) {
        //first creates the num by num grid with random num of bombs
        // var index = 0;
        var outerList = [];
        for (var x = 0; x < outerArr; x++) {
            var innerList = [];
            for (var y = 0; y < innerArr; y++) {
                var yValue = 0;
                // var randomX = getRandomNumber(12) | 2;
                // var randomY = getRandomNumber(12) | 2;
                // console.log(randomX, randomY);
                // if (randomY % 2 == 0 && randomX % 2 == 0 && index != limit) {
                //     //create b or mines at random points
                //     yValue = 'b';
                //     index++;
                // }

                innerList.push(yValue);

            }
            outerList.push(innerList);
        }
        console.log('base grid', outerList);
        return outerList;
    }

    function setMinePositions() {
        var smallList = [];
        var mainList = [];

        while(mainList.length < 8){
            while(smallList.length < 2){
                smallList.push(getRandomNumber(3, 3));
            }
            mainList.push(smallList);
            smallList = [];
        }

        return mainList;
    }

    function getGridWithMines(mineArray, baseGrid) {
        return new Promise(function(resolve, reject){
            for(var i = 0; i < mineArray.length; i++){
                var row = mineArray[i][0];
                var col = mineArray[i][1];

                if(baseGrid[row][col] !== 'b'){
                    baseGrid[row][col] = 'b';
                }

            }
            resolve(baseGrid);
            reject('Could not calculate mine positions');
        });
    }


    function calcMines(baseArray) {
        //calculates mines around a box
        for (var x = 0; x < baseArray.length; x++) {
            for (var y = 0; y < baseArray[x].length; y++) {
                if (baseArray[x][y] == 'b') {
                    updateAllDirections(baseArray, x, y);
                }

            }

        }

        return baseArray;
    }

    function updateTile(list, row, col) {
        if (row == -1 || col == -1) {
            return;
        }
        try {
            var tile = list[row][col];
            if (tile !== undefined && tile !== 'b') {
                tile++;
                list[row][col] = tile;
                //console.log('tile', tile);
            }

        } catch (e) {
            console.log('this is the row and col', row, col);
            console.log(e);
        }
    }

    //todo move this and related funct to separate one
    function updateAllDirections(list, row, col) {
        updateTile(list, row - 1, col - 1);
        updateTile(list, row - 1, col);
        updateTile(list, row - 1, col + 1);
        updateTile(list, row, col - 1);
        updateTile(list, row, col + 1);
        updateTile(list, row + 1, col - 1);
        updateTile(list, row + 1, col);
        updateTile(list, row + 1, col + 1);
    }

    function calculateMineProxmity(baseArray){
        return new Promise(function(resolve, reject){
            var arr = calcMines(baseArray);
            resolve(arr);
            reject('Could not calculate mines');
        })
    }

    function getBaseGrid(outerArr, innerArr){
        return new Promise(function(resolve, reject){
            var emptyBaseGrid = createBaseGrid(outerArr, innerArr);
            resolve(emptyBaseGrid);
            reject('Could not create base grid');
        })
    }

    function createFullMineGrid(outerArr, innerArr){
        //too refactor this to helper
        return new Promise(function(resolve, reject){
            getBaseGrid(outerArr, innerArr).then(function(baseGrid){
                getGridWithMines(minePositions, baseGrid).then(function(gridWithMines){
                    calculateMineProxmity(gridWithMines).then(function(gridWithCalculations){
                        resolve(gridWithCalculations);
                        reject('Could not create full grid');
                    });
                });

                // calculateMineProxmity(baseGrid).then(function(gridWithMines){
                //     resolve(gridWithMines);
                //     reject('Could not create full grid');
                // });
            });
        });
    }

    function getRandomNumber(min, max) {
        //todo move this to separate helper
        // var max = Math.floor(outerArrLength / 2);
        // var min = max - 2;
        return Math.floor(Math.random() * (max - min) + min);
    }

    return {
        grid: [],
        create: function () {
            return createFullMineGrid(12, 12);

        }
    }

})();