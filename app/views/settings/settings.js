import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'

const $ = $at( '#settings' );

export class Settings extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        console.log("[Settings] onMount()")
        
        let list = $( '#settings-list' );
        let items = list.getElementsByClassName("settings-tile-list-item");
    
        items.forEach((element, index) => {
            let touch = element.getElementById('settings-touch');
            touch.onclick = (evt) => {
                if (index == 0) {
                    Application.switchTo('ToggleSensor');
                } else if (index == 1) {
                    Application.switchTo('SensorSampling');
                } else if (index == 2) {
                    Application.switchTo('About');
                }
            }
        });
    }

    onRender(){
    }

    onUnmount(){
    }

    // Screens may have they own key handlers.
    onKeyUp(){
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Main');
    }

}

//########################################################################################

/* import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("settings init()")
    
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler);
    initSettings();
}

function initSettings() {
    let list = document.getElementById("settings-list");
    let items = list.getElementsByClassName("setting-tile-list-item");

    items.forEach((element, index) => {
    let touch = element.getElementById("touch-me");
        touch.onclick = (evt) => {
            console.log(`touched: ${index}`);
        }
    });
}
*/



/**
 * Sample keypress handler to navigate backwards.
 */
/*
function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("main");
    }
}

*/


