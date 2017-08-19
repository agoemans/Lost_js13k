var goalHelper = (function () {
    function assignGoals(tileArray) {
        var subArrays = [1, 2, 3, 4];
        for(var i = 0; i < 4; i++){
            var index = getRandomNumber(0, subArrays.length);
            var goalSections = getSectionPos(subArrays[index], tileArray.length, tileArray[0].length);

            subArrays.splice(index, 1);
            var rowNum = getRandomNumber(goalSections.rMin, goalSections.rMax);
            var colNum = getRandomNumber(goalSections.cMin, goalSections.cMax);
            tileArray[colNum][rowNum] = 'G';
            console.log('goalSections', colNum, rowNum);
        }

    }

    function getSectionPos(num, colLength, rowLength) {
        var minMaxPos;
        switch(num){
            case 1:
                minMaxPos = {
                  rMin: 0,
                  rMax: rowLength / 2,
                  cMin: 0,
                  cMax: colLength / 2
                };
                break;
            case 2:
                minMaxPos = {
                    rMin: 0,
                    rMax: rowLength / 2,
                    cMin: colLength / 2,
                    cMax: colLength - 1
                };
                break;
            case 3:
                minMaxPos = {
                    rMin: rowLength / 2,
                    rMax: rowLength - 1,
                    cMin: 0,
                    cMax: colLength / 2
                };
                break;
            case 4:
                minMaxPos = {
                    rMin: rowLength / 2,
                    rMax: rowLength - 1,
                    cMin: colLength / 2,
                    cMax: colLength - 1
                };
                break;
        }
        return minMaxPos;

    }

    //todo move to central
    function getRandomNumber(min, max) {
        //todo move this to separate helper
        return Math.floor(Math.random() * (max - min) + min);
    }

    return {
        setGoalsInArray: function (array) {
            assignGoals(array);
        }
    }

})();