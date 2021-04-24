import * as messaging from "messaging";
import { WebSocketHandler } from "./WebSocketHandler";
import { inbox } from "file-transfer";
import * as cbor from "cbor";
import { localStorage } from "local-storage";
import { me as companion } from "companion";

companion.addEventListener("readystatechange", doThis);
function doThis() {
  console.log("Device application was launched!");
}

companion.addEventListener("unload", () => {
    console.log(`Close Reason: `)
    console.log("Sending DISCONENCT to Ionic...")
    messaging.peerSocket.send("DISCONNECT");
});

const port = 8887;
const host = "127.0.0.1";

var websocket = new WebSocketHandler(host, port);

var isBuffering = false;
var sessionInProgress = false;

localStorage.setItem("sessionBuffer", JSON.stringify({buffer:[]}));

websocket.setOnMessage((message) => {
    console.log(`Android Server says: ${message}`)
})

websocket.setOnClose(() => {
    console.log("[WebSocketHandler] onClose()");
    messaging.peerSocket.send("DISCONNECT");

    if (sessionInProgress) {
        isBuffering = true;
        messaging.peerSocket.send("START_BUFFERING");
        console.log("Buffering to local storage...")
    }
})

messaging.peerSocket.addEventListener("open", (evt) => {
    console.log("Ready to send or receive messages");
});


async function processAllFiles() {
    let file;
    while ((file = await inbox.pop())) {
        //const payload = await file.cbor();
        //console.log(`RECEIVED DATA: ${JSON.stringify(payload)}`)
    }
}

inbox.addEventListener("newfile", processAllFiles);
processAllFiles();

messaging.peerSocket.addEventListener("message", (evt) => {
    let message = cbor.decode(evt.data);
    let command = message.command;

    switch (command) {
        case "ADD_READING":
             if (!isBuffering) {
                websocket.send(JSON.stringify(message));
            } else {
                let sessionBuffer = JSON.parse(localStorage.getItem("sessionBuffer"));
                console.log(`BUFFERING, buffer size: ${sessionBuffer.buffer.length}, buffering element: ${JSON.stringify(message)}`);
                sessionBuffer.buffer.push(message);
                localStorage.setItem("sessionBuffer", JSON.stringify(sessionBuffer));
            }
            break;
        case "SEARCH":
            console.log("Received new session request from Ionic...")
            websocket.setOnOpen(() => {
                messaging.peerSocket.send("CONNECT");

                console.log(`sessionInProgress=${sessionInProgress}`)
                if (sessionInProgress) {
                    isBuffering = false;

                    let sessionBuffer = JSON.parse(localStorage.getItem("sessionBuffer"));
                    console.log(`Buffer size to send: ${sessionBuffer.buffer.length}`)
        
                    if (websocket.connectionOpen()) {
                        console.log(`Connection Open: ${websocket.connectionOpen()}`)
                        sessionBuffer.buffer.forEach(item => {
                            websocket.send(JSON.stringify(item));
                        });
                    }
                }
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
            sessionInProgress = true;
            websocket.send(JSON.stringify(message));
            break;
        case "STOP_SESSION":
            sessionInProgress = false;
            /* if (isBuffering) {
                let sessionBuffer = JSON.parse(localStorage.getItem("sessionBuffer"));

                if (websocket.connectionOpen()) {
                    sessionBuffer.buffer.forEach(item => {
                        websocket.send(JSON.stringify(item));
                    });

                    localStorage.setItem("sessionBuffer", JSON.stringify({buffer:[]}));
                }
                isBuffering = false;
            } */
            websocket.send(JSON.stringify(message));
            break;
        default:
            break;
    }
});
