var gridCreator = (function () {

    function createBaseGrid(outerArr, innerArr) {
        //first creates the num by num grid with random num of bombs
        // var index = 0;
        var outerList = [];
        for (var x = 0; x < outerArr; x++) {
            var innerList = [];
            for (var y = 0; y < innerArr; y++) {
                innerList.push('Y');
            }
            outerList.push(innerList);
        }
        console.log('base grid', outerList);
        return outerList;
    }

    function generateRooms(sizeX, sizeY, map, rooms)
    {
        var room_count = mathHelper.getRandomNumber(50, 100);
        var min_size = 5;
        var max_size = 10;

        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = mathHelper.getRandomNumber(1, sizeX - max_size - 1);
            room.y = mathHelper.getRandomNumber(1, sizeY - max_size - 1);
            room.w = mathHelper.getRandomNumber(min_size, max_size);
            room.h = mathHelper.getRandomNumber(min_size, max_size);

            if (doesCollide(room, -1, rooms)) {
                i--;
                continue;
            }
            room.w--;
            room.h--;

            rooms.push(room);
        }

        //squashRooms(rooms);

        for (i = 0; i < room_count; i++) {
            var roomA = rooms[i];
            var roomB = findClosestRoom(roomA, rooms);
            pointA = {
                x: mathHelper.getRandomNumber(roomA.x, roomA.x + roomA.w),
                y: mathHelper.getRandomNumber(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: mathHelper.getRandomNumber(roomB.x, roomB.x + roomB.w),
                y: mathHelper.getRandomNumber(roomB.y, roomB.y + roomB.h)
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

                map[pointB.x][pointB.y] = '_';
            }
        }

        for (i = 0; i < room_count; i++) {
            var room = rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    map[x][y] = '_';
                }
            }
        }

        for (var x = 0; x < sizeX; x++) {
            for (var y = 0; y < sizeY; y++) {
                if (map[x][y] == '_') {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (map[xx][yy] == 'Y') map[xx][yy] = 'W';
                        }
                    }
                }
            }
        }
    }

    function findClosestRoom(room, rooms) {
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

    function squashRooms (rooms) {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < rooms.length; j++) {
                var room = rooms[j];
                while (true) {
                    var old_position = {
                        x: room.x,
                        y: room.y
                    };
                    if (room.x > 1) room.x--;
                    if (room.y > 1) room.y--;
                    if ((room.x == 1) && (room.y == 1)) break;
                    if (doesCollide(room, j, rooms)) {
                        room.x = old_position.x;
                        room.y = old_position.y;
                        break;
                    }
                }
            }
        }
    }

    function doesCollide (room, ignore, rooms) {
        for (var i = 0; i < rooms.length; i++) {
            if (i == ignore) continue;
            var check = rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }

        return false;
    }

    function createGrid(sizeX, sizeY) {
        //too refactor this to helper
        return new Promise(function (resolve, reject) {

            var grid = createBaseGrid(sizeX, sizeY);

            var rooms = [];

            generateRooms(sizeX, sizeY, grid, rooms);
            resolve(grid);
        });
    }

    return {
        grid: [],
        create: function () {
            return createGrid(100, 100);

        }
    }

})();
