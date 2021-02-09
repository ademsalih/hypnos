import { Application } from '../lib/view';
import { View, $at } from '../lib/view'
import { me } from "appbit";
import * as messaging from "messaging";

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
            console.log("Ready!")
        });
    }

    onRender(){
    }

    onUnmount(){
    }

    sessionButtonClickHandler() {
        Application.switchTo('Search');
    }

    settingsButtonClickHandler() {
        Application.switchTo('Settings');
    }

}





