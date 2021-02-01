import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'

const $ = $at( '#samplingTumbler' );

export class SamplingTumbler extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        console.log("[Settings > Sampling > Sampling Rate] onMount()")

        let tumbler = $('#tumbler');

        let selectedIndex = tumbler.value;
        let selectedItem = tumbler.getElementById("item" + selectedIndex);
        let selectedValue = selectedItem.getElementById("content").text;
        
        console.log(`index: ${selectedIndex} :: value: ${selectedValue}`);
        
        //selectedItem.getElementById("content").text = "New Value";
    }

    onRender(){
    }

    onUnmount(){
    }

    onKeyUp(){
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('SensorSampling');
    }

}

/* import document from "document";

let views;

export function init(_views) {
    views = _views;
    console.log("settings_sensor init()")
    onMount();
}

function onMount() {
    document.addEventListener("keypress", keyHandler);

    initTumbler();
}

function initTumbler() {
    let tumbler = document.getElementById("tumbler");

    let selectedIndex = tumbler.value;
    let selectedItem = tumbler.getElementById("item" + selectedIndex);
    let selectedValue = selectedItem.getElementById("content").text;
    
    console.log(`index: ${selectedIndex} :: value: ${selectedValue}`);
    
    //selectedItem.getElementById("content").text = "New Value";
}


function keyHandler(evt) {
    if (evt.key === "back") {
        evt.preventDefault();
        views.navigate("settings/sensorSampling");
    }
}
 */

