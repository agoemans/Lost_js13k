var trapGenerator = (function () {
    function create(playerRoom, rooms, tileSize){
        var trapList = [];
        var numOfRooms = Math.floor(rooms.length / 3);

        var minNum = (Level.instance.levelNumber == 1 ? 1 : (Level.instance.levelNumber * 4) - 3);
        var maxNum = Level.instance.levelNumber * 4;

        //create enemies
        for(var i = 0; i < numOfRooms; i++){
            // var index = mathHelper.getRandomNumber(0, rooms.length);
            // var roomObj = rooms[index];
            var roomObj = getRandomRoom(playerRoom, rooms);
            // var imgNum = mathHelper.getRandomNumber(minNum, maxNum);
            var trap = new Trap((roomObj.x * 2) * tileSize, (roomObj.y * 2) * tileSize);
            console.log('push to trap list', trap);
            trapList.push(trap);
        }

        return trapList;
    }

    function getRandomRoom(playerRoom, rooms) {
        var index = mathHelper.getRandomNumber(0, rooms.length);
        var room = rooms[index];
        while(room == playerRoom) {
            index = mathHelper.getRandomNumber(0, rooms.length);
            room = rooms[index];

            if(room != playerRoom) break;
        }

        return room;
    }

    return {
        placeTraps: function(playerRoom, rooms, tileSize) {
            return create(playerRoom, rooms, tileSize);

        }
    }

})();
