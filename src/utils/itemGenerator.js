var itemGenerator = (function () {
    function create(rooms, tileSize, resources){
        var itemList = [];
        var numOfRooms = Math.floor(rooms.length / 2) + (Math.floor(rooms.length / 4));

        var index;
        var roomObj;

        // for(var i = 0; i < 3; i++){
        //     index = mathHelper.getRandomNumber(0, rooms.length);
        //     roomObj = rooms[index];
        //     console.log('heart pick up created');
        //     var heart = new HealthPickup((roomObj.x + 10) * tileSize, (roomObj.y + 10) * tileSize, resources);
        //     itemList.push(heart);
        // }

        for(var i = 0; i < 3; i++){
            index = mathHelper.getRandomNumber(0, rooms.length);
            roomObj = rooms[index];
            console.log('goal up created');
            var goal = new Goal((roomObj.x + 10) * tileSize, (roomObj.y + 10) * tileSize, resources);
            itemList.push(goal);
        }

        return itemList;
    }

    return {
        placeItems: function (rooms, tileSize, resources) {
            return create(rooms, tileSize, resources);

        }
    }

})();
