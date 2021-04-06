import FileHandler from '../../../../common/FileHandler';
import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'
import * as fs from "fs";

const $ = $at( '#toggleSensor' );

export class ToggleSensor extends View {

    el = $();

    onMount(){
        console.log("[Settings > ToggleSensor] onMount()")

        let fileHandler = new FileHandler();
        let preferencesObject = fileHandler.readJSONFile("preferences.json");
        let sensorList = preferencesObject.sensorList;

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
                        sensorList[info.index].enabled = !sensorList[info.index].enabled
                        fs.writeFileSync("preferences.json", preferencesObject, "json");
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
