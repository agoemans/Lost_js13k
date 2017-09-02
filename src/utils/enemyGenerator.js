var enemyGenerator = (function () {
    function create(rooms, tileSize){
        var enemyList = [];
        var numOfRooms = Math.floor(rooms.length / 2) + (Math.floor(rooms.length / 4));

        for(var i = 0; i < numOfRooms; i++){
            var index = mathHelper.getRandomNumber(0, rooms.length);
            var roomObj = rooms[index];
            var enemy = new Enemy((roomObj.x + roomObj.w / 2) * tileSize, (roomObj.y + roomObj.h / 2) * tileSize);
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
