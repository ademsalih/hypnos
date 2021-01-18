import document from "document";
import { Accelerometer } from "accelerometer";
import FileHandler from "../FileHandler"

let views;

var acc;
var fileHandler = new FileHandler();
var running = false;

export function init(_views) {
    views = _views;
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler); // Back button

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
}

function sessionControlButtonClickHandler(_evt) {
    if (running) {
        acc.stop();
        views.navigate("main"); // Should give a brief overview instead of returning to main view...
    } else {
        running = !running
        acc.start();
        // Change visuals...

        let sessionMixedText = document.getElementById("sessionMixedText");
        let sessionMixedTextHeader = sessionMixedText.getElementById("header");
        let sessionMixedTextCopy = sessionMixedText.getElementById("copy");

        sessionMixedTextHeader.text = "Recording...";
        sessionMixedTextHeader.style.fill = "red"
        sessionMixedTextCopy.text = "Press the button below to stop recording.";

        let sessionControlButton = document.getElementById("sessionControlButton");
        sessionControlButton.style.fill = "red"
        let sessionControlButtonText = sessionControlButton.getElementById("text");
        sessionControlButtonText.text = "Stop Session"

    }
}


function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("main");
    }
}
