var goalCreator = (function () {
    //todo delete
    function create(rooms, tileSize){
        var goalList = [];

        //create goals
        for(var i = 1; i < 4; i++){
            var roomObj = rooms[i];
            var goal = new Goal((roomObj.x + roomObj.w / 2) * tileSize, (roomObj.y + roomObj.h / 2) * tileSize);
            goalList.push(goal);
        }

        return goalList;
    }

    return {
        createGoals: function (rooms, tileSize, resources) {
            return create(rooms, tileSize, resources);

        }
    }

})();
