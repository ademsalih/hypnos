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
