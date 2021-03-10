import { Application } from '../lib/view';
import { View, $at } from '../lib/view'
import { me } from "appbit";
import * as messaging from "messaging";
import * as fs from "fs";
import { SENSOR_DEFINITIONS } from '../sensor/sensorDefinitions';
import FileHandler from '../lib/FileHandler'

const $ = $at( '#main' );
var connected = false;

export class Main extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    newSessionButton = $( '#newSessionButton' );
    settingsButton = $( '#settingsButton' );

    onMount(){
        console.log("[Main] onMount()")

        let fileHandler = new FileHandler();

        if (!fileHandler.fileExists("preferences.json")) {
            console.log("file doesnt exist")
            fileHandler.writeJSONFile("preferences.json", { sensorList: []});
        } else {
            console.log("file exists")
        }

        let preferencesObject = fileHandler.readJSONFile("preferences.json");
        console.log(JSON.stringify(preferencesObject))
        let readSensorList = preferencesObject.sensorList;

        SENSOR_DEFINITIONS.forEach(element => {
            let sensor = element.sensor;

            if (!readSensorList.some(e => e.sensor === sensor)) {
                let newSensor = {
                    sensor: sensor,
                    identifier: element.displayName,
                    enabled: true,
                    samplingRate: 1
                }

                readSensorList.push(newSensor);
            }
        });

        fileHandler.writeJSONFile("preferences.json", { sensorList: readSensorList});

        me.appTimeoutEnabled = false;
        
        this.newSessionButton.addEventListener("click", this.sessionButtonClickHandler);
        this.settingsButton.addEventListener("click", this.settingsButtonClickHandler);

        messaging.peerSocket.addEventListener("open", (evt) => {
            console.log("Ready!")
        });

        messaging.peerSocket.addEventListener("message", (evt) => {
            console.log(`[Main] Message from Companion: ${evt.data}`)
            let message = evt.data;
            
            switch (message) {
                case "CONNECT": connected = true;
                    break;
                case "DISCONNECT": connected = false;
                    break;
                default:
                    break;
            }
        });
    }

    onRender(){

    }

    onUnmount(){
        const newSessionButton = $( '#newSessionButton' );
        newSessionButton.removeEventListener("click", this.sessionButtonClickHandler);
        
        
        const settingsButton = $( '#settingsButton' );
        settingsButton.removeEventListener("click", this.settingsButtonClickHandler);
    }

    sessionButtonClickHandler() {
        //console.log(`[Main] connected=${connected}`)
        if (connected) {
            Application.switchTo('RecordView');
        } else {
            Application.switchTo('Search');
        }
    }

    settingsButtonClickHandler() {
        Application.switchTo('Settings');
    }

}
