import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view';
import { getUUID } from '../../lib/uuid';

import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";
import { Battery } from '../../sensor/sensors/Battery';
import { Gyroscope } from "gyroscope";

import { AccelerometerBatchReading } from '../../reading/AccelerometerBatchReading';
import { HeartRateReading } from '../../reading/HeartRateReading';

import PreferencesManager from '../../lib/PreferenceManager';

import * as cbor from "cbor";
import { me as device } from "device";
import * as messaging from "messaging";
import { BatteryReading } from '../../reading/BatteryReading';
import { GyroscopeBatchReading } from '../../reading/GyroscopeBatchReading';
import { Memory } from '../../sensor/sensors/MemorySensor';
import { MemoryReading } from '../../reading/MemoryReading';

const $ = $at( '#recordView' );

export class RecordView extends View {

    el = $();

    running = false;
    connected = false;

    eventCount;
    sessionUUID;
    hrm = new HeartRateSensor();
    acc = new Accelerometer();
    batt = new Battery();
    mem = new Memory();
    gyro = new Gyroscope();
    
    onMount(props){
        console.log("[RecordView] onMount()");
        if (props) this.connected = props.connected;

        const prefManager = new PreferencesManager();

        const accF = prefManager.getSensorFrequencyFor("ACCELEROMETER");
        this.acc.setOptions({ frequency: accF.frequency, batch: accF.frequency });

        const hrmF = prefManager.getSensorFrequencyFor("HEARTRATE");
        this.hrm.setOptions({ frequency: hrmF.frequency })

        const battF = prefManager.getSensorFrequencyFor("BATTERY");
        this.batt.setOptions({ frequency: battF.frequency })

        const memF = prefManager.getSensorFrequencyFor("MEMORY");
        this.mem.setOptions({ frequency: memF.frequency })
        
        const gyroF = prefManager.getSensorFrequencyFor("GYROSCOPE")
        this.gyro.setOptions({ frequency: gyroF.frequency, batch: gyroF.frequency });

        const sessionControlButton = $('#sessionControlButton');
        sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        this.eventCount = 0;
        this.sessionUUID = getUUID();

        this.hrm.onreading = this.heartRateEventHandler.bind(this);
        this.acc.onreading = this.accelerometerEventHandler.bind(this);
        this.batt.onreading = this.batteryEventHandler.bind(this);
        this.gyro.onreading = this.gyroscopeEventHandler.bind(this);
        this.mem.onreading = this.memoryEventHandler.bind(this);

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
                            "name": "BATTERY",
                            "frequency": battF.frequency
                        },
                        {
                            "name": "MEMORY",
                            "frequency": memF.frequency
                        }
                    ]
                }
            })
            messaging.peerSocket.send(data);
        }
    }

    accelerometerEventHandler() {
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
            payload: new AccelerometerBatchReading(this.sessionUUID, x, y, z, now, ts).get()
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
    }

    heartRateEventHandler() {
        let data = cbor.encode({
            command: "ADD_READING",
            payload: new HeartRateReading(this.sessionUUID, this.hrm.heartRate, Date.now()).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 1;
        }
    }

    memoryEventHandler() {
        let data = cbor.encode({
            command: "ADD_READING",
            payload: new MemoryReading(this.sessionUUID, this.mem.val, this.mem.timestamp).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 1;
        }
    }

    batteryEventHandler() {
        let data = cbor.encode({
            command: "ADD_READING",
            payload: new BatteryReading(this.sessionUUID, this.batt.val, this.batt.timestamp).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 1;
        }
    }

    gyroscopeEventHandler() {
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
            payload: new GyroscopeBatchReading(this.sessionUUID, x, y, z, now, ts).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 25;
        }
    }

    onUnmount(){
        console.log("[RecordView] onUnmount()")
        this.acc.onreading = null;
        this.hrm.onreading = null;
        this.batt.onreading = null;
        this.mem.onreading = null;
        this.gyro.onreading = null;

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
        if (this.running) {
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "STOP_SESSION",
                    payload: {
                        sessionIdentifier: this.sessionUUID,
                        endTime: Date.now(),
                        readingsCount: this.eventCount
                    }
                });
                messaging.peerSocket.send(data);
            }

            this.acc.stop();
            this.hrm.stop();
            this.batt.stop();
            this.mem.stop();
            this.gyro.stop();

            this.running = false;
            Application.switchToWithState('Summary', this.eventCount);
        } else {
            console.log("[RecordView] Sending START_SESSION...")
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "START_SESSION",
                    payload: {
                        sessionIdentifier: this.sessionUUID,
                        startTime: Date.now()
                    }
                });
                messaging.peerSocket.send(data);
            }
            
            this.acc.start();
            this.hrm.start();
            this.batt.start();
            this.mem.start();
            this.gyro.start();

            this.running = true;
        }
        this.render();
    }

}
