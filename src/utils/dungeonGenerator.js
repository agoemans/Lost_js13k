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
        var room = this.createRoom(width, height);

        if (this.roomOverlaps(room))
        {
            i--;
            continue;
        }

        rooms.push(room);

        var roomStartX = room.x-1;
        var roomStartY = room.y-1;
        var roomEndX = room.x+room.w+1;
        var roomEndY = room.y+room.h+1;

        for(var y = roomStartY; y < roomEndY+1; y++)
        {
            for(var x = roomStartX; x < roomEndX+1; x++)
            {
                if(x === roomStartX || x === roomEndX || y === roomStartY || y === roomEndY)
                {
                    room.wallTiles.push({x: x, y: y});

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

        for(var i=0; i<2; i++)
        {
            var other = this.getClosestRoomWithNoDoorsToMe(room, rooms);

            this.createCorridor(room,other,grid);

            other.doorsTo.push(room);

            room.doorsTo.push(other);
        }

    }, this);

    for (var y = 0; y < height; y++)
    {
        for (var x = 0; x < width; x++)
        {
            if (grid[y][x] === '_' || grid[y][x] === 'H')
            {
                for (var yy = y - 1; yy <= y + 1; yy++)
                {
                    for (var xx = x - 1; xx <= x + 1; xx++)
                    {
                        if (grid[yy][xx] === 'X')
                        {
                            grid[yy][xx] = 'Y';
                        }
                    }
                }
            }
        }
    }
}

DungeonGenerator.prototype.getClosestRoomWithNoDoorsToMe = function(room, rooms)
{
    var mid = {
        x: room.x + (room.w / 2),
        y: room.y + (room.h / 2)
    };

    var closest = null;
    var closest_distance = Infinity;
    for (var i = 0; i < rooms.length; i++) {
        var check = rooms[i];
        if (check == room || check.doorsTo.contains(room)) continue;
        var check_mid = {
            x: check.x + (check.w / 2),
            y: check.y + (check.h / 2)
        };
        var distance = (mid.x - check_mid.x)*(mid.x - check_mid.x) +
                        (mid.y - check_mid.y)*(mid.y - check_mid.y);

        if (distance < closest_distance)
        {
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

    room.x = mathHelper.getRandomNumber(1, gridWidth - maxSize - 2);
    room.y = mathHelper.getRandomNumber(1, gridHeight - maxSize - 2);
    room.w = mathHelper.getRandomNumber(minSize, maxSize);
    room.h = mathHelper.getRandomNumber(minSize, maxSize);

    room.doorsTo = [];

    room.wallTiles = [];

    return room;
}

DungeonGenerator.prototype.roomOverlaps = function(room)
{
    for(var i=0; i<this.rooms.length; i++)
    {
        // Room with padding
        var expandedRoom = { x: room.x - 3, y: room.y - 3, w: room.w + 6, h: room.h + 6 };
        if(mathHelper.rectOverlaps(expandedRoom, this.rooms[i]))
        {
            return true;
        }
    }

    return false;
}

DungeonGenerator.prototype.getClosestTiles = function(tiles, point)
{
    var closest = [];

    var closestDistanceSqr = Infinity;

    for(var i=0; i<tiles.length; i++)
    {
        var tile = tiles[i];
        var distanceSqr = mathHelper.distanceSqr(tile.x, tile.y, point.x, point.y);
        if(distanceSqr < closestDistanceSqr)
        {
            closestDistanceSqr = distanceSqr;
            closest = [tile];
        }
        else if(distanceSqr === closestDistanceSqr)
        {
            closest.push(tile);
        }
    }

    return closest;
}

DungeonGenerator.prototype.pathFind = function(startPosition, grid, target, path)
{
    if(startPosition.x === target.x && startPosition.y === target.y)
    {
        return true;
    }

    var left = {x:startPosition.x-1,y:startPosition.y};
    var right = {x:startPosition.x+1,y:startPosition.y};
    var bottom = {x:startPosition.x,y:startPosition.y-1};
    var top = {x:startPosition.x,y:startPosition.y+1};

    var tiles = [left,right,bottom,top];

    for(var i=0; i<tiles.length; i++)
    {
        var tile = tiles[i];

        if(!path.contains(tile))
        {
            var oldDist = mathHelper.distanceSqr(startPosition.x, startPosition.y, target.x, target.y);

            var dist = mathHelper.distanceSqr(tile.x, tile.y, target.x, target.y);

            if(grid[tile.y][tile.x] === 'Y' || grid[tile.y][tile.x] === 'H')
            {
                dist += 4;
            }

            if(grid[tile.y][tile.x] === '_')
            {
                dist += 0.5;
            }

            if(dist < oldDist)
            {
                path.push(tile);

                console.log(path, tiles);

                if(this.pathFind(tile, grid, target, path))
                {
                    return true;
                }
                else
                {
                    console.log('pop');

                    path.pop();

                    return false;
                }
            }
        }
    }

    return false;
}

DungeonGenerator.prototype.createCorridor = function(roomA, roomB, grid)
{
    var pointA = {
        x: mathHelper.getRandomNumber(roomA.x+1, roomA.x + roomA.w-2),
        y: mathHelper.getRandomNumber(roomA.y+1, roomA.y + roomA.h-2),
    };

    var pointB = {
        x: mathHelper.getRandomNumber(roomB.x + 1, roomB.x + roomB.w-2),
        y: mathHelper.getRandomNumber(roomB.y + 1, roomB.y + roomB.h-2),
    };

    var path = [];
    this.pathFind(pointA, grid, pointB, path);

    path.forEach(function(tile) {

        var foundA = false;

        var foundB = false;

        roomA.wallTiles.forEach(function(other){
            if(tile.x === other.x && tile.y === other.y)
            {
                foundA = true;
            }
        });

        roomB.wallTiles.forEach(function(other){
            if(tile.x === other.x && tile.y === other.y)
            {
                foundB = true;
            }
        });

        if(foundA || foundB)
        {
            grid[tile.y][tile.x] = 'H';
        }
        else
        {
            grid[tile.y][tile.x] = '_';
        }

    }, this);
}

DungeonGenerator.prototype.create = function()
{
    return new Promise(function (resolve, reject) {

        this.grid = this.createBaseGrid(this.WIDTH, this.HEIGHT);

        this.rooms = [];

        this.generateRooms(this.WIDTH, this.HEIGHT, this.grid, this.rooms);

        resolve({ grid: this.grid, rooms: this.rooms });
    }.bind(this));
}

ctor(DungeonGenerator);

var dungeonGenerator = new DungeonGenerator();
