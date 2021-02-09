import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'
import * as messaging from "messaging";
import { me as device } from "device";

const $ = $at( '#search' );

export class Search extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        console.log("[Search] onMount()")
        const spinner = $( '#spinner' );
        spinner.state = "enabled";

        const searchText = $( '#searchText' );
        const connectedIcon = $( '#connectedIcon' );

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            console.log("[Search] Looking for phone");
            

            const message = {
                command: "SEARCH",
                data: {
                    modelName: device.modelName
                }
            }

            messaging.peerSocket.send(message);
        }

        messaging.peerSocket.addEventListener("error", (err) => {
            console.error(`Connection error: ${err.code} - ${err.message}`);
        });

        messaging.peerSocket.addEventListener("message", (evt) => {
            let message = evt.data;
            
            switch (message) {
                case "CONNECT":
                    searchText.text = "Connected"
                    searchText.style.fill = "fb-mint";
                    spinner.state = "disabled";
                    spinner.style.display = "none";
                    connectedIcon.style.display = "inline";

                    setTimeout(() => {
                        Application.switchTo('Session');
                    }, 2000);
                    break;
                default:
                    break;
            }
            
        });
    }

    onRender(){
        
    }

    onUnmount(){
        const spinner = $( '#spinner' );
        spinner.state = "disabled";

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            console.log("[Search] Closing search");
            
            const message = {
                command: "STOP_SEARCH"
            }

            messaging.peerSocket.send(message);
        }
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Main');
    }

}