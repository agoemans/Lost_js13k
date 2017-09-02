var itemGenerator = (function () {
    function create(rooms, tileSize, resources){
        var itemList = [];
        var numOfRooms = Math.floor(rooms.length / 2) + (Math.floor(rooms.length / 4));

        var index;
        var roomObj;

        // item setlist: goals, hearts, teleports
        var itemSetList = [3, mathHelper.getRandomNumber(3, 6), mathHelper.getRandomNumber(2, 4)];

        for (var i = 0; i <= itemSetList.length; i++){
            var index = mathHelper.getRandomNumber(0, rooms.length);
            var roomObj = rooms[index];

            for (var j = 0; j <= itemSetList[i]; j++){
                var item = createItem(i, roomObj, tileSize, resources);
                console.log('items creator', item);
                if(item instanceof Teleport){
                    item.onActivate = Level.instance.teleportPlayer;
                }
                Level.instance.enemies.push(item);

            }

        }

        console.log('items creator', Level.instance.enemies);

        // for (var i = 0; i < 3; i++){
        //     var index = mathHelper.getRandomNumber(0, rooms.length);
        //     var roomObj = rooms[index];
        //     var teleport = new Teleport(roomObj.x + 25, roomObj.y + 15, this.level.resources);
        //     teleport.onActivate = this.level.teleportPlayer;
        //     this.level.enemies.push(teleport);
        // }
        //
        // for(var i = 0; i < 3; i++){
        //     index = mathHelper.getRandomNumber(0, rooms.length);
        //     roomObj = rooms[index];
        //     console.log('goal up created');
        //     var goal = new Goal((roomObj.x + 10) * tileSize, (roomObj.y + 10) * tileSize, resources);
        //     itemList.push(goal);
        // }
        //
        // return itemList;
    }

    function createItem(index, roomObj, tileSize, resources){
        var x = (roomObj.x + roomObj.w / 2) * tileSize;
        var y = (roomObj.y + roomObj.h / 2) * tileSize;

        var item;

        switch(index){
            case 0:
                item = Goal;
                break;
            case 1:
                item = HealthPickup;
                break;
            case 2:
                item = Teleport;
                break;

        }

        return new item(x, y, resources);
    }

    return {
        placeItems: function (rooms, tileSize, resources) {
            create(rooms, tileSize, resources);

        }
    }

})();
