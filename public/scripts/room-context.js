const loadDiv = document.getElementById("loader");
const loadText = document.getElementById("loader-text");
const joinRoomBtn = document.getElementById("join-room-btn");
const displayName = document.getElementById("display-name");
const displayNameDiv = document.getElementById("display-name-div");
const errorDiv = document.getElementById("error-bar");
const infosDiv = document.getElementById("info-div");
const gridAUsers = document.getElementById("grid-a-users");
let myStream = null;

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

const spawnUserCard = (username) => {
  const userDiv = document.createElement("div");
  userDiv.classList.add(
    "user",
    "bg-[#080a10]",
    "rounded-xl",
    "py-10",
    "px-4",
    "sm:px-28",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "shadow-[#080a10]",
    "shadow-xl"
  );

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

function playAudio() {
  var audio = new Audio();
  audio.src = '/join.mp3';
  audio.play();
}


function handlerShowStream(stream, destroy = false) {
  console.log("Stream Received:", stream);
  playAudio();
  spawnUserCard(displayName.value);
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);

  call.on("stream", (userStream) => {
    handlerShowStream(userStream);
  });

  call.on("close", () => {
    console.log("User Disconnected:", userId);
  });

  peers[userId] = call;
}

const init = async () => {
  peers = {};
  myPeer = new Peer();
  var socket = io("/");
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      myStream = stream;
      infosDiv.style.display = "none";
      loading((text = "Detected Stream"), (load = false));
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
    socket.emit("join-room", roomID, id);
  });
  myPeer.on("disconnect", (id) => {
    console.log("Disconnect to Peer Server");
  });

  socket.on("connect", () => {
    console.log("Connected to Server");
  });

  socket.on("user-connected", (userID,userObj) => {
    console.log("New User Connected:", userID);
    connectToNewUser(userID, myStream);
  });

  socket.on("user-disconnected", (userId) => {
    if (peers[userId]) peers[userId].close();
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
  loading((text = "Connecting"), (load = true));
  init();
};

document.addEventListener("DOMContentLoaded", () => {
  joinRoomBtn.addEventListener("click", joinBtnVal);
});
