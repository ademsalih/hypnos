import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'
import FileHandler from '../../../lib/FileHandler';

const $ = $at( '#samplingTumbler' );

export class SamplingTumbler extends View {

    el = $();
    tumbler = $('#tumbler');
    fileHandler = new FileHandler();

    onMount(state){
        console.log("[Settings > Sampling > Sampling Rate] onMount()")
        console.log(state.sensor);

        let preferences = this.fileHandler.readJSONFile("preferences.json");
        let sensorList = preferences.sensorList

        const index = sensorList.map(e => e.displayName).indexOf(state.sensor);

        this.tumbler.value = sensorList[index].sampling.element;
        
        this.tumbler.addEventListener("select", () => {
            console.log("selectChanged")
            let selectedIndex = this.tumbler.value;
            let selectedItem = this.tumbler.getElementById("item" + selectedIndex);
            let selectedValue = selectedItem.getElementById("content").text;

            const index = sensorList.map(e => e.displayName).indexOf(state.sensor);

            sensorList[index].sampling.element = selectedIndex;
            sensorList[index].sampling.rate = selectedValue;

            this.fileHandler.writeJSONFile("preferences.json", preferences)
        });
    }

    onRender(){
        console.log("[Settings > Sampling > Sampling Rate] onRender()")
    }

    onUnmount(){
        console.log("[Settings > Sampling > Sampling Rate] onUnmount()")
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('SensorSampling');
    }

    onKeyUp(){
        this.tumbler.value -= 1;
    }

    onKeyDown() {
        this.tumbler.value += 1;
    }

}
