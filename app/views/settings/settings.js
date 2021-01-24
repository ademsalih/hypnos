import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("settings init()")
    
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler);
    initSettings();
}

function initSettings() {
    let list = document.getElementById("settings-list");
    let items = list.getElementsByClassName("settings-tile-list-item");

    items.forEach((element, index) => {
    let touch = element.getElementById("touch-me");
        touch.onclick = (evt) => {
            console.log(`touched: ${index}`);
            if (index == 0) {
                views.navigate("settings/toggleSensor");
            } else if (index == 1) {
                views.navigate("settings/sensorSampling");
            } else if (index == 2) {
                views.navigate("settings/about");
            }
        }
    });
}

/**
 * Sample keypress handler to navigate backwards.
 */
function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("main");
    }
}


