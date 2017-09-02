var enemyGenerator = (function () {
    function create(rooms, tileSize){
        var enemyList = [];
        var numOfRooms = Math.floor(rooms.length / 2) + (Math.floor(rooms.length / 4));

        var minNum = (Level.instance.levelNumber == 1 ? 1 : (Level.instance.levelNumber * 4) - 3);
        var maxNum = Level.instance.levelNumber * 4;

        for(var i = 0; i < numOfRooms; i++){
            var index = mathHelper.getRandomNumber(0, rooms.length);
            var roomObj = rooms[index];
            var imgNum = mathHelper.getRandomNumber(minNum, maxNum);
            console.log('enemy image number = ', imgNum);
            var enemy = new Enemy((roomObj.x + roomObj.w / 2) * tileSize, (roomObj.y + roomObj.h / 2) * tileSize, imgNum);
            enemyList.push(enemy);
        }

        return enemyList;
    }

    return {
        placeEnemies: function (rooms, tileSize) {
            return create(rooms, tileSize);

        }
    }

})();
