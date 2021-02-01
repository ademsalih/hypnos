import document from "document";
import FileHandler from "../../FileHandler";

let views;

export function init(_views) {
    views = _views;
    onMount();

    let fileHandler = new FileHandler();
    let files = fileHandler.allFiles();
    let file = files[views.passOn];

    let bytes = fileHandler.readRawFile(file);

    let virtualList = document.getElementById("my-list2");
    let elementCount = bytes.length

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
                tile.getElementById("detail-text").text = `${bytes[info.index]}`;
            }
        }
    };

    // VTList.length must be set AFTER VTList.delegate
    virtualList.length = elementCount;
}

function onMount() {
    document.addEventListener("keypress", keyHandler);
}

function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("history");
    }
}