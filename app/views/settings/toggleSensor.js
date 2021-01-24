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
            identifier: "Accelerometer",
            enabled: true,
            samplingRate: 30
        },
        {
            identifier: "Gyroscope",
            enabled: false,
            samplingRate: 10
        },
        {
            identifier: "Heart Rate",
            enabled: true,
            samplingRate: 10
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
                tile.firstChild.text = sensorsList[info.index].identifier;
            }
        }
    };

    // VTList.length must be set AFTER VTList.delegate
    virtualList.length = elementCount;
}

function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("settings/settings");
    }
}


