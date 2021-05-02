import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view';
import { getUUID } from '../../lib/uuid';

import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";
import { Battery } from '../../sensor/sensors/Battery';
import { Gyroscope } from "gyroscope";
import { Barometer } from "barometer";

import PreferencesManager from '../../lib/PreferenceManager';

import * as cbor from "cbor";
import { me as device } from "device";
import * as messaging from "messaging";
import { outbox } from "file-transfer";

import { memory } from "system";
import { Memory } from '../../sensor/sensors/MemorySensor';

import * as fs from "fs";
import DispatchManager from '../../lib/DispatchManager';

const $ = $at( '#recordView' );

export class RecordView extends View {

    el = $();

    running = false;
    connected = false;

    eventCount;
    sessionUUID;

    acc = new Accelerometer();
    baro = new Barometer();
    gyro = new Gyroscope();
    hrm = new HeartRateSensor();
    // batt = new Battery();
    //mem = new Memory();

    dispatchManager = new DispatchManager();

    sessionMixedText = $('#sessionMixedText');
    sessionMixedTextCopy = this.sessionMixedText.getElementById("copy");

    /** These should be joined in some kind of variable **/

    sensorFiles = {
        "ACCELEROMETER": {
            counter: 0,
            fileName: `ACCELEROMETER.${Date.now()}`
        },
        "GYROSCOPE": {
            counter: 0,
            fileName: `GYROSCOPE.${Date.now()}`
        },
        "BAROMETER": {
            counter: 0,
            fileName: `BAROMETER.${Date.now()}`
        },
        "HEARTRATE": {
            counter: 0,
            fileName: `HEARTRATE.${Date.now()}`
        }
    }


    /*****************************************************/
    
