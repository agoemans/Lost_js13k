var itemGenerator = (function () {
    function create(rooms, tileSize, resources){
        // item setlist: goals, hearts, teleports
        var itemSetList = [3, mathHelper.getRandomNumber(3, 6), mathHelper.getRandomNumber(2, 4)];

        for (var i = 0; i <= itemSetList.length; i++){
            for (var j = 0; j <= itemSetList[i]; j++){
                var index = mathHelper.getRandomNumber(0, rooms.length);
                var roomObj = rooms[index];
                var item = createItem(i, roomObj, tileSize, resources);
                if(item instanceof Teleport){
                    item.onActivate = Level.instance.teleportPlayer;
                }

                console.log(item);
                Level.instance.items.push(item);

            }

        }
        console.log(Level.instance.items);

    }

    function createItem(index, roomObj, tileSize, resources){
        var x = Math.floor((roomObj.x + roomObj.w / 2) * tileSize);
        var y = Math.floor((roomObj.y + roomObj.h / 2) * tileSize);

        var item, imgNum = 0;

        switch(index){
            case 0:
                item = Goal;
                imgNum = mathHelper.getRandomNumber(1, 4);
                break;
            case 1:
                item = HealthPickup;
                break;
            case 2:
                item = Teleport;
                break;

        }

        return new item(x, y, resources, imgNum);
    }

    return {
        placeItems: function (rooms, tileSize, resources) {
            create(rooms, tileSize, resources);

        }
    }

})();
