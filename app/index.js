import { Application } from './lib/view';
import { Main } from './views/main';
import { RecordView } from './views/session/recordView';
import { Summary } from './views/session/summary';
import { Settings } from './views/settings/settings';
import { ToggleSensor } from './views/settings/sensor/toggleSensor';
import { SensorSampling } from './views/settings/sampling/sensorSampling';
import { SamplingTumbler } from './views/settings/sampling/samplingTumbler';

import { memory } from "system";
import * as messaging from "messaging";
import * as cbor from "cbor";
import { me as device } from "device";
import { me } from "appbit";
import PreferencesManager from './lib/PreferenceManager';


class MultiScreenApp extends Application {

    screens = {
        Main,
        RecordView,
        Summary,
        Settings,
        ToggleSensor,
        SensorSampling,
        SamplingTumbler
    }

    props = {
        connected: false
    }

    init() {
        me.appTimeoutEnabled = false;

        PreferencesManager.createPreferencesIfNotExists();

        messaging.peerSocket.addEventListener("open", (evt) => {
            if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                let data = cbor.encode({
                    command: "START_SEARCH",
                    data: {
                        modelName: device.modelName
                    }
                });
                messaging.peerSocket.send(data);
            }
        });

        messaging.peerSocket.addEventListener("message", (evt) => {
            switch (evt.data) {
                case "CONNECT":
                    this.props.connected = true;
                    break;
                case "DISCONNECT":
                    this.props.connected = false;
                    break;
                default:
                    break;
            }
            this.onPropChange(this.props);
        });
    }

}

setInterval(() => {
    const used = memory.js.used;
    
    const data = `MEMORY: ${used}/65528  ${Math.round( (used/65528)*100*10 ) / 10}%`;
    if (used > (65528*0.95)) {
        console.error(data);
    } else if (used > (65528*0.90)) {
        console.warn(data);
    } else {
        console.log(data);
    }
}, 1000);

// Start the application with Main-screen.
MultiScreenApp.start('Main');