import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("settings_sensor init()")
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler);
    initSettings();
}

function initSettings() {
    let sensorsList = [
        {
            enabled: true,
            title: "Accelerometer"
        },
        {
            enabled: false,
            title: "Gyroscope"
        },
        {
            enabled: true,
            title: "Heart Rate"
        }
    ]

    let virtualList = document.getElementById("my-list2");
    let elementCount = sensorsList.length

    virtualList.delegate = {
        getTileInfo: function (index) {
            return {
                type: "my-pool2",
                value: "Menu item",
                index: index
            };
        },
        configureTile: function (tile, info) {
            if (info.type == "my-pool2") {

                tile.firstChild.value = sensorsList[info.index].enabled ? 1 : 0;
                tile.firstChild.text = sensorsList[info.index].title;
            }
        }
    };

    // VTList.length must be set AFTER VTList.delegate
    virtualList.length = elementCount;
}

function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("settings");
    }
}


