import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'
import { AccelerometerReading } from '../../reading/AccelerometerReading';
import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";
import { HeartRateReading } from '../../reading/HeartRateReading';
import * as messaging from "messaging";

const $ = $at( '#session' );
const accelerometer = new Accelerometer({ frequency: 10 });
const hrm = new HeartRateSensor({ frequency: 1});

export class Session extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    running = false;

    onMount(){
        let sessionControlButton = $('#sessionControlButton');
        sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        if (Accelerometer) {
            accelerometer.addEventListener("reading", () => {
                var reading = new AccelerometerReading("A12345", accelerometer.x, accelerometer.y, accelerometer.z).get();

                if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                    messaging.peerSocket.send(reading);
                }
            });
         } else {
            console.log("This device does NOT have an Accelerometer!");
         }

         if (HeartRateSensor) {
             hrm.addEventListener("reading", () => {
                var reading = new HeartRateReading("A12345", hrm.heartRate);

                if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                    messaging.peerSocket.send(reading);
                }
             });
         } else {
            console.log("This device does NOT have a heart rate sensor!");
         }
    }

    onRender(){
    }

    onUnmount(){
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Main');
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
