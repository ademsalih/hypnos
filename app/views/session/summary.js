import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'

const $ = $at( '#summary' );

export class Summary extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    sessionControlButton = $('#summaryOKButton');

    onMount(events){
        this.sessionControlButton.addEventListener("click", this.summaryOKButtonHandler);

        let sessionMixedText = $('#sessionMixedText');
        let sessionMixedTextCopy = sessionMixedText.getElementById("copy");
        sessionMixedTextCopy.textLength = 20;
        sessionMixedTextCopy.text = events + " readings";
    }

    onRender(){

    }

    onUnmount(){
        this.sessionControlButton.removeEventListener("click", this.summaryOKButtonHandler);
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Main');
    }

    summaryOKButtonHandler() {
        Application.switchTo('Main');
    }

}

