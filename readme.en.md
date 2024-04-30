# Vox Link 🎙️🌌
[![pt-br](https://img.shields.io/badge/lang-pt_br-yellow.svg)](https://github.com/luiisp/vox-link/blob/main/readme.md)

Tag this project with a star 🌟

Vox Link is a real-time voice communication platform created and conceptualized by me, where users can connect in rooms or create their own rooms and talk in real time through voice calls directly from the browser.

## How is it possible to establish a real-time call among multiple users directly through the browser?

Everything is done using WebRTC (Web Real-Time Communication), but in our case, it is particularly done with PeerJS, which facilitates development and is great for our purpose. The connection that allows communication between different browsers is P2P, and everything that travels is the stream of each user. However, as you might imagine, this can cause significant issues, as using a P2P connection decentralizes our application, causing the server to lose its autonomy over its own clients. Therefore, in parallel, it is important to have a WebSocket Server to control client states, as well as to signal the stabilization of connections and manage the traffic of other data, giving more autonomy to the server and "centralizing" the connection (it's worth noting that, despite everything, these are still two separate and distinct connections from each other). One of the biggest challenges is maintaining control over the client under these circumstances, as establishing this P2P connection means the server has no control over the data that travels between peers.
### Below we have an image of how the Peer to Peer + Web Sockets connections work in VOX LINK
<img src="https://github.com/luiisp/vox-link/assets/115284250/5d1cd501-3827-4748-9e25-1b67c66bf2aa" width="450" height="auto" />

In the case of Vox Link, the stream that travels is audio, but video or similar could easily be added. With our application following the above flow, we ensure more control over the user, but it is recognized that yes, it is possible to improve especially the security. Since, using the above flow, users can freely transmit whatever they want, then other techniques can be implemented to give more autonomy to the server in this type of connection. __Feel free to contribute to the project__.

## Features 
* Creation of independent rooms
* Limiting Users per room
* Field Verification
* Real-time voice communication
* Mute Microphone / Leave rooms
* Auto-Deletion of inactive rooms (< 0 users)
* Operates entirely in memory (no database needed)

### UI Screenshots

![image](https://github.com/luiisp/vox-link/assets/115284250/aec94189-e7e2-45cb-8cf7-c23bea27509b)
![image](https://github.com/luiisp/vox-link/assets/115284250/343b37fe-4c19-46fa-b239-d495775de3c3)
![image](https://github.com/luiisp/vox-link/assets/115284250/175824ec-be89-4f97-b17d-9a7f3ab5657a)
![image](https://github.com/luiisp/vox-link/assets/115284250/7df2bf1c-b3bf-4a68-b192-ba7e2e058cbe)

## Dependencies 
* peer
* ejs
* express
* socket.io
* tailwindcss
* postcss

## Running 

* Clone this repo with ```git clone https://github.com/luiisp/vox-link```
* Enter the directory with ```cd vox-link```
* Install the necessary dependencies using ```npm install```
* Start the development server with ```npm run dev```

Try opening in two different windows or on different devices.
> The connection may not be established by browsers on mobile devices, such as cell phones, as they require SSL.
![voxlink](https://github.com/luiisp/vox-link/assets/115284250/7654eefd-e619-4ea4-b898-96f25bfe240a)
