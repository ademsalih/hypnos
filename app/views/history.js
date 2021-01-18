import document from "document";
import FileHandler from "../FileHandler";

let views;

export function init(_views) {
    views = _views;
    console.log("history view init()");
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler);

    const fileHandler = new FileHandler();

    let files = fileHandler.allFiles();

    let virtualList = document.getElementById("my-list");
    let elementCount = files.length + 1;

    virtualList.delegate = {
        getTileInfo: function (index) {
            return {
                type: "my-pool",
                value: "Menu item",
                index: index
            };
        },
        configureTile: function (tile, info) {
            if (info.type == "my-pool") {
                if (info.index == 0) {
                    tile.getElementById("text").text = "Delete All Files";
                } else {
                    let i = info.index - 1;
                    let file = files[i];
                    let size = fileHandler.fileSize(file);
                    tile.getElementById("text").text = `${file} (${shortFileSize(size)})`;
                }

                let touch = tile.getElementById("touch-me");
                touch.onclick = evt => {
                    if (info.index == 0) {
                        fileHandler.deleteAllFiles();
                        views.navigate("history")
                    } else {
                        views.navigate("detail", info.index - 1)
                    }
                };
            }
        }
    };

    // VTList.length must be set AFTER VTList.delegate
    virtualList.length = elementCount;
}

function shortFileSize(bytes) {
    console.log(bytes)
    if (bytes > 999999999) {
        let b = bytes/1000000000
        return `${Math.round(b*10)/10} GB`;
    } else if (bytes > 999999) {
        let b = bytes/1000000
        return `${Math.round(b*10)/10} MB`;
    } else if (bytes > 999) {
        let b = bytes/1000
        return `${Math.round(b*10)/10} kB`;
    } else {
        return `${bytes}B`;
    }
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