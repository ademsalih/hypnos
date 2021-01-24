import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("settings_sensor init()")
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler);

    initTumbler();
}

function initTumbler() {
    let tumbler = document.getElementById("tumbler");

    let selectedIndex = tumbler.value;
    let selectedItem = tumbler.getElementById("item" + selectedIndex);
    let selectedValue = selectedItem.getElementById("content").text;
    
    console.log(`index: ${selectedIndex} :: value: ${selectedValue}`);
    
    //selectedItem.getElementById("content").text = "New Value";
}


function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("settings/sensorSampling");
    }
}


