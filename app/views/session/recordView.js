import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'
import { AccelerometerReading } from '../../reading/AccelerometerReading';
import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";
import { HeartRateReading } from '../../reading/HeartRateReading';
import * as messaging from "messaging";
import Session from '../../sensor/Session';

const $ = $at( '#recordView' );

export class RecordView extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    running = false;

    eventCount;

    sessionControlButton = $('#sessionControlButton');

    hrm = new HeartRateSensor({ frequency: 1});

    session;

    onMount(){
        console.log("[RecordView] onMount()");

        this.eventCount = 0;
        
        messaging.peerSocket.addEventListener("message", this.onMessageHandler);

        this.sessionControlButton.addEventListener("click", this.startSessionButtonHandler.bind(this));

        this.session = new Session();

/*         if (Accelerometer) {
            this.accelerometer.addEventListener("reading", () => {
                const reading = new AccelerometerReading(
                    session.getIdentifier(),
                    this.accelerometer.x,
                    this.accelerometer.y,
                    this.accelerometer.z
                ).get();

                if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                    messaging.peerSocket.send({
                        command: "DATA",
                        data: {
                            reading: reading
                        }
                    });
                }
            });
        } else {
            console.log("This device does NOT have an Accelerometer!");
        } */

        this.hrm.onreading = this.heartRateEventHandler.bind(this);
    }

    heartRateEventHandler() {
        const reading = new HeartRateReading(this.session.getIdentifier(), this.hrm.heartRate);

        this.eventCount += 1;

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send({
                command: "DATA",
                data: {
                    reading: reading
                }
            });
        }
    }

    onRender(){

    }

    onUnmount(){
        this.hrm.onreading = null;

        messaging.peerSocket.removeEventListener("message", this.onMessageHandler);
        let sessionMixedText = $('#sessionMixedText');
        let sessionMixedTextHeader = sessionMixedText.getElementById("header");
        let sessionMixedTextCopy = sessionMixedText.getElementById("copy");
    
        sessionMixedTextHeader.text = "Connected to Nyx";
        sessionMixedTextHeader.style.fill = "fb-blue"
        sessionMixedTextCopy.text = "Press the button below to start a new session.";
    
        let sessionControlButton = $('#sessionControlButton');
        sessionControlButton.style.fill = "fb-mint"
    
        let sessionControlButtonText = sessionControlButton.getElementById("text");
        sessionControlButtonText.text = "Start Session"
        

        let sessionControlButton = $('#sessionControlButton');
        sessionControlButton.removeEventListener("click", this.startSessionButtonHandler);
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
                console.log("Lost connection, switing to Search...");
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
    startSessionButtonHandler() {
        if (this.running) {
            this.running = false;

            this.hrm.stop();

            Application.switchToWithState('Summary', this.eventCount);
        } else {
            this.running = true;

            this.hrm.start();

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
        }
    }

    

}
