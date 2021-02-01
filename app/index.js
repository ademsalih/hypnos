import document from "document";
import { Application } from './lib/view';

import { Main } from './views/main';
import { Session } from './views/session';
import { Settings } from './views/settings/settings';
import { ToggleSensor } from './views/settings/sensor/toggleSensor';
import { SensorSampling } from './views/settings/sampling/sensorSampling';
import { SamplingTumbler } from './views/settings/sampling/samplingTumbler';
import { About } from './views/settings/about/about';

class MultiScreenApp extends Application {
    // List all screens
    screens = {
        Main,
        Session,
        Settings,
        ToggleSensor,
        SensorSampling,
        SamplingTumbler,
        About
    }
}

// Start the application with Screen1.
MultiScreenApp.start('Main');