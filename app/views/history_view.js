import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("history view init()");
    onMount();
}