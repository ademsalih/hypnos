import { Application } from '../lib/view';
import { View, $at } from '../lib/view'
import { memory } from "system";

const $ = $at( '#main' );

export class Main extends View {
    el = $();

    connected = false;

    onMount(props){
        console.log("[Main] onMount()");
        console.log(`MEMORY: ${memory.js.used}/65528  ${Math.round( (memory.js.used/65528)*100*10 ) / 10}%`);
        
        if (props) this.connected = props.connected;
        
        const newSessionButton = $( '#newSessionButton' );
        newSessionButton.addEventListener("click", this.sessionButtonClickHandler);

        const settingsButton = $( '#settingsButton' );
        settingsButton.addEventListener("click", this.settingsButtonClickHandler);
    }

    onPropChange(props) {
        this.connected = props.connected;
        this.render();
    }

    onRender(){
        console.log("[Main] onRender()")

        const newSessionButton = $( '#newSessionButton' );
        const mixedtext = $( '#mixedtext' );
        const statusText = mixedtext.getElementById('copy');
        const spinner = $( '#spinner' );
    
        if (this.connected) {
            spinner.state = "disabled";
            spinner.style.display = "none";
            newSessionButton.style.display = "inline";
            statusText.text = "Connected to Nyx"
        } else {
            spinner.state = "enabled";
            spinner.style.display = "inline";
            newSessionButton.style.display = "none";
            statusText.text = "Waiting for Nyx..."
        }
    }

    onUnmount(){
        console.log("[Main] onUnmount()")

        const newSessionButton = $( '#newSessionButton' );
        newSessionButton.removeEventListener("click", this.sessionButtonClickHandler);        
        
        const settingsButton = $( '#settingsButton' );
        settingsButton.removeEventListener("click", this.settingsButtonClickHandler);
    }

    sessionButtonClickHandler = () => {
        if (this.connected) {
            Application.switchTo('RecordView');
        }
    }

    settingsButtonClickHandler = () => {
        Application.switchTo('Settings');
    }

}
