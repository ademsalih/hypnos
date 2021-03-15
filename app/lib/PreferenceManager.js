import FileHandler from "./FileHandler";
import { SENSOR_DEFINITIONS } from '../sensor/sensorDefinitions';

export class PreferencesManager {

    fHandler = new FileHandler();
    
    preferencesExist() {
        return this.fHandler.fileExists("preferences.json");
    }

    getPreferenceObject() {
        return this.fHandler.readJSONFile("preferences.json");
    }

    createPreferences() {
        this.fHandler.writeJSONFile("preferences.json", { sensorList: []});
        let readSensorList = this.getPreferenceObject().sensorList;

        SENSOR_DEFINITIONS.forEach(element => {
            let sensor = element.sensor;

            if (!readSensorList.some(e => e.sensor === sensor)) {
                let newSensor = {
                    sensor: sensor,
                    displayName: element.displayName,
                    enabled: true,
                    sampling: {
                        element: 2,
                        rate: 1
                    }
                }
                readSensorList.push(newSensor);
            }
        });

        this.fHandler.writeJSONFile("preferences.json", { sensorList: readSensorList});
    }

    createPreferencesIfNotExists() {
        if (!this.preferencesExist()) {
            this.createPreferences();
        }
    }

    getSensor(s) {
        const sensorList = this.getPreferenceObject().sensorList;
        return (sensorList.filter( i => i.sensor == s))[0];
    }

    getSensorStatus(s) {
        const sensor = this.getSensor(s);
        return sensor.enabled;
    }

    setSensorStatus(s, status) {

    }

    getSensorFrequencyFor(s) {
        const sensor = this.getSensor(s);
        const frequency = sensor.sampling.rate;
        
        if (frequency < 1) {
            return parseFloat(frequency, 10);
        } else {
            return parseInt(frequency, 10);
        }
    }

    setSensorFrequencyFor(s) {

    }

}