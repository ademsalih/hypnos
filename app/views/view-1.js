import document from "document";
import FileHandler from "../FileHandler";
import { Accelerometer } from "accelerometer";
import * as fs from "fs";

let views;

const acc;
const fileHandler = new FileHandler();

export function init(_views) {
    views = _views;
    console.log("view-1 init()");
    onMount();
}

/**
 * When this view is mounted, setup elements and events.
 */
function onMount() {
    if (acc != null) {
        console.log("Acc != null")
    } else {
        console.log("Acc == null")
    }

    if (!Accelerometer) {
        console.log("This device has no accelerometer")
    } else {
        acc = new Accelerometer({ frequency: 5 });
        acc.addEventListener("reading", adem);
    }

    let btn = document.getElementById("startSessionButton");
    btn.addEventListener("click", clickHandler);
}

/**
 * Sample button click with navigation.
 */
function clickHandler(_evt) {
    console.log("Starting Session!");

    acc.start();

    /* Navigate to another screen */
    views.navigate("view-2");
}

function adem() {
    console.log(`X=${acc.x}  Y=${acc.y}  Z=${acc.z}`)
    let buffer = new ArrayBuffer(32);
    let bytes = new Float64Array(buffer);
    bytes[0] = Date.now();
    bytes[1] = acc.x;
    bytes[2] = acc.y;
    bytes[3] = acc.z;

    fileHandler.appendToFile("recording_5.txt", buffer);
}







