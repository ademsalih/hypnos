import * as messaging from "messaging";
import { WebSocketHandler } from "./WebSocketHandler";

const port = 8887;
const host = "127.0.0.1";

var websocket = new WebSocketHandler(host, port);

websocket.setOnMessage((message) => {
    console.log(`Android Server says: ${message}`)
})


messaging.peerSocket.addEventListener("open", (evt) => {
    console.log("Ready to send or receive messages");
});

messaging.peerSocket.addEventListener("message", (evt) => {
    let message = evt.data
    let command = message.command;

    switch (command) {
        case "SEARCH":
            console.log("Received new session request from Ionic...")
            websocket.setOnOpen(() => {
                messaging.peerSocket.send("CONNECT");
                websocket.send(message.data);
            })
            websocket.start();
            break;
        case "STOP_SEARCH":
            websocket.stop();
            break;
        default:
            break;
    }
});