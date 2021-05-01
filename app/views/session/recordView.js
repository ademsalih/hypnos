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

import { writeFileSync, unlinkSync } from "fs";
import * as fs from "fs";

const $ = $at( '#recordView' );

export class RecordView extends View {

    el = $();

    running = false;
    connected = false;

    eventCount;
    sessionUUID;

    /* hrm = new HeartRateSensor(); */
    acc = new Accelerometer();
    baro = new Barometer();
    /* batt = new Battery();*/
    //mem = new Memory(); 
    gyro = new Gyroscope();

    batch = [];
    count = 0;
    files = [];

    sessionMixedText = $('#sessionMixedText');
    sessionMixedTextCopy = this.sessionMixedText.getElementById("copy");

    /** These should be joined in some kind of variable **/

    accCounter = 0;
    accFilename = `ACCELEROMETER.${Date.now()}`;

    gyroCounter = 0;
    gyroFilename = `GYROSCOPE.${Date.now()}`;

    baroCounter = 0;
    baroFilename = `BAROMETER.${Date.now()}`;

    /*****************************************************/
    
    onMount(props){
        console.log("[RecordView] onMount()");
        if (props) this.connected = props.connected;
        
        const prefManager = new PreferencesManager();

        /* const hrmF = prefManager.getSensorFrequencyFor("HEARTRATE");
        this.hrm.setOptions({ frequency: hrmF.frequency, batch: 1 }); */

        const accF = prefManager.getSensorFrequencyFor("ACCELEROMETER");
        this.acc.setOptions({ frequency: 20, batch: 40 });

        const baroF = prefManager.getSensorFrequencyFor("BAROMETER");
        this.baro.setOptions({ frequency: 20, batch: 40 });

        const gyroF = prefManager.getSensorFrequencyFor("GYROSCOPE")
        this.gyro.setOptions({ frequency: 20, batch: 40 });

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
        //this.hrm.onreading = this.heartRateEventHandler.bind(this);
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
                        /* {
                            "name": "HEARTRATE",
                            "frequency": hrmF.frequency
                        }, */
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

        /* setInterval(() => {
            //this.sessionMixedTextCopy.text = `${Math.round( (memory.js.used/65528)*100*10 ) / 10}%`;
            console.log(`${Math.round( (memory.js.used/65528)*100*10 ) / 10}%`);
        }, 500); */

        this.dispatchInterval = setInterval(() => {
            this.dispatch();
        }, 15000);
    }

    /* store(reading) {
        this.batch.push(reading);
        this.count += 20;
        //console.log(`Caching... (${this.batch.length})`)

        if (this.count > 140) {
            let now = Date.now();

            writeFileSync(`${this.sessionUUID}${now}`, {
                command: "ADD_READING",
                payload: {
                    sessionIdentifier: this.sessionUUID,
                    data: [...this.batch]
                }
            }, 'cbor');

            this.batch = this.batch.splice(this.batch.length);
            
            this.files.push(now);
            this.count = 0;
        }
    } */

    dispatch() {
        //console.log("Dispatching...")
        let dispatchQueue = this.files.slice(0, this.files.length);
        this.files = this.files.splice(this.files.length);
        
        for (let i = 0; i < dispatchQueue.length; i++) {

            setTimeout(() => {
                let path = `/private/data/${dispatchQueue[i]}`;
                outbox.enqueueFile(path).then(() => {
                    // should delete file right away because successfully staged transfers
                    // are stored in same location as our disk cache
                })
                .catch((error) => {
                    console.log(`Failed to schedule transfer: ${error}`);
                })
                unlinkSync(path);
            }, 200*i);

        }
    }

    appendToFile(fileName, buffer) {
        let file = fs.openSync(fileName, "a+");
        fs.writeSync(file, buffer);
        fs.closeSync(file);
    }

    accelerometerEventHandler() {
        let n = this.acc.readings.timestamp.length;
        let count = 4;
        let size = 8;

        let total = size * count * n;
        
        let buffer = new ArrayBuffer(total);
        let bytes = new Float64Array(buffer);
        
        for (let i = 0; i < this.acc.readings.timestamp.length; i++) {
            let b = count * i;
            bytes[b + 0] = this.acc.readings.timestamp[i];
            bytes[b + 1] = this.acc.readings.x[i];
            bytes[b + 2] = this.acc.readings.y[i];
            bytes[b + 3] = this.acc.readings.z[i];
        }

        if (this.accCounter > 5) {
            this.files.push(this.accFilename);
            this.accFilename = `ACCELEROMETER.${Date.now()}`
            this.accCounter = 0;
        }

        this.appendToFile(this.accFilename, buffer);
        
        this.accCounter+=1;
    }

