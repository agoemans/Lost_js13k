function DungeonGenerator()
{
    this.WIDTH = 100;
    this.HEIGHT = 100;

    this.rooms = [];

    this.grid = [];
}

DungeonGenerator.prototype.createBaseGrid = function(width, height) {
    //first creates the num by num grid with random num of bombs
    // var index = 0;
    var outerList = [];
    for (var x = 0; x < width; x++) {
        var innerList = [];
        for (var y = 0; y < height; y++) {
            innerList.push('X');
        }
        outerList.push(innerList);
    }
    return outerList;
}

DungeonGenerator.prototype.generateRooms = function(width, height, grid, rooms)
{
    var roomCount = mathHelper.getRandomNumber(20, 40);


    for (var i = 0; i < roomCount; i++)
    {
        var room = this.createRoom(this.WIDTH, this.HEIGHT);

        if (this.roomOverlaps(room))
        {
            i--;
            continue;
        }

        rooms.push(room);

        for(var y = room.y; y < room.y + room.h; y++)
        {
            for(var x = room.x; x < room.x + room.w; x++)
            {
                if(x === room.x || x === room.x + room.w - 1 || y === room.y || y === room.y + room.h -1)
                {
                    grid[y][x] = 'Y';
                }
                else
                {
                    grid[y][x] = '_';
                }

            }
        }
    }

    rooms.forEach(function(room){

        var other = this.getClosestRoom(room, rooms);

        if(!other.doorsTo.contains(room))
        {
            this.createCorridor(room,other,grid);

            other.doorsTo.push(room);
            room.doorsTo.push(other);
        }

    }, this);
}

DungeonGenerator.prototype.getClosestRoom = function(room, rooms)
{
    var mid = {
        x: room.x + (room.w / 2),
        y: room.y + (room.h / 2)
    };

    var closest = null;
    var closest_distance = 1000;
    for (var i = 0; i < rooms.length; i++) {
        var check = rooms[i];
        if (check == room) continue;
        var check_mid = {
            x: check.x + (check.w / 2),
            y: check.y + (check.h / 2)
        };
        var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
        if (distance < closest_distance) {
            closest_distance = distance;
            closest = check;
        }
    }
    return closest;
}

DungeonGenerator.prototype.createRoom = function(gridWidth, gridHeight)
{
    var minSize = 4;

    var maxSize = 12;

    var room = {};

    room.x = mathHelper.getRandomNumber(1, gridWidth - maxSize - 1);
    room.y = mathHelper.getRandomNumber(1, gridHeight - maxSize - 1);
    room.w = mathHelper.getRandomNumber(minSize, maxSize);
    room.h = mathHelper.getRandomNumber(minSize, maxSize);

    room.doorsTo = [];

    return room;
}

DungeonGenerator.prototype.roomOverlaps = function(room)
{
    for(var i=0; i<this.rooms.length; i++)
    {
        if(mathHelper.rectOverlaps(room, this.rooms[i]))
        {
            return true;
        }
    }

    return false;
}

DungeonGenerator.prototype.createCorridor = function(roomA, roomB, grid)
{
    var pointA = {
        x: mathHelper.getRandomNumber(roomA.x+1, roomA.x + roomA.w-1),
        y: mathHelper.getRandomNumber(roomA.y+1, roomA.y + roomA.h-1),
    };

    var pointB = {
        x: mathHelper.getRandomNumber(roomB.x, roomB.x + roomB.w),
        y: mathHelper.getRandomNumber(roomB.y, roomB.y + roomB.h),
    };


    while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
        if (pointB.x != pointA.x) {
            if (pointB.x > pointA.x) pointB.x--;
            else pointB.x++;
        }
        else if (pointB.y != pointA.y) {
            if (pointB.y > pointA.y) pointB.y--;
            else pointB.y++;
        }

        if(grid[pointB.y][pointB.x] === 'Y')
        {
            grid[pointB.y][pointB.x] = 'H';
        }
        else
        {
            grid[pointB.y][pointB.x] = '_';
        }
    }
}

DungeonGenerator.prototype.create = function()
{
    return new Promise(function (resolve, reject) {

        this.grid = this.createBaseGrid(this.WIDTH, this.HEIGHT);

        this.rooms = [];

        this.generateRooms(this.WIDTH, this.height, this.grid, this.rooms);

        resolve({ grid: this.grid, rooms: this.rooms });
    }.bind(this));
}

ctor(DungeonGenerator);

var dungeonGenerator = new DungeonGenerator();
