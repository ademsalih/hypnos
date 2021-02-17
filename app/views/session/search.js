import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'
import * as messaging from "messaging";
import { me as device } from "device";

const $ = $at( '#search' );
var connected = false;

export class Search extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    connected = false;
    changeScreen;

    handler = (evt) => {
        console.log(`[Search] Message from Companion: ${evt.data}`)
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

    onMount(){
        console.log("[Search] onMount()")
        messaging.peerSocket.addEventListener("message", this.handler);

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            console.log("[Search] Looking for phone");
            messaging.peerSocket.send({
                command: "SEARCH",
                data: {
                    modelName: device.modelName
                }
            });
        } 
    }

    onRender(){
        console.log("[Search] onRender()")
        const spinner = $( '#spinner' );
        const searchText = $( '#searchText' );
        const connectedIcon = $( '#connectedIcon' );

        if (connected) {
            searchText.text = "Connected"
            searchText.style.fill = "fb-mint";
            spinner.state = "disabled";
            spinner.style.display = "none";
            connectedIcon.style.display = "inline";

            this.changeScreen = setTimeout(() => {
                Application.switchTo('RecordView');
            }, 1500);
        } else {
            clearTimeout(this.changeScreen);
            searchText.text = "Looking for Nyx"
            searchText.style.fill = "fb-white";
            spinner.state = "enabled";
            spinner.style.display = "inline";
            connectedIcon.style.display = "none";
        }
    }

    onUnmount(){
        console.log("[Search] onUnmount()")
        const spinner = $( '#spinner' );
        spinner.state = "disabled";

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            console.log("[Search] Closing search");
            messaging.peerSocket.send({
                command: "STOP_SEARCH"
            });
        }

        //messaging.peerSocket.removeEventListener("message", this.handler);
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Main');
    }

}