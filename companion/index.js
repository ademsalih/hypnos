import * as messaging from "messaging";
import { WebSocketHandler } from "./WebSocketHandler";
import { inbox } from "file-transfer";
import * as cbor from "cbor";
import { localStorage } from "local-storage";
import { me as companion } from "companion";
import { app } from "peer";
import { createReading } from "./createReading";

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

let config = [
    {
        sensorName: "ACCELEROMETER",
        typeCount: 3,
        types: [
            'X',
            'Y',
            'Z'
        ]
    },
    {
        sensorName: "GYROSCOPE",
        typeCount: 3,
        types: [
            'X',
            'Y',
            'Z'
        ]
    },
    {
        sensorName: "BAROMETER",
        typeCount: 1,
        types: [
            'PASCAL'
        ]
    },
    {
        sensorName: "HEARTRATE",
        typeCount: 1,
        types: [
            'BPM'
        ]
    }
]

async function processAllFiles() {
    let file;
    while ((file = await inbox.pop())) {
        const payload = await file.arrayBuffer();

        let bytes = new Float64Array(payload);

        let fileSize = file.length;

        let fileName = file.name;

        let sensor = (fileName.split('.'))[0];

        const sensorElement = (config.filter( i => i.sensorName == sensor))[0];

        //console.log(`sensorElement: ${JSON.stringify(sensorElement)}`)

        let typeCount = sensorElement.typeCount + 1;
        //console.log(`typeCount: ${typeCount}`)

        let types = sensorElement.types;
        //console.log(`types: ${types}`)

        let times = fileSize/(8*typeCount);
        //console.log(`times: ${times}`)

        let data = [[]]
        types.forEach(i => data.push([]))

        //console.log(`data: ${JSON.stringify(data)}`)

        for (let i = 0; i < times; i++) {
            for (let k = 0; k < typeCount; k++) {
                let base = typeCount * i + k;

                let dataPoint = bytes[base];

                let a = data[k];
                a.push(dataPoint);
            }
        }

        //console.log(`data after: ${JSON.stringify(data)}`)

        let reading = createReading(types, data.slice(1, typeCount));

        let toSend = {
            command: "ADD_READING",
            payload: {
                sessionIdentifier: uuid,
                sensorIdentifier: sensor,
                timestamps: data[0],
                data: reading
            }
        }

        if (!isBuffering) {
            websocket.send(JSON.stringify(toSend));
        } else {
            let sessionBuffer = JSON.parse(localStorage.getItem("sessionBuffer"));
            console.log(`BUFFERING, buffer size: ${sessionBuffer.buffer.length}, buffering element: ${JSON.stringify(toSend)}`);
            sessionBuffer.buffer.push(toSend);
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
