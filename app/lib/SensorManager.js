import PreferencesManager from './PreferenceManager';
import { SENSORS } from '../sensor/sensorObjects';

export class SensorManager {

    enabledSensors = [];
    onreadingHandler;

    prefManager = new PreferencesManager();

    constructor(handler) {
        SENSORS.forEach((s) => {
            const {sensor, identifier, properties} = s();
            let enabled = this.prefManager.getSensorStatus(identifier);

            if (enabled) {
                const f = this.prefManager.getSensorFrequencyFor(identifier);
                sensor.setOptions({ frequency: f.frequency, batch: f.frequency < 1 ? 1 : Math.round(f.frequency*2) });
                
                sensor.onreading = () => {
                    let data = [sensor.readings.timestamp];

                    properties.forEach((prop) => {
                        data.push(sensor.readings[prop])
                    });

                    handler(identifier, data);
                }
                this.enabledSensors.push(sensor);
            }
        });
    }

    startAllSensors() {
        this.enabledSensors.forEach((s) => {
            s.start();
        });
    }

    stopAllSensors() {
        this.enabledSensors.forEach((s) => {
            s.stop();
            s.onreading = null;
        });
    }

    getEnabledSensors() {
        let enabledSensors = this.prefManager.getSensors().reduce((result, i) => {
            if (i.enabled) {
                result.push({"name": i.sensor, "frequency": i.sampling.rate})
            }
            return result;
        }, []);
        return enabledSensors;
    }

}