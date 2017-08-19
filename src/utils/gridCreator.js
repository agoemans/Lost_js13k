var gridCreator = (function () {
    var outerArrLength = 12;
    var innerArrLength = 12;

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

    // function divideByTwoWalls(row, col, arr){
    //     console.log('row, col', row, col);
    //     return new Promise(function(resolve, reject){
    //         for (var r = 0; r < arr.length; r++){
    //             for (var c = 0; c < arr.length; c++){
    //                 if(c == col){
    //                     arr[r][c] = 'Y';
    //                 }
    //                 if(r == row){
    //                     console.log('this is the row', r, c, row);
    //                     arr[r][c] = 'Y';
    //                 }
    //             }
    //
    //         }
    //         resolve(arr);
    //         reject('Could not divide by two walls');
    //     })
    // }

    function divideByTwoWalls(calculatedList, arr) {
        return new Promise(function (resolve, reject) {
            for (var x = 0; x < calculatedList.length; x++) {
                var item = calculatedList[x];
                console.log('arr[item.r][item.c]', arr[item.r][item.c]);

                // arr[item.r][item.c] ='Y';

                for (var r = 0; r < arr.length; r++) {
                    for (var c = 0; c < arr.length; c++) {
                        if (c == item.c) {
                            arr[r][c] = 'Y';
                        }
                        if (r == item.r) {
                            // console.log('this is the row', r, c);
                            arr[r][c] = 'Y';
                        }
                    }

                }

            }
            resolve(arr);
            reject('Could not divide by two walls');
        })
    }

    function addVWall(minY, maxY, x, grid, hole) {
        var hole = getRandomNumber(minY, maxY);
        console.log('VWall', minY, maxY, x, 'hole = ', hole);

        for (var i = minY; i <= maxY; i++) {
            if (i == hole) {
                grid[i][x] = '_';
            }
            else {
                grid[i][x] = "W";
            }
        }
    }

    function addHWall(minX, maxX, y, grid, hole) {
        var hole = getRandomNumber(minX, maxX);
        console.log('HWall', minX, maxX, y, 'hole = ', hole);

        for (var i = minX; i <= maxX; i++) {
            if (i == hole) {
                grid[y][i] = '_';
            }
            else {
                grid[y][i] = "W";

            }
        }
    }

    function checkAllSides(grid, c, r) {

    }

    function subDivideArea(horizontal, minR, minC, maxR, maxC, grid) {
        var myHoriz = !horizontal;
        var x, y;

        if ((maxR - minR) > 3 && horizontal) {
            // y = getRandomNumber(minR + 1, maxR - 1);
            y = getRow(minR + 1, maxR - 1, grid);
            addHWall(minC, maxC, y, grid);

            //draw col
            subDivideArea(myHoriz, minR, minC, y-1, maxC, grid);

            //draw row
            subDivideArea(myHoriz, y+1, minC, maxR, maxC, grid);
        }

        if ((maxC - minC) > 3 && !horizontal) {
            // x = getRandomNumber(minC + 1, maxC - 1);
            x = getCol(minC + 1, maxC - 1, grid);
            addVWall(minR, maxR, x, grid);

            subDivideArea(myHoriz, minR, minC, maxR, x-1, grid);

            subDivideArea(myHoriz, minR, x+1, maxR, maxC, grid);
        }

    }

    function getRow(min, max, grid){
        var y = getRandomNumber(min, max);
        var minEnd = grid[y][min - 1];
        var maxEnd = grid[y][max + 1];
        console.log('minEnd, maxend', minEnd, maxEnd);
        while(minEnd == 'X' || maxEnd == 'X'){
            y = getRandomNumber(min, max);
            minEnd = grid[y][min - 1];
            maxEnd = grid[y][max + 1];
            // console.log('looping min max adn x', minEnd, maxEnd, x);
            // if(minEnd != 'X' && maxEnd != 'X'){
            //     break;
            // } else {
            //     y = getRandomNumber(min, max);
            //     minEnd = grid[y][min - 1];
            //     maxEnd = grid[y][max + 1];
            //     console.log('looping min max adn x', minEnd, maxEnd, x);
            // }
        }
        return y;
    }

    function getCol(min, max, grid){
        var x = getRandomNumber(min, max);
        var minEnd = grid[min - 1][x];
        var maxEnd = grid[max + 1][x];
        console.log('minEnd, maxend', minEnd, maxEnd);
        while(minEnd == 'X' || maxEnd == 'X'){
            x = getRandomNumber(min, max);
            minEnd = grid[min - 1][x];
            maxEnd = grid[max + 1][x];
            //console.log('looping min max and x', minEnd, maxEnd, x);
            // if(minEnd != 'X' && maxEnd != 'X'){
            //     break;
            // } else {
            //     x = getRandomNumber(min, max);
            //     minEnd = grid[min - 1][x];
            //     maxEnd = grid[max + 1][x];
            //     console.log('looping min max and x', minEnd, maxEnd, x);
            // }
        }
        return x;
    }

    function getBaseGrid(outerArr, innerArr) {
        return new Promise(function (resolve, reject) {
            var emptyBaseGrid = createBaseGrid(outerArr, innerArr);
            resolve(emptyBaseGrid);
            reject('Could not create base grid');
        })
    }

    function calculateGridWalls(arr) {
        return new Promise(function (resolve, reject) {

            subDivideArea(true, 0, 0, arr.length - 1, arr.length - 1, arr);
            //addInnerWall(true, 0, arr.length - 1, 0, arr.length - 1, 0, arr);

            resolve(arr);
            reject('Could not create base grid');
        })
    }

    function createFullMazeGrid(outerArr, innerArr) {
        //too refactor this to helper
        return new Promise(function (resolve, reject) {
            getBaseGrid(outerArr, innerArr).then(function (baseGrid) {
                calculateGridWalls(baseGrid).then(function (calculatedGrid) {
                    console.log('calculateGridWalls')
                    resolve(calculatedGrid);
                    reject('Could not create FullMazeGrid');
                });

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
            return createFullMazeGrid(15, 15);

        }
    }

})();