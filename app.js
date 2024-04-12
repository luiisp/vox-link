const express = require('express');
const path = require('path');
const WebSocket = require('socket.io');
const http = require('http');
const app = express();
const settings = require('./settings.json');
const uuid = require('uuid');
const { validRoom } = require('./verifications');
const publicSettings = settings.publicSettings || console.error('No public settings found');
const privateSettings = settings.privateSettings || console.error('No private settings found');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const rooms = new Map();

const roomRouteAdd = (uuid,roomSchema) => {
    app.get(`/room/${uuid}`, (req, res) => {
        res.render('room', {room: roomSchema})
    });
    return true;
};
const roomRouteRemove = (uuid) => {
    let rPath = `/room/${uuid}`; 
    const routeIndex = app._router.stack.findIndex(layer => layer.route && layer.route.path === rPath);
    if (routeIndex === -1) {
        app._router.stack.splice(routeIndex, 1);
        return true;
    }
    console.error('Route not found');
    return false;
};


wss.on('connection', (ws) => {
    console.log('Client connected');


    ws.on('message', (message) => {
      console.log(` message: ${message}`);
      ws.send(message);
    });
  
    ws.on('close', () => {
      console.log(' disconnected');
    });
  });
  

app.get('/', (req, res) => {
    res.render('index'); 
});

app.post('/i/create-room', (req, res) => {
    const roomCredentials = req.body;
    let verifyRoomCredentials = validRoom(roomCredentials);
    if (!verifyRoomCredentials) {
        res.send(JSON.stringify({error: 'Invalid room credentials'}));
        return;
    }

    const roomSchema = {
        creator: roomCredentials.creatorName,
        roomName: roomCredentials.roomName,
        personRange: roomCredentials.personRange
    };

    const roomId = "r-" + uuid.v4();
    rooms.set(roomId, roomSchema);
    let addRoom = roomRouteAdd(roomId, roomSchema);

    if (!addRoom) {
        res.send(JSON.stringify({error: 'An error occurred in room creation, please try again'}));
        return;
    }



    res.send(JSON.stringify({
        info: 'Room created successfully',
        roomId: roomId,
        roomPath: `/room/${roomId}`,
        creator: roomSchema.creator,

    }));


});

app.get('/create-room', (req, res) => {
    res.render('create', {"settings":publicSettings}); 
});




const port = 3000;
server.listen(port, () => {
    console.log(`Running in *${port} -> http://localhost:${port}`);
});
