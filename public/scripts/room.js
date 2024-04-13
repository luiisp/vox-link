let init = async () => {
    try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(localStream);
        const destination = audioContext.destination;
        source.connect(destination);

    } catch (error) {
        console.error(error);
    }
};

init();
