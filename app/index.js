import { Application } from './lib/view';

import { Main } from './views/main';
import { Session } from './views/session';
import { Settings } from './views/settings/settings';
import { ToggleSensor } from './views/settings/sensor/toggleSensor';
import { SensorSampling } from './views/settings/sampling/sensorSampling';
import { SamplingTumbler } from './views/settings/sampling/samplingTumbler';
import { About } from './views/settings/about/about';

class MultiScreenApp extends Application {
    /**
     * All screens of the application should be listed here.
     */
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

// Start the application with Main-screen.
MultiScreenApp.start('Main');