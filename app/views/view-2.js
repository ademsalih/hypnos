import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("view-2 init()");
    onMount();
}

/**
 * When this view is mounted, setup elements and events.
 */
function onMount() {
    let btn = document.getElementById("stopSessionButton");
    btn.addEventListener("click", clickHandler);
    document.addEventListener("keypress", keyHandler);
}

/**
 * Sample button click with navigation.
 */
function clickHandler(_evt) {
    console.log("view-2 Button Clicked!");
    /* Navigate to another screen */
    views.navigate("view-1");
    //acc.stop();
}

/**
 * Sample keypress handler to navigate backwards.
 */
function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("view-1");
    }
}
