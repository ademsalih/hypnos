import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'
import * as fs from "fs";
import PreferencesManager from '../../../lib/PreferenceManager';

const $ = $at( '#toggleSensor' );

export class ToggleSensor extends View {

    el = $();

    onMount(){
        console.log("[Settings > ToggleSensor] onMount()")

        const pm = new PreferencesManager();
        let sensorList = pm.getSensors()

        console.log(sensorList);
    
        let virtualList = $( '#my-list2' );
        let elementCount = sensorList.length
    
        virtualList.delegate = {
            getTileInfo: function (index) {
                return {
                    type: "my-pool2",
                    value: "Menu item",
                    index: index
                };
            },
            configureTile: function (tile, info) {
                if (info.type == "my-pool2") {
    
                    tile.firstChild.value = sensorList[info.index].enabled ? 1 : 0;
                    tile.firstChild.text = sensorList[info.index].displayName;

                    tile.firstChild.onclick = (evt) => {
                        pm.setSensorStatus(sensorList[info.index].sensor, !sensorList[info.index].enabled)
                    };
                }
            }
        };
    
        virtualList.length = elementCount;
    }

    onRender(){
    }

    onUnmount(){
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Settings');
    }

}
