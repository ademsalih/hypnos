import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'

import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";
import { Battery } from '../../sensor/sensors/Battery';
import { Gyroscope } from "gyroscope";

import { AccelerometerBatchReading } from '../../reading/AccelerometerBatchReading';
import { HeartRateReading } from '../../reading/HeartRateReading';

import { PreferencesManager } from '../../lib/PreferenceManager';
import Session from '../../sensor/Session';

import { outbox } from "file-transfer";
import * as cbor from "cbor";
import { me as device } from "device";
import * as messaging from "messaging";
import { BatteryReading } from '../../reading/BatteryReading';
import { GyroscopeBatchReading } from '../../reading/GyroscopeBatchReading';

const $ = $at( '#recordView' );

export class RecordView extends View {

    el = $();

    running = false;
    eventCount;
    session;
    //hrm = new HeartRateSensor();
    //acc = new Accelerometer();
    batt = new Battery();
    //gyro = new Gyroscope();
    
    onMount(){
        console.log("[RecordView] onMount()");

        const prefManager = new PreferencesManager();

        /* const accF = prefManager.getSensorFrequencyFor("ACCELEROMETER_SENSOR");
        this.acc.setOptions({ frequency: accF, batch: accF }); */

        //this.hrm.setOptions({ frequency: 1, batch: 1 })

        const battF = prefManager.getSensorFrequencyFor("BATTERY_SENSOR");
        this.batt.setOptions({ frequency: 20, batch: 100 })
        
        /* const gyroF = prefManager.getSensorFrequencyFor("GYROSCOPE_SENSOR")
        this.gyro.setOptions({ frequency: gyroF, batch: gyroF }); */

        const sessionControlButton = $('#sessionControlButton');
        sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        messaging.peerSocket.addEventListener("message", this.onMessageHandler);

        this.eventCount = 0;
        this.session = new Session();

        //this.hrm.onreading = this.heartRateEventHandler.bind(this);
        //this.acc.onreading = this.accelerometerEventHandler.bind(this);
        this.batt.onreading = this.batteryEventHandler.bind(this);
        //this.gyro.onreading = this.gyroscopeEventHandler.bind(this);

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            let data = cbor.encode({
                command: "INIT_SESSION",
                payload: {
                    sessionIdentifier: this.session.getIdentifier(),
                    deviceModel: device.modelName,
                    activeSensors: [
                        {
                            "name": "ACCELEROMETER",
                            "frequency": 25
                        },
                        {
                            "name": "GYROSCOPE",
                            "frequency": 25
                        },
                        {
                            "name": "HEARTRATE",
                            "frequency": 1
                        },
                        {
                            "name": "BATTERY",
                            "frequency": 1
                        }
                    ]
                }
            })
            messaging.peerSocket.send(data);
        }
    }

    /* accelerometerEventHandler() {
        console.log(this.acc.x)
        console.log(this.acc.readings.x)
        let now = Date.now();
        let x = Array.prototype.slice.call(this.acc.readings.x);
        let y = Array.prototype.slice.call(this.acc.readings.y);
        let z = Array.prototype.slice.call(this.acc.readings.z);
        let ts = [];

        let i = this.acc.readings.timestamp.length - 1;
        let lastTs = this.acc.readings.timestamp[i];
        now -= (lastTs - this.acc.readings.timestamp[0]);
        do {
            let currTs = this.acc.readings.timestamp[i];
            let diff = lastTs - currTs;
            ts.push(diff);
        } while(i--);

        let data = cbor.encode({
            command: "ADD_READING",
            payload: new AccelerometerBatchReading(this.session.getIdentifier(), x, y, z, now, ts).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data)
            x = null;
            y = null;
            z = null;
            ts = null;
            data = null;
            this.eventCount += 25;
        }
    } */

    /* heartRateEventHandler() {
        console.log(this.hrm.heartRate)
        console.log(this.hrm.readings.heartRate)
        let data = cbor.encode({
            command: "ADD_READING",
            payload: new HeartRateReading(this.session.getIdentifier(), this.hrm.heartRate).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 1;
        }
    } */

    batteryEventHandler() {
        console.log(this.batt.pct)
        console.log(this.batt.readings.pct)

        let data = cbor.encode({
            command: "ADD_READING",
            payload: new BatteryReading(this.session.getIdentifier(), this.batt.pct).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 1;
        }
    }

    /* gyroscopeEventHandler() {
        let now = Date.now();
        let x = Array.prototype.slice.call(this.gyro.readings.x);
        let y = Array.prototype.slice.call(this.gyro.readings.y);
        let z = Array.prototype.slice.call(this.gyro.readings.z);
        let ts = [];

        let i = this.gyro.readings.timestamp.length - 1;
        let lastTs = this.gyro.readings.timestamp[i];
        now -= (lastTs - this.gyro.readings.timestamp[0]);
        do {
            let currTs = this.gyro.readings.timestamp[i];
            let diff = lastTs - currTs;
            ts.push(diff);
        } while(i--);

        let data = cbor.encode({
            command: "ADD_READING",
            payload: new GyroscopeBatchReading(this.session.getIdentifier(), x, y, z, now, ts).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 25;
        }
    } */

    onUnmount(){
        console.log("[RecordView] onUnmount()")
        //this.acc.onreading = null;
        //this.hrm.onreading = null;
        this.batt.onreading = null;
        //this.gyro.onreading = null;

        messaging.peerSocket.removeEventListener("message", this.onMessageHandler);

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
        } else {
            // Change text to "End session before exit""
        }
    }
    
    onMessageHandler = (evt) => {
        console.log(`[RecordView] Message from Companion: ${evt.data}`)
        switch (evt.data) {
            case "DISCONNECT":
                console.log("Buffering...");
                const sessionMixedText = $('#sessionMixedText');
                const sessionMixedTextHeader = sessionMixedText.getElementById("header");
                sessionMixedTextHeader.text = "Buffering...";
                sessionMixedTextHeader.style.fill = "fb-red"
                break;
            case "CONNECT":
                console.log("Recording...");
                const sessionMixedText = $('#sessionMixedText');
                const sessionMixedTextHeader = sessionMixedText.getElementById("header");
                sessionMixedTextHeader.text = "Recording...";
                sessionMixedTextHeader.style.fill = "fb-red"
                break;
            default:
                break;
        }
    }

    /**
     * This method in invoked when the Start Session button
     * is pressed and controls the sensors accordingly. 
     */
    startSessionButtonHandler = () => {
        if (this.running) {
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "STOP_SESSION",
                    payload: {
                        sessionIdentifier: this.session.getIdentifier(),
                        endTime: Date.now(),
                        readingsCount: this.eventCount
                    }
                });
                messaging.peerSocket.send(data);
            }

            this.running = false;

            //this.acc.stop();
            //this.hrm.stop();
            this.batt.stop();
            //this.gyro.stop();

            Application.switchToWithState('Summary', this.eventCount);
        } else {
            console.log("[RecordView] Sending START_SESSION...")
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "START_SESSION",
                    payload: {
                        sessionIdentifier: this.session.getIdentifier(),
                        startTime: Date.now()
                    }
                });
                messaging.peerSocket.send(data);
            }
            this.running = true;

            //this.acc.start();
            //this.hrm.start();
            this.batt.start();
            //this.gyro.start();

            const sessionMixedText = $('#sessionMixedText');
            const sessionMixedTextHeader = sessionMixedText.getElementById("header");
            const sessionMixedTextCopy = sessionMixedText.getElementById("copy");
        
            sessionMixedTextHeader.text = "Recording...";
            sessionMixedTextHeader.style.fill = "fb-red"
            sessionMixedTextCopy.text = "Press the button below to stop recording.";
        
            const sessionControlButton = $('#sessionControlButton');
            sessionControlButton.style.fill = "fb-red"
        
            const sessionControlButtonText = sessionControlButton.getElementById("text");
            sessionControlButtonText.text = "End Session"
        }
    }

}
