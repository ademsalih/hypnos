import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'
import { AccelerometerReading } from '../../reading/AccelerometerReading';
import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";
import { HeartRateReading } from '../../reading/HeartRateReading';
import * as messaging from "messaging";
import Session from '../../sensor/Session';
import { me as device } from "device";
import { Battery } from '../../sensor/sensors/battery';
import { BatteryReading } from '../../reading/BatteryReading';
import { battery } from "power";
import clock from "clock";
import FileHandler from '../../lib/FileHandler';

const $ = $at( '#recordView' );

export class RecordView extends View {

    el = $();

    running = false;
    eventCount;
    session;
    sessionControlButton;
    hrm = new HeartRateSensor();
    acc = new Accelerometer();
    batt = new Battery();
    clockLabel;
    gradientRect;
    
    onMount(){
        console.log("[RecordView] onMount()");

        this.gradientRect = $('#recordViewGradient');
        this.gradientRect.gradient.colors.c1 = "#266135";

        ///////////////////////////////////////////////////////////////////////////////
        
        let fHandler = new FileHandler();
        let preferences = fHandler.readJSONFile("preferences.json");
        let sensorList = preferences.sensorList;

        let accelerometerFreq = (sensorList.filter( i => i.sensor == "ACCELEROMETER_SENSOR"))[0].sampling.rate;
        let accFreq = parseInt(accelerometerFreq, 10);
        this.acc.setOptions({ frequency: accFreq});

        let batteryFreq = (sensorList.filter( i => i.sensor == "BATTERY_SENSOR"))[0].sampling.rate;

        console.log(batteryFreq)

        let battFreq = parseFloat(batteryFreq, 10);

        console.log(battFreq)

        this.batt.setFrequency(battFreq);

        ///////////////////////////////////////////////////////////////////////////////

        this.clockLabel = $('#clock');
        this.clockLabel.text = this.currentTimeLabel();
        clock.granularity = "minutes";
        clock.addEventListener("tick", this.tickHandler.bind(this));

        this.sessionControlButton = $('#sessionControlButton');
        
        messaging.peerSocket.addEventListener("message", this.onMessageHandler);

        this.sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        this.eventCount = 0;
        this.session = new Session();

        this.hrm.onreading = this.heartRateEventHandler.bind(this);
        this.acc.onreading = this.accelerometerEventHandler.bind(this);
        this.batt.onreading = this.batteryEventHandler.bind(this);

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send({
                command: "INIT_SESSION",
                data: {
                    sessionIdentifier: this.session.getIdentifier(),
                    deviceModel: device.modelName,
                    deviceBatteryPercentage: battery.chargeLevel
                }
            });
        }
    }

    accelerometerEventHandler() {
        const reading = new AccelerometerReading(this.session.getIdentifier(), this.acc.x, this.acc.y, this.acc.z);

        this.eventCount += 1;

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send({
                command: "ADD_READING",
                data: reading.get()
            })
        }
    }

    heartRateEventHandler() {
        const reading = new HeartRateReading(this.session.getIdentifier(), this.hrm.heartRate);

        this.eventCount += 1;

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send({
                command: "ADD_READING",
                data: reading.get()
            });
        }
    }

    batteryEventHandler() {
        console.log(`batteryEventHandler: ${this.batt.batteryLevel}`)
        const reading = new BatteryReading(this.session.getIdentifier(), this.batt.batteryLevel);

        this.eventCount += 1;

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send({
                command: "ADD_READING",
                data: reading.get()
            });
        }
    }

    onRender(){
        
    }

    onUnmount(){
        console.log("[RecordView] onUnmount()")
        this.hrm.onreading = null;
        this.acc.onreading = null;

        this.sessionControlButton.removeEventListener("click", this.startSessionButtonHandler);

        messaging.peerSocket.removeEventListener("message", this.onMessageHandler);
        let sessionMixedText = $('#sessionMixedText');
        let sessionMixedTextHeader = sessionMixedText.getElementById("header");
        let sessionMixedTextCopy = sessionMixedText.getElementById("copy");
    
        sessionMixedTextHeader.text = "Connected";
        sessionMixedTextHeader.style.fill = "fb-mint"
        sessionMixedTextCopy.text = "Press the button below to start a new session.";
    
        this.sessionControlButton.style.fill = "fb-mint"
    
        let sessionControlButtonText = this.sessionControlButton.getElementById("text");
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
                console.log("Lost connection, switching to Search...");
                Application.switchTo('Search');
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
                messaging.peerSocket.send({
                    command: "STOP_SESSION",
                    data: {
                        sessionIdentifier: this.session.getIdentifier(),
                        endTime: Date.now(),
                        readingsCount: this.eventCount
                    }
                });
            }

            this.running = false;

            this.hrm.stop();
            this.acc.stop();
            this.batt.stop();

            Application.switchToWithState('Summary', this.eventCount);
        } else {
            console.log("[RecordView] Sending START_SESSION...")
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                messaging.peerSocket.send({
                    command: "START_SESSION",
                    data: {
                        sessionIdentifier: this.session.getIdentifier(),
                        startTime: Date.now()
                    }
                });
            }
            this.running = true;

            this.hrm.start();
            this.acc.start();
            this.batt.start();

            let sessionMixedText = $('#sessionMixedText');
            let sessionMixedTextHeader = sessionMixedText.getElementById("header");
            let sessionMixedTextCopy = sessionMixedText.getElementById("copy");
        
            sessionMixedTextHeader.text = "Recording...";
            sessionMixedTextHeader.style.fill = "fb-red"
            sessionMixedTextCopy.text = "Press the button below to stop recording.";
        
            let sessionControlButton = $('#sessionControlButton');
            sessionControlButton.style.fill = "fb-red"
        
            let sessionControlButtonText = sessionControlButton.getElementById("text");
            sessionControlButtonText.text = "End Session"
            this.gradientRect.gradient.colors.c1 = "#6D2120";
        }
    }

    currentTimeLabel() {
        let now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        return `${(hour.toString()).padStart(2,'0')}:${(minute.toString()).padStart(2,'0')}`;
    }

    tickHandler() {
        this.clockLabel.text = this.currentTimeLabel();
    }

}

String.prototype.padStart = function(length, padString) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}
