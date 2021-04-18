import PreferencesManager from '../../../lib/PreferenceManager';
import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'

const $ = $at( '#sensorSampling' );

export class SensorSampling extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        console.log("[Settings > Sampling] onMount()")

        const pm = new PreferencesManager();

        let sensorList = pm.getSensors();
    
        const virtualList = $('#settings-sampling-list');
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
                    tile.getElementById("sampling-text-main").text = sensorList[info.index].displayName;
                    tile.getElementById("sampling-text-secondary").text = `${sensorList[info.index].sampling.rate} Hz`;
                }
    
                let touch = tile.getElementById("touch-me");
                touch.onclick = evt => {
                    Application.switchToWithState('SamplingTumbler', {
                        sensor: sensorList[info.index].sensor
                    });
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
