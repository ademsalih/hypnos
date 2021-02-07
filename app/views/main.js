import { Application } from '../lib/view';
import { View, $at } from '../lib/view'
import { me } from "appbit";
import * as messaging from "messaging";
import { me as device } from "device";

const $ = $at( '#main' );

export class Main extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        me.appTimeoutEnabled = false;
        const newSessionButton = $( '#newSessionButton' );
        newSessionButton.addEventListener("click", this.sessionButtonClickHandler);

        const settingsButton = $( '#settingsButton' );
        settingsButton.addEventListener("click", this.settingsButtonClickHandler);

        messaging.peerSocket.addEventListener("open", (evt) => {
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                const deviceInfo = {
                    messageType: "deviceInfo",
                    message: {
                        modelName: device.modelName
                    }
                }
                messaging.peerSocket.send(deviceInfo);
              }
        });
    }

    onRender(){
    }

    onUnmount(){
    }

    // Screens may have they own key handlers.
    onKeyUp(){
    }

    sessionButtonClickHandler() {
        Application.switchTo('Session');
    }

    settingsButtonClickHandler() {
        Application.switchTo('Settings');
    }

}





