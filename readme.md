# Vox Link 🎙️🌌
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/luiisp/vox-link/blob/main/readme.en.md)
> Speak in English? [Access Readme.md in English](https://github.com/luiisp/vox-link/blob/main/readme.en.md)

Tag this project with a star 🌟

O Vox Link é uma plataforma de comunicação de voz em tempo real criada e idealizada por mim, na qual usuários podem se conectar em salas ou criar as suas próprias salas e conversar em tempo real por chamada de voz diretamente do navegador.

## Como é possivel estabelecer uma chamada em tempo real entre múltiplos usuários direto pelo navegador?

Tudo é feito utilizando WebRTC (Web Real-Time Communication), mas no nosso caso, especialmente feito com PeerJS, que facilita o desenvolvimento e é ótimo no nosso caso. A conexão que permite a comunicação entre os diferentes navegadores é P2P, e tudo que trafega é o stream de cada usuário. No entanto, como é de se imaginar, isso pode causar grandes problemas, pois utilizar conexão P2P descentraliza nossa aplicação, fazendo com que o servidor perca sua autonomia de controlar seus próprios clientes. Por isso, em paralelo, é importante ter um Servidor WebSocket para controlar os estados dos clientes, assim como sinalizar a estabilização de conexões e gerenciar o tráfego de outros dados, dando mais autonomia ao servidor e "centralizando" a conexão (vale lembrar que, apesar de tudo, ainda são duas conexões separadas e diferentes uma da outra). Um dos grandes desafios é manter o controle sobre o cliente nessas circunstâncias, pois ao estabelecer essa conexão P2P, o servidor não tem controle sobre os dados que trafegam entre os pares.
### Abaixo temos uma imagem de como funciona as conexões Peer to Peer + Web Sockets no VOX LINK
<img src="https://github.com/luiisp/vox-link/assets/115284250/5d1cd501-3827-4748-9e25-1b67c66bf2aa" width="450" height="auto" />

No caso do Vox Link, o stream que trafega é o áudio, mas poderia ser facilmente adicionado vídeo ou similar. Com a nossa aplicação seguindo o fluxo acima, garantimos mais controle sobre o usuário, mas é de se reconhecer que sim, é possível melhorar especialmente a segurança. Uma vez que, utilizando o fluxo acima, usuários podem transmitir livremente o que quiserem, então outras técnicas podem ser implementadas para dar mais autonomia ao servidor neste tipo de conexão. __Sinta-se livre para contribuir para o projeto__.

## Features 
* Criação de salas independentes
* Limitação de Usúarios por salas
* Verificação de Campos
* Comunicação por voz em tempo real
* Mutar Microfone / Sair de salas
* Auto-Exclusão de salas inativas (< 0 usuários)
* Opera totalmente em memória (nenhum banco de dados necessário)

### UI Screenshots

![image](https://github.com/luiisp/vox-link/assets/115284250/aec94189-e7e2-45cb-8cf7-c23bea27509b)
![image](https://github.com/luiisp/vox-link/assets/115284250/343b37fe-4c19-46fa-b239-d495775de3c3)
![image](https://github.com/luiisp/vox-link/assets/115284250/175824ec-be89-4f97-b17d-9a7f3ab5657a)
![image](https://github.com/luiisp/vox-link/assets/115284250/7df2bf1c-b3bf-4a68-b192-ba7e2e058cbe)



## Dependências 
* peer
* ejs
* express
* socket.io
* tailwindcss
* postcss
  

## Rodando 

* Clone este repo com ```git clone https://github.com/luiisp/vox-link```
* Entre no Diretório com ```cd vox-link```
* Instale as dependências necessárias usando ```npm install```
* Inicie o servidor de desenvolvimento com ```npm run dev```

Experimente Abrir em duas diferentes janelas ou em aparelhos diferentes.
> A conexão pode não ser estabelecida por navegadores em dispositivos móveis, como aparelhos celulares, pois eles exigem SSL.
![voxlink](https://github.com/luiisp/vox-link/assets/115284250/7654eefd-e619-4ea4-b898-96f25bfe240a)

  