    gyroscopeEventHandler() {
        let n = this.gyro.readings.timestamp.length;
        let count = 4;
        let size = 8;

        let total = size * count * n;
        
        let buffer = new ArrayBuffer(total);
        let bytes = new Float64Array(buffer);
        
        for (let i = 0; i < this.gyro.readings.timestamp.length; i++) {

            let base = count * i;

            bytes[base + 0] = this.gyro.readings.timestamp[i];
            bytes[base + 1] = this.gyro.readings.x[i];
            bytes[base + 2] = this.gyro.readings.y[i];
            bytes[base + 3] = this.gyro.readings.z[i];
        }

        if (this.gyroCounter > 5) {
            this.files.push(this.gyroFilename);
            this.gyroFilename = `GYROSCOPE.${Date.now()}`
            this.gyroCounter = 0;
        }

        this.appendToFile(this.gyroFilename, buffer);
        
        this.gyroCounter+=1;
    }

    barometerEventHandler() {
        let n = this.baro.readings.timestamp.length;
        let count = 2;
        let size = 8;

        let total = size * count * n;
        
        let buffer = new ArrayBuffer(total);
        let bytes = new Float64Array(buffer);
        
        for (let i = 0; i < this.baro.readings.timestamp.length; i++) {

            let base = count * i;

            bytes[base + 0] = this.baro.readings.timestamp[i];
            bytes[base + 1] = this.baro.readings.pressure[i];
        }

        if (this.baroCounter > 5) {
            this.files.push(this.baroFilename);
            this.baroFilename = `BAROMETER.${Date.now()}`
            this.baroCounter = 0;
        }

        this.appendToFile(this.baroFilename, buffer);
        
        this.baroCounter+=1;
    }

    /* accelerometerEventHandler() {
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
        ts[0] = now;

        this.eventCount += 20;

        this.store(createReading("ACCELEROMETER",ts,['X','Y','Z'],[x, y, z]), 20);
    } */

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
        ts[0] = now;

        this.eventCount += 20;

        this.store(createReading("GYROSCOPE", ts, ['X','Y','Z'],[x, y, z]), 20);
    } */

    /* barometerEventHandler() {
        let now = Date.now();
        let p = Array.prototype.slice.call(this.baro.readings.pressure);
        let ts = [];

        let i = this.baro.readings.timestamp.length - 1;
        let lastTs = this.baro.readings.timestamp[i];
        now -= (lastTs - this.baro.readings.timestamp[0]);
        do {
            let currTs = this.baro.readings.timestamp[i];
            let diff = lastTs - currTs;
            ts.push(diff);
        } while(i--);
        ts[0] = now;

        this.eventCount += 20;

        this.store(createReading("BAROMETER",ts,["PRESSURE"],[p]), 20);
    } */
    
    /* memoryEventHandler() {
        let ts = [];

        let i = this.mem.readings.timestamp.length - 1;
        let lastTs = this.mem.readings.timestamp[i];
        do {
            let currTs = this.mem.readings.timestamp[i];
            let diff = lastTs - currTs;
            ts.push(diff);
        } while(i--);
        ts[0] = this.mem.readings.timestamp[0];

        this.eventCount += 20;

        this.store(createReading("MEMORY", ts, ["PERCENTAGE"], [this.mem.readings.val]), 20);
    } */

    /*
    batteryEventHandler() {
        let data = cbor.encode({
            command: "ADD_READING",
            payload: new BatteryReading(this.sessionUUID, this.batt.val, this.batt.timestamp).get()
        });

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send(data);
            this.eventCount += 1;
        }
    } */

    /* heartRateEventHandler() {
        let hrs = Array.prototype.slice.call(this.hrm.readings.heartRate);

        this.batch.push(createReading(
            "HEARTRATE",
            [Date.now()],
            ["BPM"],
            [hrs]
        ));

        this.eventCount += 1;
        this.count += 1;
    } */

    onUnmount(){
        console.log("[RecordView] onUnmount()")
        //this.hrm.onreading = null;
        this.acc.onreading = null;
        //this.batt.onreading = null;
        //this.mem.onreading = null;
        this.gyro.onreading = null; 
        this.baro.onreading = null;

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
            this.acc.stop();
            this.gyro.stop();
            this.baro.stop();
            //this.hrm.stop();
            //this.batt.stop();
            //this.mem.stop();

            this.running = false;
            
            clearInterval(this.dispatchInterval);

            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "STOP_SESSION",
                    payload: {
                        sessionIdentifier: this.sessionUUID,
                        endTime: Date.now(),
                        readingsCount: this.eventCount
                    }
                });
                
                this.dispatch();

                setTimeout(() => {
                    messaging.peerSocket.send(data);
                }, 2000);
            }

            
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
            this.gyro.start();
            this.baro.start();
            //this.hrm.start();
            //this.batt.start();
            //this.mem.start();

            this.running = true;
        }
        this.render();
    }

}
