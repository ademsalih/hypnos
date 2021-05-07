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

import { memory } from "system";
import { Memory } from '../../sensor/sensors/MemorySensor';

import * as fs from "fs";
import DispatchManager from '../../lib/DispatchManager';
import { SensorManager } from '../../sensor/SensorManager';

const $ = $at( '#recordView' );

export class RecordView extends View {

    el = $();

    batchLimit = 40;

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
    
    onMount(props){
        console.log("[RecordView] onMount()");
        if (props) this.connected = props.connected;
        
        const prefManager = new PreferencesManager();

        const sm = new SensorManager();

        const accF = prefManager.getSensorFrequencyFor("ACCELEROMETER");
        this.acc.setOptions({ frequency: accF.frequency, batch: accF.frequency*2 });

        const baroF = prefManager.getSensorFrequencyFor("BAROMETER");
        this.baro.setOptions({ frequency: baroF.frequency, batch: baroF.frequency*2 });

        const gyroF = prefManager.getSensorFrequencyFor("GYROSCOPE")
        this.gyro.setOptions({ frequency: gyroF.frequency, batch: gyroF.frequency*2 });

        const hrmF = prefManager.getSensorFrequencyFor("HEARTRATE");
        this.hrm.setOptions({ frequency: hrmF.frequency, batch: hrmF.frequency*2 });

        /* const battF = prefManager.getSensorFrequencyFor("BATTERY");
        this.batt.setOptions({ frequency: battF.frequency }) */

        /* const memF = prefManager.getSensorFrequencyFor("MEMORY");
        this.mem.setOptions({ frequency: 1, batch: 20 }) */
        
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

        let enabledSensors = prefManager.getSensors().reduce((result, i) => {
            if (i.enabled) {
                result.push({"name": i.sensor, "frequency": i.sampling.rate})
            }
            return result;
        }, []);

        console.log(JSON.stringify(enabledSensors))

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

    accelerometerEventHandler() {
        this.readingHandler("ACCELEROMETER", [
            this.acc.readings.timestamp,
            this.acc.readings.x,
            this.acc.readings.y,
            this.acc.readings.z
        ]);
    }

    gyroscopeEventHandler() {
        this.readingHandler("GYROSCOPE", [
            this.gyro.readings.timestamp,
            this.gyro.readings.x,
            this.gyro.readings.y,
            this.gyro.readings.z
        ]);
    }

    barometerEventHandler() {
        this.readingHandler("BAROMETER", [
            this.baro.readings.timestamp,
            this.baro.readings.pressure
        ]);
    }

    heartRateEventHandler() {
        this.readingHandler("HEARTRATE", [
            this.hrm.readings.timestamp,
            this.hrm.readings.heartRate
        ]);
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
            this.acc.stop();
            this.gyro.stop();
            this.baro.stop();
            this.hrm.stop();
            //this.batt.stop();
            //this.mem.stop();

            this.running = false;

            this.dispatchManager.addToQueue(this.sensorFiles["ACCELEROMETER"].fileName);
            this.dispatchManager.addToQueue(this.sensorFiles["GYROSCOPE"].fileName);
            this.dispatchManager.addToQueue(this.sensorFiles["BAROMETER"].fileName);
            this.dispatchManager.addToQueue(this.sensorFiles["HEARTRATE"].fileName);

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

}