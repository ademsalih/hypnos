import FileHandler from '../../../lib/FileHandler';
import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'

const $ = $at( '#sensorSampling' );

export class SensorSampling extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        console.log("[Settings > Sampling] onMount()")

        let fileHandler = new FileHandler();
        let preferences = fileHandler.readJSONFile("preferences.json");
        let sensorList = preferences.sensorList
    
        let virtualList = $('#settings-sampling-list');
        let elementCount = sensorList.length
    
        virtualList.delegate = {
            getTileInfo: function (index) {
                return {
                    type: "my-pool3",
                    value: "Menu item",
                    index: index
                };
            },
            configureTile: function (tile, info) {
                if (info.type == "my-pool3") {
                    tile.getElementById("sampling-text-main").text = sensorList[info.index].identifier;
                    tile.getElementById("sampling-text-secondary").text = `${sensorList[info.index].samplingRate} Hz`;
                }
    
                let touch = tile.getElementById("touch-me");
                touch.onclick = evt => {
                    Application.switchTo('SamplingTumbler');
                };
            }
        };
    
        virtualList.length = elementCount;
    }

    onRender(){
    }

    onUnmount(){
    }

    onKeyUp(){
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Settings');
    }

}
