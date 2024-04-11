const startRoomBtn = document.getElementById('start-room');
const joinBtn = document.getElementById('join-room-btn');
const joinDiv = document.getElementById('join-room');
const popupBtnExit = document.getElementById('exit-join-room');


const openPopupJoin = () =>{
    if (joinDiv.style.display == 'none'){
        joinDiv.style.display = '';}
    else{
        joinDiv.style.display = 'none';
    }

}


document.addEventListener('DOMContentLoaded',()=>{  


    startRoomBtn.addEventListener('click', ()=>{
        window.location.href = '/create-room';
    });
    joinBtn.addEventListener('click', openPopupJoin);
    popupBtnExit.addEventListener('click', openPopupJoin);




});