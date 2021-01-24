import document from "document";
import { Accelerometer } from "accelerometer";

let views;

export function init(_views) {
    views = _views;
    console.log("main init()");
    onMount();
}

function onMount() {
    if (!Accelerometer) {
        console.log("This device has no accelerometer")
    }

    let newSessionButton = document.getElementById("newSessionButton");
    newSessionButton.addEventListener("click", newSessionButtonClickHandler);

    let viewHistoryButton = document.getElementById("viewHistoryButton");
    viewHistoryButton.addEventListener("click", viewHistoryButtonClickHandler);

    let settingsButton = document.getElementById("settingsButton");
    settingsButton.addEventListener("click", settingsButtonClickHandler);
}

function newSessionButtonClickHandler(_evt) {
    views.navigate("record");
}

function viewHistoryButtonClickHandler(_evt) {
    views.navigate("history");
}

function settingsButtonClickHandler(_evt) {
    views.navigate("settings/settings");
}







