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

const a = "test";

app.get(`/room/:uuid`, (req, res) => {
    const room = rooms.get(req.params.uuid);
    if (!room){
        res.status(404).render('room-not-found');
        return;
    }
    console.log(room);
    const fakeSchema = {
        creator: 'Test',
        roomName: 'Test Room',
        personRange: '1-4'}

        res.render('room', {room: fakeSchema})
        return;


});


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
        personRange: roomCredentials.personRange,
        connectedUsers: []
    };

    const roomId = "r-" + uuid.v4();
    rooms.set(roomId, roomSchema);


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


app.use((req, res, next) => {
    res.status(404).render('404');
});

const port = 3000;
server.listen(port, () => {
    console.log(`Running in *${port} -> http://localhost:${port}`);
});
