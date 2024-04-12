
const validRoom = (room) => {
    if (room.creatorName.length < 3 || room.creatorName.length > 20) {
        return false;
    }
    if (room.roomName.length < 3 || room.roomName.length > 20) {
        return false;
    }
    if (room.creatorName == room.roomName) {
        return false;
    }

    return true;


}

exports.validRoom = validRoom;