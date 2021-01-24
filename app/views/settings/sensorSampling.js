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
            title: "Accelerometer",
            samplingRate: 10
        },
        {
            title: "Heart Rate",
            samplingRate: 15
        },
        {
            title: "Gyroscope",
            samplingRate: 20
        }
    ]

    let virtualList = document.getElementById("settings-sampling-list");
    let elementCount = sensorsList.length

    virtualList.delegate = {
        getTileInfo: function (index) {
            return {
                type: "my-pool3",
                value: "Menu item",
                index: index
            };
        },
        configureTile: function (tile, info) {
            if (info.type == "my-pool3") {
                tile.getElementById("sampling-text-main").text = sensorsList[info.index].title;
                tile.getElementById("sampling-text-secondary").text = `${sensorsList[info.index].samplingRate} Hz`;
            }

            let touch = tile.getElementById("touch-me");
            touch.onclick = evt => {
                views.navigate("settings/samplingTumbler", info.index)
            };
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


