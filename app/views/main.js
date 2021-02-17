import { Application } from '../lib/view';
import { View, $at } from '../lib/view'
import { me } from "appbit";
import * as messaging from "messaging";

const $ = $at( '#main' );
var connected = false;

export class Main extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    newSessionButton = $( '#newSessionButton' );
    settingsButton = $( '#settingsButton' );

    onMount(){
        console.log("[Main] onMount()")

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
