import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'
import { AccelerometerReading } from '../../reading/AccelerometerReading';
import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";
import { HeartRateReading } from '../../reading/HeartRateReading';
import * as messaging from "messaging";
import Session from '../../sensor/Session';

const $ = $at( '#recordView' );
const accelerometer = new Accelerometer({ frequency: 1 });
const hrm = new HeartRateSensor({ frequency: 1});

export class RecordView extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    running = false;

    onMessageHandler = (evt) => {
        console.log(`[Session] Message from Companion: ${evt.data}`)
        switch (evt.data) {
            case "DISCONNECT":
                console.log("Lost connection, switing to Search...");
                Application.switchTo('Search');
                break;
            default:
                break;
        }
    }

    onMount(){
        console.log("[Session] onMount()")
        console.log(`[Session] onMessageHandler: ${messaging.peerSocket.message}`)

        messaging.peerSocket.addEventListener("message", this.onMessageHandler);
        console.log(`[Session] onMessageHandler: ${messaging.peerSocket.eventListener}`)

        let sessionControlButton = $('#sessionControlButton');
        sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        let session = new Session();

        if (Accelerometer) {
            accelerometer.addEventListener("reading", () => {
                var reading = new AccelerometerReading(
                    session.getIdentifier(),
                    accelerometer.x,
                    accelerometer.y,
                    accelerometer.z
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
        }

        if (HeartRateSensor) {
            hrm.addEventListener("reading", () => {
                var reading = new HeartRateReading(session.getIdentifier(), hrm.heartRate);

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
            console.log("This device does NOT have a heart rate sensor!");
        }
    }

    onRender(){
    }

    onUnmount(){
        messaging.peerSocket.removeEventListener("message", this.onMessageHandler);
    }

    onKeyBack(e) {
        e.preventDefault();
        if (!this.running) {
            Application.switchTo('Main');
        } else {
            // Change text to "End session before exit""
        }
        
    }

    startSessionButtonHandler() {
        if (this.running) {
            accelerometer.stop();
            console.log("[Session] Ending session...");
            Application.switchTo('Summary');
        } else {
            accelerometer.start();
            hrm.start();
            this.running = !this.running;
            console.log("[Session] Starting session...");
            updateView();
        }
    }

}

function updateView() {
    let sessionMixedText = $('#sessionMixedText');
    let sessionMixedTextHeader = sessionMixedText.getElementById("header");
    let sessionMixedTextCopy = sessionMixedText.getElementById("copy");

    sessionMixedTextHeader.text = "Recording...";
    sessionMixedTextHeader.style.fill = "red"
    sessionMixedTextCopy.text = "Press the button below to stop recording.";

    let sessionControlButton = $('#sessionControlButton');
    sessionControlButton.style.fill = "red"

    let sessionControlButtonText = sessionControlButton.getElementById("text");
    sessionControlButtonText.text = "End Session"
}
