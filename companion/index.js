import * as messaging from "messaging";
import { WebSocketHandler } from "./WebSocketHandler";
import { inbox } from "file-transfer";
import * as cbor from "cbor";
import { localStorage } from "local-storage";
import { me as companion } from "companion";
import { app } from "peer";
import { createReading } from "./createReading";
import { SENSOR_DEFINITIONS } from "../common/sensorDefinitions";

/* app.addEventListener("readystatechange", () => {
    console.log("Hypnos closed on Ionic...")
    console.log("Yielding...")
    companion.yield();
}); */

companion.wakeInterval = 5 * 1000 * 61

const port = 8887;
const host = "127.0.0.1";

var websocket = new WebSocketHandler(host, port);

var isBuffering = false;
var sessionInProgress = false;

localStorage.setItem("sessionBuffer", JSON.stringify({buffer:[]}));

let uuid = localStorage.getItem("sessionUUID");
console.log(`UUID on launch: ${uuid}`);

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

let config = SENSOR_DEFINITIONS;

async function processAllFiles() {
    let file;
    while ((file = await inbox.pop())) {
        const payload = await file.arrayBuffer();

        let bytes = new Float64Array(payload);

        let sensor = ((file.name).split('.'))[0];

        const sensorElement = (config.filter(i => i.sensor == sensor))[0];

        let typeCount = sensorElement.typeCount + 1;

        let types = sensorElement.types;

        let times = (file.length)/(8*typeCount);

        let data = [[]]
        types.forEach(i => data.push([]))

        for (let i = 0; i < times; i++) {
            for (let k = 0; k < typeCount; k++) {
                let base = typeCount * i + k;

                let dataPoint = bytes[base];

                let a = data[k];
                a.push(dataPoint);
            }
        }

        let reading = createReading(uuid, sensor, types, data);

        if (!isBuffering) {
            websocket.send(JSON.stringify(reading));
        } else {
            let sessionBuffer = JSON.parse(localStorage.getItem("sessionBuffer"));
            sessionBuffer.buffer.push(reading);
            localStorage.setItem("sessionBuffer", JSON.stringify(sessionBuffer));
        }
    }
}

inbox.addEventListener("newfile", processAllFiles);
processAllFiles();

messaging.peerSocket.addEventListener("message", (evt) => {
    let message = cbor.decode(evt.data);
    let command = message.command;

    switch (command) {
        case "START_SEARCH":
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
                } else {
                    websocket.send(JSON.stringify(message));
                }
            })
            websocket.start();
            break;
        case "STOP_SEARCH":
            websocket.stop();
            break;
        case "INIT_SESSION":
            uuid = message.payload.sessionIdentifier;
            localStorage.setItem("sessionUUID", message.payload.sessionIdentifier);
            
            console.log(`UUID on INIT_SESSION: ${uuid}`);

            websocket.send(JSON.stringify(message));
            break;
        case "START_SESSION":
            sessionInProgress = true;
            websocket.send(JSON.stringify(message));
            break;
        case "STOP_SESSION":
            sessionInProgress = false;
            websocket.send(JSON.stringify(message));
            break;
        default:
            break;
    }
});
