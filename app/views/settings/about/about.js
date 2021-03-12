import { Application } from '../../../lib/view';
import { View, $at } from '../../../lib/view'

const $ = $at( '#about' );

export class About extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        console.log("[Settings > About] onMount()")

        let text = $('#about-text');
        text.text = "Hypnos\nVersion 0.7.0\nDeveloped by Adem Salih";
    }

    onRender(){
    }

    onUnmount(){
    }

    // Screens may have they own key handlers.
    onKeyUp(){
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Settings');
    }

}

