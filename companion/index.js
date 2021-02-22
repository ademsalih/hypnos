import * as messaging from "messaging";
import { WebSocketHandler } from "./WebSocketHandler";

const port = 8887;
const host = "127.0.0.1";

var websocket = new WebSocketHandler(host, port);

websocket.setOnMessage((message) => {
    console.log(`Android Server says: ${message}`)
})

websocket.setOnClose(() => {
    console.log("[WebSocketHandler] onClose()");
    messaging.peerSocket.send("DISCONNECT");
})

messaging.peerSocket.addEventListener("open", (evt) => {
    console.log("Ready to send or receive messages");
});

messaging.peerSocket.addEventListener("message", (evt) => {
    let message = evt.data
    let command = message.command;

    switch (command) {
        case "ADD_READING":
            websocket.send(JSON.stringify(message));
            break;
        case "SEARCH":
            console.log("Received new session request from Ionic...")
            websocket.setOnOpen(() => {
                messaging.peerSocket.send("CONNECT");

                console.log(`[Companion] Sent to Nyx: ${message.data}`)

                let data = message.data;
                websocket.send(JSON.stringify(data));
            })
            websocket.start();
            break;
        case "STOP_SEARCH":
            websocket.stop();
            break;
        case "INIT_SESSION":
            websocket.send(JSON.stringify(message));
            break;
        case "START_SESSION":
            websocket.send(JSON.stringify(message));
            break;
        case "STOP_SESSION":
            websocket.send(JSON.stringify(message));
            break;
        default:
            break;
    }
});