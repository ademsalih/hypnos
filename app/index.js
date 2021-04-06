import { Application } from './lib/view';
import { Main } from './views/main';
import { RecordView } from './views/session/recordView';
import { Summary } from './views/session/summary';
import { Settings } from './views/settings/settings';
import { ToggleSensor } from './views/settings/sensor/toggleSensor';
import { SensorSampling } from './views/settings/sampling/sensorSampling';
import { SamplingTumbler } from './views/settings/sampling/samplingTumbler';
import { memory } from "system";

class MultiScreenApp extends Application {
    /**
     * All screens of the application should be listed here.
     */
    screens = {
        Main,
        RecordView,
        Summary,
        Settings,
        ToggleSensor,
        SensorSampling,
        SamplingTumbler
    }
}

/* setInterval(() => {
    console.log(`MEMORY: ${memory.js.used}/65528  ${Math.round( (memory.js.used/65528)*100*10 ) / 10}%`)
}, 1000); */

// Start the application with Main-screen.
MultiScreenApp.start('Main');