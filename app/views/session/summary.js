import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'

const $ = $at( '#summary' );

export class Summary extends View {

    el = $();

    onMount(events){
        const sessionControlButton = $('#summaryOKButton');
        sessionControlButton.addEventListener("click", () => {
            Application.switchTo('Main');
        });

        const sessionMixedText = $('#sessionMixedText')
        const sessionMixedTextCopy = sessionMixedText.getElementById("copy");
        sessionMixedTextCopy.text = (events || 0) + " readings";
    }

    onRender(){

    }

    onUnmount(){
        const sessionControlButton = $('#summaryOKButton');
        sessionControlButton.onclick = null;
    }

    onKeyBack(e) {
        e.preventDefault();
    }

}
