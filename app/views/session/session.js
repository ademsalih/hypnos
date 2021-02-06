import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'
import { AccelerometerReading } from '../../reading/AccelerometerReading';
import { Accelerometer } from "accelerometer";
import * as messaging from "messaging";

const $ = $at( '#session' );
const accelerometer = new Accelerometer({ frequency: 10 });

export class Session extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    running = false;

    onMount(){
        let sessionControlButton = $('#sessionControlButton');
        sessionControlButton.addEventListener("click", this.startSessionButtonHandler);

        messaging.peerSocket.addEventListener("open", (evt) => {
            console.log("Ready to send or receive messages");
        });

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

//####################################################################################

/*

function onMount() {
    document.addEventListener("keypress", keyHandler);

    let sessionControlButton = document.getElementById("sessionControlButton");
    sessionControlButton.addEventListener("click", sessionControlButtonClickHandler);

    var now = new Date();
    let fileName = `${now.getFullYear()}-${("0"+(now.getMonth()+1)).slice(-2)}-${now.getDate()}T${now.getHours()}-${now.getMinutes()}`

    if (Accelerometer) {
        acc = new Accelerometer({ frequency: 10 });
        acc.addEventListener("reading", () => {
            console.log(`X=${acc.x}  Y=${acc.y}  Z=${acc.z}`)
            let buffer = new ArrayBuffer(32);
            let bytes = new Float64Array(buffer);
            bytes[0] = Date.now();
            bytes[1] = acc.x;
            bytes[2] = acc.y;
            bytes[3] = acc.z;
        
            fileHandler.appendToFile(fileName, buffer);
        });
    }
}*/

