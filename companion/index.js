import * as messaging from "messaging";
import { WebSocketHandler } from "./WebSocketHandler";
import { inbox } from "file-transfer";
import * as cbor from "cbor";

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


////////////////////////////////////////////////////////////////////////////////////

async function processAllFiles() {
    let file;
    while ((file = await inbox.pop())) {
        const payload = await file.cbor();
        console.log(`ITEMS COUNT: ${payload.data.items.x.length}`)
    }
}


inbox.addEventListener("newfile", processAllFiles);

processAllFiles()
//////////////////////////////////////////

messaging.peerSocket.addEventListener("message", (evt) => {
    let message = cbor.decode(evt.data);
    let command = message.command;

    switch (command) {
        case "ADD_READING":
            websocket.send(JSON.stringify(message));
            break;
        case "SEARCH":
            console.log("Received new session request from Ionic...")
            websocket.setOnOpen(() => {
                messaging.peerSocket.send("CONNECT");
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


