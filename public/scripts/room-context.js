const loadDiv = document.getElementById('loader');
const loadText = document.getElementById('loader-text');
const joinRoomBtn = document.getElementById('join-room-btn');
const displayName = document.getElementById('display-name');
const displayNameDiv = document.getElementById('display-name-div');
const errorDiv = document.getElementById('error-bar');


const error = (errorMessage) => {
  errorDiv.classList.remove('slide-in-from-top', 'slide-in-from-top-reverse');

  errorDiv.style.display = 'block';
  errorDiv.textContent = errorMessage;
  errorDiv.classList.add('slide-in-from-top');
  console.error(errorMessage);

  setTimeout(() => {
      errorDiv.classList.remove('slide-in-from-top');
      errorDiv.classList.add('slide-in-from-top-reverse');
      setTimeout(() => {
          errorDiv.style.display = 'none';
      }, 600);
  }, 2500); 
};


const loading = (text=null,load) => {
  if (load == true)
  {

    if (loadDiv.style.display == 'none'){
      loadDiv.style.display = '';
    }
    loadText.innerText = text;
  }
  else
  {
    loadDiv.style.display = 'none';
  }

};



const init = async () => {
  var socket = io();
  socket.on('connect', () => {
    console.log('Connected to server');

  });
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
  
  const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(localStream);
  pc = new RTCPeerConnection();
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  pc.onicecandidate = event => {
  if (event.candidate) {
      socket.emit('icecandidate', event.candidate);
    }
  };



  socket.on('audioStream', (audioData) => {
    const receivedAudio = new Audio(audioData);
    receivedAudio.play();
  });


  

}

  



const joinBtnVal = () => {


  if (displayName.value == ''){
    error('Display Name is required');
    return;
  }else if (displayName.value.length < 3 || displayName.value.length > 20){
    error('Display Name must be between 3 and 20 characters');
    return;
  }
  joinRoomBtn.removeEventListener('click', joinBtnVal);
  displayNameDiv.style.display = 'none';
  displayNameDiv.remove();
  loading(text='Connecting',load=true);
  init();


};


document.addEventListener('DOMContentLoaded', () =>{
  joinRoomBtn.addEventListener('click', joinBtnVal);
});
