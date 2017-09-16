function Goals() {
    this.goalList = [];
    this.onGoalsComplete = null;
}

Goals.prototype.create = function (result, tileSize, resources){
    var rooms = result.rooms;
    //goalList
    for(var i = 0; i < 3; i++){
        //todo randomize rooms
        var index = mathHelper.getRandomNumber(0, rooms.length);
        var roomObj = rooms[index];
        var goal = new Goal((roomObj.x + roomObj.w / 2) * tileSize, (roomObj.y + roomObj.h / 2) * tileSize, resources);
        goal.onGoalReached = this.updateList.bind(this);
        if(i == 0) goal.beaconOn = true;
        this.goalList.push(goal);
    };
};

Goals.prototype.update = function (deltaSeconds) {
    this.goalList.forEach(function (obj) {
        obj.update(deltaSeconds);
    });
};

Goals.prototype.render = function (context) {
    this.goalList.forEach(function (obj) {
        obj.render(context);
    });
};

Goals.prototype.updateList = function (item) {
    for(var i = 0; i < this.goalList.length; i++){
        if(this.goalList[i] == item) {
            this.goalList.splice(i, 1);
        }
    }

    if(this.goalList.length !== 0){
        this.goalList[0].beaconOn = true;
    }

    if(this.goalList.length == 0){
        this.onGoalsComplete(this);
    }

};

Goals.prototype.drawOnMap = function (context, miniMapTexture, miniMapScale, tileSize) {
    for(var i = 0; i < this.goalList.length; i++){
        // console.log('beacon', this.level.goals[i].beaconOn);
        if(this.goalList[i].beaconOn){
            var goalX = miniMapTexture.x + miniMapScale * this.goalList[i].x / tileSize;
            var goalY = miniMapTexture.y + miniMapScale * this.goalList[i].y / tileSize;
            this.goalList[i].drawOnMap(context, goalX, goalY, this.goalList[i].radiusOnMap);
        }

    }
};

Goals.prototype.removeAt = function () {

};
