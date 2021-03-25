import { Application } from '../lib/view';
import { View, $at } from '../lib/view'
import { me } from "appbit";
import * as messaging from "messaging";
import { PreferencesManager } from '../lib/PreferenceManager';
import { me as device } from "device";
import * as cbor from "cbor";
//import { memory } from "system";

const $ = $at( '#main' );
var connected = false;

export class Main extends View {
    el = $();

    onMount(){
        console.log("[Main] onMount()");
        me.appTimeoutEnabled = false;

        const pm = new PreferencesManager();
        pm.createPreferencesIfNotExists();
        
        const newSessionButton = $( '#newSessionButton' );
        newSessionButton.addEventListener("click", this.sessionButtonClickHandler);

        const settingsButton = $( '#settingsButton' );
        settingsButton.addEventListener("click", this.settingsButtonClickHandler);

        messaging.peerSocket.addEventListener("open", (evt) => {
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                console.log("[Search] Looking for phone");
                let data = cbor.encode({
                    command: "SEARCH",
                    data: {
                        modelName: device.modelName
                    }
                });
                messaging.peerSocket.send(data);
            }
        });

        messaging.peerSocket.addEventListener("message", this.handler);
    }

    onRender(){
        console.log("[Main] onRender()")
        const spinner = $( '#spinner' );
        const newSessionButton = $( '#newSessionButton' );
        const mixedtext = $( '#mixedtext' );
        const statusText = mixedtext.getElementById('copy');

        if (connected) {
            spinner.state = "disabled";
            spinner.style.display = "none";
            newSessionButton.style.display = "inline";
            statusText.text = "Connected to Nyx"
        } else {
            spinner.state = "enabled";
            spinner.style.display = "inline";
            newSessionButton.style.display = "none";
            statusText.text = "Waiting for Nyx..."
        }
    }

    onUnmount(){
        const newSessionButton = $( '#newSessionButton' );
        newSessionButton.removeEventListener("click", this.sessionButtonClickHandler);
        
        const settingsButton = $( '#settingsButton' );
        settingsButton.removeEventListener("click", this.settingsButtonClickHandler);

        messaging.peerSocket.removeEventListener("message", this.handler);
    }

    handler = (evt) => {
        console.log(`[Main] Message from Companion: ${evt.data}`)
        let message = evt.data;
        
        switch (message) {
            case "CONNECT":
                if (!connected) {
                    connected = true;
                    this.render();
                }
                break;
            case "DISCONNECT":
                if (connected) {
                    connected = false;
                    this.render()
                }
                break;
            default:
                break;
        }
    }

    sessionButtonClickHandler() {
        if (connected) {
            Application.switchTo('RecordView');
        }
    }

    settingsButtonClickHandler() {
        Application.switchTo('Settings');
    }

    onKeyUp() {
        this.sessionButtonClickHandler();
    }

    onKeyDown() {
        this.settingsButtonClickHandler();
    }

}
