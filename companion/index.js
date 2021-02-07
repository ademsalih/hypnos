import * as messaging from "messaging";
import { WebSocketHandler } from "./WebSocketHandler";

messaging.peerSocket.addEventListener("open", (evt) => {
    console.log("Ready to send or receive messages");
});

messaging.peerSocket.addEventListener("message", (evt) => {
    let message = JSON.stringify(evt.data);
    console.log(message);
});


const port = 8887;
const host = "127.0.0.1";

var websocket = new WebSocketHandler(host, port);

websocket.setOnMessage((message) => {
    console.log(`Android Server says: ${message}`)
})

websocket.start();
