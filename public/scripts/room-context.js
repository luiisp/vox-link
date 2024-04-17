const loadDiv = document.getElementById("loader");
const loadText = document.getElementById("loader-text");
const joinRoomBtn = document.getElementById("join-room-btn");
const displayName = document.getElementById("display-name");
const displayNameDiv = document.getElementById("display-name-div");
const errorDiv = document.getElementById("error-bar");
const infosDiv = document.getElementById("info-div");
const gridAUsers = document.getElementById("grid-a-users");
const muteBtn = document.getElementById("mute-btn");
let myStream = undefined;

const error = (errorMessage) => {
  errorDiv.classList.remove("slide-in-from-top", "slide-in-from-top-reverse");

  errorDiv.style.display = "block";
  errorDiv.textContent = errorMessage;
  errorDiv.classList.add("slide-in-from-top");
  console.error(errorMessage);

  setTimeout(() => {
    errorDiv.classList.remove("slide-in-from-top");
    errorDiv.classList.add("slide-in-from-top-reverse");
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 600);
  }, 2500);
};

const spawnUserCard = (username, id) => {
  const userDiv = document.createElement("div");
  userDiv.classList.add(
    "user",
    "bg-[#040508]",
    "rounded-lg",
    "py-10",
    "px-4",
    "sm:px-28",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "shadow-[#080a10]",
    "shadow-sm"
  );
  userDiv.id = `user-${id}`;

  const img = document.createElement("img");
  img.src = "/assets/img/default_user.jpeg";
  img.alt = `${username} Avatar`;
  img.classList.add("rounded-full", "w-20", "h-full", "mb-4");

  const usernameElement = document.createElement("h2");
  usernameElement.textContent = username;
  usernameElement.classList.add("text-2xl", "font-bold", "mb-2", "text-white");

  userDiv.appendChild(img);
  userDiv.appendChild(usernameElement);

  gridAUsers.appendChild(userDiv);
};

const loading = (text = null, load) => {
  if (load == true) {
    if (loadDiv.style.display == "none") {
      loadDiv.style.display = "";
    }
    loadText.innerText = text;
  } else {
    loadDiv.style.display = "none";
  }
};

function handlerShowStream(
  stream,
  userObj = undefined,
  audio = false
) {
  console.log("old conns:", oldConnUsers);
  console.log("Handler Show Stream:", stream);
  if (audio) {
    audio.srcObject = stream;
    audio.addEventListener("loadedmetadata", () => {
      audio.play();
    });
  }
  if (!userObj && oldConnUsers != {}) {
    console.log("dont have userObj");
    let streamId = stream.id;
    console.log("possible oldConnUsers:", oldConnUsers.streamId);
    userObj = oldConnUsers.find((user) => user.streamId == streamId);
  }
  spawnUserCard(
    userObj && userObj.username ? userObj.username : "You",
    stream.id
  );
}

function connectToNewUser(userObj, stream) {
  console.log("Try Connecting to New User:", userObj);
  const userId = userObj.id;
  let audio = document.createElement("audio");
  const call = myPeer.call(userId, stream);

  call.on("stream", (userStream) => {
    handlerShowStream(userStream, userObj, (audio = audio));
  });

  call.on("close", () => {
    console.log("User Disconnected:", userId);
  });

  peers[userId] = call;
}