    onMount(props){
        console.log("[RecordView] onMount()");
        if (props) this.connected = props.connected;
        
        const prefManager = new PreferencesManager();

        const accF = prefManager.getSensorFrequencyFor("ACCELEROMETER");
        this.acc.setOptions({ frequency: 20, batch: 40 });

        const baroF = prefManager.getSensorFrequencyFor("BAROMETER");
        this.baro.setOptions({ frequency: 20, batch: 40 });

        const gyroF = prefManager.getSensorFrequencyFor("GYROSCOPE")
        this.gyro.setOptions({ frequency: 20, batch: 40 });

        const hrmF = prefManager.getSensorFrequencyFor("HEARTRATE");
        this.hrm.setOptions({ frequency: 1, batch: 2 });

        /* const memF = prefManager.getSensorFrequencyFor("MEMORY");
        this.mem.setOptions({ frequency: 1, batch: 20 }) */

        /* const battF = prefManager.getSensorFrequencyFor("BATTERY");
        this.batt.setOptions({ frequency: battF.frequency })*/

        const sessionControlButton = $('#sessionControlButton');
        sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        this.eventCount = 0;
        this.sessionUUID = getUUID();

        this.acc.onreading = this.accelerometerEventHandler.bind(this);
        this.gyro.onreading = this.gyroscopeEventHandler.bind(this);
        this.baro.onreading = this.barometerEventHandler.bind(this);
        this.hrm.onreading = this.heartRateEventHandler.bind(this);
        //this.batt.onreading = this.batteryEventHandler.bind(this);
        //this.mem.onreading = this.memoryEventHandler.bind(this);
        
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            let data = cbor.encode({
                command: "INIT_SESSION",
                payload: {
                    sessionIdentifier: this.sessionUUID,
                    deviceModel: device.modelName,
                    activeSensors: [
                        {
                            "name": "ACCELEROMETER",
                            "frequency": accF.frequency
                        },
                        {
                            "name": "GYROSCOPE",
                            "frequency": gyroF.frequency
                        },
                        {
                            "name": "HEARTRATE",
                            "frequency": hrmF.frequency
                        },
                        {
                            "name": "BAROMETER",
                            "frequency": baroF.frequency
                        }/* ,
                        {
                            "name": "BATTERY",
                            "frequency": battF.frequency
                        },
                        {
                            "name": "MEMORY",
                            "frequency": memF.frequency
                        } */
                    ]
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
        let now = Date.now();
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

        // Do this based on sensor parameter:
        let elmo = this.sensorFiles[sensor];

        if (elmo.counter > 8) {
            this.dispatchManager.addToQueue(elmo.fileName);
            elmo.fileName = `${sensor}.${Date.now()}`
            elmo.counter = 0;
        }
        this.appendToFile(elmo.fileName, buffer);
        elmo.counter += 1;
        /////////////////////////////////////

        this.eventCount += n;
    }

    accelerometerEventHandler() {
        this.readingHandler("ACCELEROMETER", [
            this.acc.readings.timestamp,
            this.acc.readings.x,
            this.acc.readings.y,
            this.acc.readings.z
        ])
    }

    /* accelerometerEventHandler() {
        let now = Date.now();
        let n = this.acc.readings.timestamp.length;
        let count = 4;
        let size = 8;

        let total = size * count * n;
        
        let buffer = new ArrayBuffer(total);
        let bytes = new Float64Array(buffer);

        let ts = this.adjustTimestamp(this.acc.readings.timestamp, now);
        
        for (let i = 0; i < n; i++) {
            let b = count * i;
            bytes[b + 0] = ts[i];
            bytes[b + 1] = this.acc.readings.x[i];
            bytes[b + 2] = this.acc.readings.y[i];
            bytes[b + 3] = this.acc.readings.z[i];
        }

        if (this.accCounter > 8) {
            this.dispatchManager.addToQueue(this.accFilename);
            this.accFilename = `ACCELEROMETER.${Date.now()}`
            this.accCounter = 0;
        }

        this.appendToFile(this.accFilename, buffer);
        
        this.accCounter+=1;
        this.eventCount += n;
    } */

    gyroscopeEventHandler() {
        let now = Date.now();
        let n = this.gyro.readings.timestamp.length;
        let count = 4;
        let size = 8;

        let total = size * count * n;
        
        let buffer = new ArrayBuffer(total);
        let bytes = new Float64Array(buffer);
        
        let ts = this.adjustTimestamp(this.gyro.readings.timestamp, now);
        for (let i = 0; i < n; i++) {
            let base = count * i;
            bytes[base + 0] = ts[i];
            bytes[base + 1] = this.gyro.readings.x[i];
            bytes[base + 2] = this.gyro.readings.y[i];
            bytes[base + 3] = this.gyro.readings.z[i];
        }

        if (this.gyroCounter > 8) {
            this.dispatchManager.addToQueue(this.gyroFilename);
            this.gyroFilename = `GYROSCOPE.${Date.now()}`
            this.gyroCounter = 0;
        }

        this.appendToFile(this.gyroFilename, buffer);
        
        this.gyroCounter+=1;
        this.eventCount += n;
    }

    barometerEventHandler() {
        let now = Date.now();
        let n = this.baro.readings.timestamp.length;
        let count = 2;
        let size = 8;

        let total = size * count * n;
        
        let buffer = new ArrayBuffer(total);
        let bytes = new Float64Array(buffer);
        
        let ts = this.adjustTimestamp(this.baro.readings.timestamp, now);

        for (let i = 0; i < n; i++) {
            let base = count * i;
            bytes[base + 0] = ts[i];
            bytes[base + 1] = this.baro.readings.pressure[i];
        }

        if (this.baroCounter > 8) {
            this.dispatchManager.addToQueue(this.baroFilename);
            this.baroFilename = `BAROMETER.${Date.now()}`
            this.baroCounter = 0;
        }

        this.appendToFile(this.baroFilename, buffer);
        
        this.baroCounter+=1;
        this.eventCount += n;
    }

    heartRateEventHandler() {
        let now = Date.now();
        let n = this.hrm.readings.timestamp.length;
        let count = 2;
        let size = 8;

        let total = size * count * n;
        
        let buffer = new ArrayBuffer(total);
        let bytes = new Float64Array(buffer);
        
        let ts = this.adjustTimestamp(this.hrm.readings.timestamp, now);

        for (let i = 0; i < n; i++) {
            let base = count * i;
            bytes[base + 0] = ts[i];
            bytes[base + 1] = this.hrm.readings.heartRate[i];
        }

        if (this.hrmCounter > 20) {
            this.dispatchManager.addToQueue(this.hrmFilename);
            this.hrmFilename = `HEARTRATE.${Date.now()}`
            this.hrmCounter = 0;
        }

        this.appendToFile(this.hrmFilename, buffer);
        
        this.hrmCounter+=1;
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

    onUnmount(){
        console.log("[RecordView] onUnmount()")
        this.acc.onreading = null;
        this.gyro.onreading = null; 
        this.baro.onreading = null;
        this.hrm.onreading = null;

        //this.batt.onreading = null;
        //this.mem.onreading = null;

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

    /**
     * This method in invoked when the Start Session button
     * is pressed and controls the sensors accordingly. 
     */
    startSessionButtonHandler = () => {
        let time = Date.now();

        if (this.running) {
            this.acc.stop();
            this.gyro.stop();
            this.baro.stop();
            this.hrm.stop();
            //this.batt.stop();
            //this.mem.stop();

            this.running = false;

            this.dispatchManager.addToQueue(this.accFilename);
            this.dispatchManager.addToQueue(this.gyroFilename);
            this.dispatchManager.addToQueue(this.baroFilename);
            this.dispatchManager.addToQueue(this.hrmFilename);

            this.dispatchManager.stop();

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
            
            this.acc.start();
            this.gyro.start();
            this.baro.start();
            this.hrm.start();
            //this.batt.start();
            //this.mem.start();

            this.dispatchManager.start();

            this.running = true;
        }
        this.render();
    }

}
