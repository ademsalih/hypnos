import { Accelerometer } from "accelerometer";
import * as fs from "fs";
import document from "document";
import FileHandler from "./FileHandler"
import { init } from "./views"

/**
 * Definition for each view in the resources/views folder, and the associated
 * JavaScript module is lazily loaded alongside its view.
 */
const views = init(
    [
        ["view-1", () => import("./views/view-1")],
        ["view-2", () => import("./views/view-2")]
    ],
    "./resources/views/"
);

// Select the first view (view-1) after 1 second
setTimeout(() => {
    views.navigate("view-1");
}, 0);
















// ____________________________________________________________________________

//let fileHandler = new FileHandler()

/* const acc = null;

if (Accelerometer) {
    acc = new Accelerometer({ frequency: 1 });
}

let name = "testing111.txt"

let startSessionButton = document.getElementById("startSessionButton");
startSessionButton.onactivate = function() {
    if (acc != null) {
        acc.addEventListener("reading", () => {
            let buffer = new ArrayBuffer(32);
            let bytes = new Float64Array(buffer);
            bytes[0] = Date.now();
            bytes[1] = acc.x;
            bytes[2] = acc.y;
            bytes[3] = acc.z;

            fileHandler.appendToFile(name, buffer)
        });
        acc.start();
    }
} */

/* let stopSessionButton = document.getElementById("stopSessionButton");
stopSessionButton.onactivate = function() {

    if (acc != null) {
        acc.stop();

        let historyText = document.getElementById("recordingsHistory");
        let label = historyText.getElementById("copy");

        let files = fileHandler.listAllFiles();

        let labelText = "";

        for (var i = 0; i < files.length; i++) {
            let fileName = files[i];
            labelText += fileName + "\n"
        }

        label.text = labelText

        /* let file = fs.openSync(name, "r")
        let buffer = new ArrayBuffer(fileHandler.fileSize(name));
        fs.readSync(file, buffer);
        let bytes = new Float64Array(buffer);

        let text = ""

        for (var i = 0; i < bytes.length; i++) {
            if (i % 4 == 0) {
                text = text + "----------\n"
            }
            text = text + bytes[i] + "\n"
        }

        fs.closeSync(file);

        label.text = text
    }

} */