const init = async () => {
  peers = {};
  oldConnUsers = [];
  myPeer = new Peer();
  socket = io("/");
  loading((text = "Try Get Stream"), (load = true));
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      myStream = stream;
      loading((text = "Connecting"), (load = true));
      handlerShowStream(myStream);
      myPeer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (userStream) => {
          handlerShowStream(userStream);
        });
      });
    });
  myPeer.on("open", (id) => {
    console.log("Connected to Peer Server");
    if (myStream) {
      console.log("i have stream");
    } else {
      console.log("i dont have stream");
    }
    userObj = {
      username: displayName.value,
      id: id,
      streamId: myStream.id,
    };
    loading((text = "Connected"), (load = false));
    playSound("join");
    infosDiv.style.display = "none";
    socket.emit("join-room", roomID, userObj);
  });
  myPeer.on("disconnect", (id) => {
    console.log("Disconnect to Peer Server");
    socket.emit("disconnect", roomID);
  });

  socket.on("room-credentials", (roomUsers) => {
    oldConnUsers = roomUsers;
  });

  socket.on("connect", () => {
    console.log("Connected to Server");
  });

  socket.on("room-full", (roomComp) => {
    error("Sorry, Room is Full");
    document.getElementById("full-div").style.display = "";
    document.getElementById("full-count").innerHTML = `${roomComp}`;
    infosDiv.style.display = "";
    socket.disconnect();
  });

  socket.on("user-connected", (userObj) => {
    console.log("New User Connected:", userObj)
    playSound("join");
    connectToNewUser(userObj, myStream);
  });

  socket.on("user-disconnected", (userObj) => {
    let pUser = document.getElementById(`user-${userObj.streamId}`)
    if (pUser) pUser.remove();
    if (peers[userObj.id]) peers[userObj.id].close();
    playSound("leave");
  });
};

const joinBtnVal = () => {
  if (displayName.value == "") {
    error("Display Name is required");
    return;
  } else if (displayName.value.length < 3 || displayName.value.length > 20) {
    error("Display Name must be between 3 and 20 characters");
    return;
  }
  joinRoomBtn.removeEventListener("click", joinBtnVal);
  displayNameDiv.style.display = "none";
  displayNameDiv.remove();
  addListeners();
  loading((text = "Connecting"), (load = true));
  document.getElementById("y-display-name").textContent = displayName.value;
  window.addEventListener("beforeunload", ExitRoom);
  init();
};

const ExitRoom = () => {
  socket.emit(
    "user-disconnect",
    {
      username: displayName.value,
      streamId: myStream.id,
      id: myPeer.id,
    },
    roomID
  );
  document.getElementById("exit-div").style.display = "";
  infosDiv.style.display = "";
};

const playSound = (type) => {
  const dirs = {
    join: "../assets/audio/join.mp3",
    leave: "../assets/audio/leave.mp3",
    mute: "../assets/audio/mute.mp3",
  };
  switch (type) {
    case "join":
      var audio = new Audio(dirs.join);
      audio.play();
      break;
    case "leave":
      var audio = new Audio(dirs.leave);
      audio.play();
      break;
    case "mute":
      var audio = new Audio(dirs.mute);
      audio.play();
      break;
  }
};

const muteUnmute = () => {
  const icons = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#080a10" fill-rule="evenodd" clip-rule="evenodd">
    <path d="M7.5 21c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-4.5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm8-12v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-4 2c0 2.209-1.791 4-4 4s-4-1.791-4-4v-7c0-2.209 1.791-4 4-4s4 1.791 4 4v7z"/>
    <path d="M2.5 1.5 L21.5 18.5" stroke="#080a10" stroke-width="3.5" /> 
</svg>`,
    `
<svg xmlns="http://www.w3.org/2000/svg" fill="#080a10" width="24" height="24" fill-rule="evenodd" clip-rule="evenodd"><path d="M7.5 21c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-4.5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm8-12v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-4 2c0 2.209-1.791 4-4 4s-4-1.791-4-4v-7c0-2.209 1.791-4 4-4s4 1.791 4 4v7z"/></svg>
`,
  ];
  const enabled = myStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myStream.getAudioTracks()[0].enabled = false;
    muteBtn.innerHTML = icons[0];
  } else {
    myStream.getAudioTracks()[0].enabled = true;
    muteBtn.innerHTML = icons[1];
  }
  playSound("mute");
};

function addListeners() {
  muteBtn.addEventListener("click", muteUnmute);
  document.getElementById("exit-btn").addEventListener("click", ExitRoom);
}

document.addEventListener("DOMContentLoaded", () => {
  joinRoomBtn.addEventListener("click", joinBtnVal);
});
