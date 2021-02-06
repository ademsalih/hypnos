import { Application } from '../lib/view';
import { View, $at } from '../lib/view'
import { me } from "appbit";

const $ = $at( '#main' );

export class Main extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        me.appTimeoutEnabled = false;
        const newSessionButton = $( '#newSessionButton' );
        newSessionButton.addEventListener("click", this.sessionButtonClickHandler);

        const settingsButton = $( '#settingsButton' );
        settingsButton.addEventListener("click", this.settingsButtonClickHandler);
    }

    onRender(){
    }

    onUnmount(){
    }

    // Screens may have they own key handlers.
    onKeyUp(){
    }

    sessionButtonClickHandler() {
        Application.switchTo('Session');
    }

    settingsButtonClickHandler() {
        Application.switchTo('Settings');
    }

}

//########################################################################################

/* import document from "document";
import { Accelerometer } from "accelerometer";

let views;

export function init(_views) {
    views = _views;
    console.log("main init()");
    onMount();
}

function onMount() {
    if (!Accelerometer) {
        console.log("This device has no accelerometer")
    }

    let newSessionButton = document.getElementById("newSessionButton");
    newSessionButton.addEventListener("click", newSessionButtonClickHandler);

    let viewHistoryButton = document.getElementById("viewHistoryButton");
    viewHistoryButton.addEventListener("click", viewHistoryButtonClickHandler);

    let settingsButton = document.getElementById("settingsButton");
    settingsButton.addEventListener("click", settingsButtonClickHandler);
}

function newSessionButtonClickHandler(_evt) {
    views.navigate("record");
}

function viewHistoryButtonClickHandler(_evt) {
    views.navigate("history");
}

function settingsButtonClickHandler(_evt) {
    views.navigate("settings/settings");
}
 */





