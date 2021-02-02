import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'

const $ = $at( '#summary' );

export class Summary extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    running = false;

    onMount(){
        let sessionControlButton = $('#summaryOKButton');
        sessionControlButton.addEventListener("click", this.summaryOKButtonHandler);
    }

    onRender(){

    }

    onUnmount(){

    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Main');
    }

    summaryOKButtonHandler() {
        Application.switchTo('Main');
    }

}

