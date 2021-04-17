import { Application } from '../../lib/view';
import { View, $at } from '../../lib/view'

const $ = $at( '#settings' );

export class Settings extends View {
    // Root view element used to show/hide the view.
    el = $(); // Extract #screen-1 element.

    onMount(){
        console.log("[Settings] onMount()")
        
        let list = $( '#settings-list' );
        let items = list.getElementsByClassName("settings-tile-list-item");
    
        items.forEach((element, index) => {
            let touch = element.getElementById('settings-touch');
            touch.onclick = () => {
                switch(index) {
                    case 0:
                        Application.switchTo('ToggleSensor');
                        break;
                    case 1:
                        Application.switchTo('SensorSampling');
                        break;
                    default:
                }
            }
        });
    }

    onRender(){
    }

    onUnmount(){
    }

    onKeyBack(e) {
        e.preventDefault();
        Application.switchTo('Main');
    }

}
