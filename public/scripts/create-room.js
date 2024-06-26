const errorDiv = document.getElementById("error-bar");
const nameInput = document.getElementById("name");
const roomNameInput = document.getElementById("room-name");
const personRangeInput = document.getElementById("people-range");
const createRoomBtn = document.getElementById("create-room-btn");
const fields = document.getElementById("fields");
const orOptions = document.getElementById("or-options");
const numLegends = document.getElementById("num-legends");
const joinBtn = document.getElementById("join-room-btn");
const joinDiv = document.getElementById("join-room");
const popupBtnExit = document.getElementById("exit-join-room");
const entryRoomLink = document.getElementById("entry-room-link");

const joinUrlRoom = () => {
  const roomID = document.getElementById("join-room-id").value;
  if (roomID.length < 8) {
    return;
  }
  if (roomID.includes("/")) {
    window.location.href = `/room/${
      roomID.split("/")[roomID.split("/").length - 1]
    }`;
  } else {
    window.location.href = `/room/${roomID}`;
  }
};

const createLegend = (e) => {
  let span = document.createElement("span");
  span.textContent = e;
  span.style.textAlign = "center";
  numLegends.appendChild(span);
};

const syncSettings = () => {
  personRangeInput.min = 1;
  personRangeInput.max = personRangeNums.length;
  personRangeInput.value = personRangeNums.length / 2;

  personRangeNums.forEach((e) => {
    createLegend(e);
  });
};

const changeLoadingState = (state) => {
  if (state == true) {
    createRoomBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25"/><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg> Creating Room...';
    fields.classList.add("disabled");
    orOptions.classList.add("disabled");
    createRoomBtn.style.cursor = "not-allowed";
    createRoomBtn.style.pointerEvents = "none";
  } else {
    createRoomBtn.innerHTML = "Create Room";
    fields.classList.remove("disabled");
    orOptions.classList.remove("disabled");
    createRoomBtn.style.cursor = "pointer";
    createRoomBtn.style.pointerEvents = "all";
  }
};
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
const verifyRoomCredentials = () => {
  console.warn("Verifying room credentials");
  const name = nameInput.value;
  const roomName = roomNameInput.value;
  const personRange = personRangeNums[personRangeInput.value - 1];
  if (name === "" || roomName === "") {
    error("All fields are required");
    return;
  } else if (name.length < 3 || name.length > 20) {
    error("Name must be between 3 and 20 characters");
    return;
  } else if (roomName.length < 3 || roomName.length > 20) {
    error("Room Name must be between 3 and 20 characters");
    return;
  } else if (name == roomName) {
    error("Name and Room Name cannot be the same");
    return;
  } else if (personRange == undefined) {
    error("Invalid person range selected");
    return;
  }
  changeLoadingState(true);
  let room = {
    creatorName: name,
    roomName: roomName,
    personRange: personRange,
  };
  console.info("Room:", room);

  fetch("/i/create-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        console.error(data.error);
        error(data.error);
        changeLoadingState(false);
      } else {
        console.log(data.info);
        window.location.href = data.roomPath + "?fastentryuser=" + name;
      }
    })
    .catch((err) => {
      console.error(err);
      error("An error occurred, please try again");
      changeLoadingState(false);
    });
};

const openPopupJoin = () => {
  if (joinDiv.style.display == "none") {
    joinDiv.style.display = "";
  } else {
    joinDiv.style.display = "none";
  }
};

const joinRoom = () => {
  joinBtn.addEventListener("click", openPopupJoin);
  popupBtnExit.addEventListener("click", openPopupJoin);
};

document.addEventListener("DOMContentLoaded", () => {
  createRoomBtn.addEventListener("click", verifyRoomCredentials);
  entryRoomLink.addEventListener("click", joinUrlRoom);
  syncSettings();
  joinRoom();
});
