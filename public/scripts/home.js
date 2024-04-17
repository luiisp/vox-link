const startRoomBtn = document.getElementById("start-room");
const joinBtn = document.getElementById("join-room-btn");
const joinDiv = document.getElementById("join-room");
const popupBtnExit = document.getElementById("exit-join-room");
const entryRoomLink = document.getElementById("entry-room-link");

const openPopupJoin = () => {
  if (joinDiv.style.display == "none") {
    joinDiv.style.display = "";
  } else {
    joinDiv.style.display = "none";
  }
};

const joinRoom = () => {
  const roomID = document.getElementById("join-room-id").value;
  if (roomID.length < 8) {
    return;
  }
  if (roomID.includes('/')){
    window.location.href = `/room/${roomID.split('/')[roomID.split('/').length-1]}`;
  }else{
    window.location.href = `/room/${roomID}`;
  }
  
};

document.addEventListener("DOMContentLoaded", () => {
  startRoomBtn.addEventListener("click", () => {
    window.location.href = "/create-room";
  });
  joinBtn.addEventListener("click", openPopupJoin);
  popupBtnExit.addEventListener("click", openPopupJoin);
  entryRoomLink.addEventListener("click", joinRoom);
});


