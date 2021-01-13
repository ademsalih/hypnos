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

    let files = fileHandler.listAllFiles();

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
                    tile.getElementById("text").text = `${files[info.index - 1]}`;
                }

                let touch = tile.getElementById("touch-me");
                touch.onclick = evt => {
                    console.log(`touched: ${info.index}`);

                    if (info.index == 0) {
                        fileHandler.deleteAllFiles();
                        views.navigate("history_view")
                    }
                };
            }
        }
    };

    // VTList.length must be set AFTER VTList.delegate
    virtualList.length = elementCount;
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