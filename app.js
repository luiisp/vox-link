const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const settings = require("./settings.json");
const uuid = require("uuid");
const { validRoom } = require("./verifications");
const server = http.createServer(app);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const publicSettings =
  settings.publicSettings || console.error("No public settings found");
const privateSettings =
  settings.privateSettings || console.error("No private settings found");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/peerjs", peerServer);

const io = new Server(server);
const rooms = new Map();

app.get(`/room/:uuid`, (req, res) => {
  const room = rooms.get(req.params.uuid);
  if (!room) {
    res.status(404).render("room-not-found");
    return;
  }

  res.render("room", { room: room, roomID: req.params.uuid });
  return;
});

io.on("connection", (socket) => {
  console.log("Client Connected");

  socket.on("join-room", (roomId, userObj) => {
    console.log("Client joined room",userObj, roomId);
    if (!rooms.has(roomId)) {
      console.log("Room not found");
      return;
    }



    



    socket.join(roomId);
    io.to(socket.id).emit("room-credentials", rooms.get(roomId).roomUsers);
    rooms.get(roomId).roomUsers.push(userObj);
    socket.to(roomId).emit("user-connected", userObj);

    // socket.broadcast.to(roomId).emit("audioStream");
  });

  socket.on("disconnect", (roomId) => {
    console.log("Client disconnected",roomId);
    socket.to(roomId).emit("user-disconnected");
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/i/create-room", (req, res) => {
  const roomCredentials = req.body;
  let verifyRoomCredentials = validRoom(roomCredentials);
  if (!verifyRoomCredentials) {
    res.send(JSON.stringify({ error: "Invalid room credentials" }));
    return;
  }

  const roomSchema = {
    creator: roomCredentials.creatorName,
    roomName: roomCredentials.roomName,
    personRange: roomCredentials.personRange,
    roomUsers: [],
  };

  const roomId = "r-" + uuid.v4();
  rooms.set(roomId, roomSchema);

  res.send(
    JSON.stringify({
      info: "Room created successfully",
      roomId: roomId,
      roomPath: `/room/${roomId}`,
      creator: roomSchema.creator,
    })
  );
});

app.get("/create-room", (req, res) => {
  res.render("create", { settings: publicSettings });
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Running in *${port} -> http://localhost:${port}`);
});
