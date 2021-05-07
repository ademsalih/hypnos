import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'
import PreferencesManager from '../../../lib/PreferenceManager';

const $ = $at( '#samplingTumbler' );

export class SamplingTumbler extends View {

    el = $();

    prefManager;
    tumbler;
    sensorList;
    sensor;

    onMount(state){
        console.log("[Settings > Sampling > Sampling Rate] onMount()")
        console.log(state.sensor);
        this.sensor = state.sensor;

        this.prefManager = new PreferencesManager();
        const freq = this.prefManager.getSensorFrequencyFor(state.sensor);

        this.tumbler = $('#tumbler');
        this.tumbler.value = freq.element;
        
        this.tumbler.addEventListener("select", this.selectHandler);
    }

    selectHandler = () => {
        console.log("selectChanged")
        let selectedIndex = this.tumbler.value;
        let selectedItem = this.tumbler.getElementById("item" + selectedIndex);
        let selectedValue = selectedItem.getElementById("content").text;

        console.log(`changed to index=${selectedIndex} and value=${selectedValue}`)

        this.prefManager.setSensorFrequencyFor(this.sensor, selectedIndex, selectedValue);
    }

    onRender(){
        console.log("[Settings > Sampling > Sampling Rate] onRender()")
    }

    onUnmount(){
        console.log("[Settings > Sampling > Sampling Rate] onUnmount()")
        //this.tumbler.removeEventListener("select", this.selectHandler);

        this.tumbler.removeEventListener("select", this.selectHandler);
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('SensorSampling');
    }

}
