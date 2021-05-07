import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view';
import { getUUID } from '../../lib/uuid';

import * as cbor from "cbor";
import { me as device } from "device";
import * as messaging from "messaging";

import * as fs from "fs";
import DispatchManager from '../../lib/DispatchManager';
import { SensorManager } from '../../lib/SensorManager';

const $ = $at( '#recordView' );

export class RecordView extends View {

    el = $();

    batchLimit = 40;

    running = false;
    connected = false;

    eventCount;
    sessionUUID;

    sensorManager;
    dispatchManager = new DispatchManager();

    sensorFiles = {};
    
    onMount(props){
        console.log("[RecordView] onMount()");
        if (props) this.connected = props.connected;
        
        const sessionControlButton = $('#sessionControlButton');
        sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        this.sensorManager = new SensorManager((sensor, data) => {
            this.readingHandler(sensor, data);
        });

        this.eventCount = 0;
        this.sessionUUID = getUUID();

        let enabledSensors = this.sensorManager.getEnabledSensors();

        enabledSensors.forEach((e) => {
            this.sensorFiles[e.name] = {
                counter: this.batchLimit + 1,
                fileName: `${e.name}.${Date.now()}`
            }
        });

        console.log(JSON.stringify(this.sensorFiles))

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            let data = cbor.encode({
                command: "INIT_SESSION",
                payload: {
                    sessionIdentifier: this.sessionUUID,
                    deviceModel: device.modelName,
                    activeSensors: enabledSensors
                }
            })
            messaging.peerSocket.send(data);
        }
    }

    appendToFile(fileName, buffer) {
        let file = fs.openSync(fileName, "a+");
        fs.writeSync(file, buffer);
        fs.closeSync(file);
    }

    readingHandler(sensor, values) {
        console.log("readingHandler")
        let now = Date.now();
        console.log(JSON.stringify(values))

        let n = (values[0]).length;
        let count = values.length;

        let buffer = new ArrayBuffer(8 * count * n);
        let bytes = new Float64Array(buffer);
        values[0] = this.adjustTimestamp(values[0], now);
        
        for (let i = 0; i < n; i++) {
            for (let k = 0; k < count; k++) {
                let b = count * i + k;
                bytes[b] = values[k][i];
            }
        }

        let file = this.sensorFiles[sensor];

        if (file.counter > this.batchLimit) {
            this.dispatchManager.addToQueue(file.fileName);
            file.fileName = `${sensor}.${Date.now()}`
            file.counter = 0;
        }
        this.appendToFile(file.fileName, buffer);
        file.counter += 1;

        this.eventCount += n;
    }

    adjustTimestamp(timestamps, reference) {
        let ts = [];
        let i = timestamps.length - 1;
        let j = i;
        let lastTs = timestamps[i];
        do { ts.push(reference - lastTs + timestamps[j-i]) } while(i--);
        return ts;
    }

    /**
     * This method in invoked when the Start Session button
     * is pressed and controls the sensors accordingly. 
     */
    startSessionButtonHandler = () => {
        let time = Date.now();

        if (this.running) {
            this.sensorManager.stopAllSensors();
            this.dispatchManager.stop();
            this.running = false;

            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "STOP_SESSION",
                    payload: {
                        sessionIdentifier: this.sessionUUID,
                        endTime: time,
                        readingsCount: this.eventCount
                    }
                });
                
                messaging.peerSocket.send(data);
            }

            Application.switchToWithState('Summary', this.eventCount);
        } else {
            console.log("[RecordView] Sending START_SESSION...")
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "START_SESSION",
                    payload: {
                        sessionIdentifier: this.sessionUUID,
                        startTime: time
                    }
                });
                messaging.peerSocket.send(data);
            }
            
            this.sensorManager.startAllSensors();
            this.dispatchManager.start();
            this.running = true;
        }
        this.render();
    }

    onUnmount(){
        console.log("[RecordView] onUnmount()")

        const sessionMixedText = $('#sessionMixedText');
        const sessionMixedTextHeader = sessionMixedText.getElementById("header");
        sessionMixedTextHeader.text = "New Session";
        sessionMixedTextHeader.style.fill = "fb-blue"

        const sessionMixedTextCopy = sessionMixedText.getElementById("copy");
        sessionMixedTextCopy.text = "Press the button below to start a new session.";

        const sessionControlButton = $('#sessionControlButton');
        sessionControlButton.removeEventListener("click", this.startSessionButtonHandler);
        sessionControlButton.style.fill = "fb-blue"
    
        const sessionControlButtonText = sessionControlButton.getElementById("text");
        sessionControlButtonText.text = "Start Session"
    }

    onKeyBack(e) {
        e.preventDefault();
        if (!this.running) {
            Application.switchTo('Main');
        }
    }

    onPropChange(props) {
        this.connected = props.connected;
        if (!this.connected && !this.running) {
            Application.switchTo('Main');
        } else {
            this.render();
        }
    }

    onRender() {
        if (this.running) {
            const sessionMixedText = $('#sessionMixedText');
            const sessionMixedTextHeader = sessionMixedText.getElementById("header");
            if (this.connected) {
                sessionMixedTextHeader.text = "Recording...";
                sessionMixedTextHeader.style.fill = "fb-red"
                
                const sessionMixedTextCopy = sessionMixedText.getElementById("copy");
                sessionMixedTextCopy.text = "Press the button below to stop recording.";

                const sessionControlButton = $('#sessionControlButton');
                sessionControlButton.style.fill = "fb-red"
            
                const sessionControlButtonText = sessionControlButton.getElementById("text");
                sessionControlButtonText.text = "End Session"
            } else {
                sessionMixedTextHeader.text = "Buffering...";
                sessionMixedTextHeader.style.fill = "fb-red"
            }
        }
    }

}