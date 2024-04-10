const errorDiv = document.getElementById('error-bar');
const nameInput = document.getElementById('name');
const roomNameInput = document.getElementById('room-name');
const personRangeInput = document.getElementById('people-range');
const createRoomBtn = document.getElementById('create-room-btn');

personRangeInput.addEventListener("input", () => {
    let value = this.value;
    let percentage = (value - this.min) / (this.max - this.min) * 100;
    document.querySelector(".bg-sky-500").style.width = percentage + "%";
});


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


const verifyRoomCredentials = () => {
    console.warn('Verifying room credentials');
    const name = nameInput.value;
    const roomName = roomNameInput.value;
    const personRange = personRangeInput.value;
    if(name === '' || roomName === ''){
        error('All fields are required');
        return;
    }

    
  

}
createRoomBtn.addEventListener('click', verifyRoomCredentials)
