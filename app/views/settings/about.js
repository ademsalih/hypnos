import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("settings init()")
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler);
    document.getElementById("about-text").text = "Sleepy\nVersion 0.5.0\nDeveloped by Adem Salih";
}


function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("settings/settings");
    }
}


