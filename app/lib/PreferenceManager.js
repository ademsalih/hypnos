import FileHandler from "../../common/FileHandler";
import { SENSOR_DEFINITIONS } from '../sensor/SensorDefinitions';

export class PreferencesManager {

    fHandler = new FileHandler();
    
    preferencesExist() {
        return this.fHandler.fileExists("preferences.json");
    }

    getPreferenceObject() {
        return this.fHandler.readJSONFile("preferences.json");
    }

    getSensors() {
        if (this.fHandler.fileExists("preferences.json")) {
            return this.getPreferenceObject().sensorList;
        }
        return [];
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

        this.fHandler.writeJSONFile("preferences.json", { sensorList: readSensorList });
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

    setSensorStatus(sensor, status) {
        const sensorList = this.getSensors();
        const index = sensorList.map(e => e.sensor).indexOf(sensor);

        sensorList[index].enabled = status;

        this.fHandler.writeJSONFile("preferences.json", { sensorList: sensorList });
    }

    getSensorFrequencyFor(s) {
        const sensor = this.getSensor(s);
        let frequency = sensor.sampling.rate;
        
        if (frequency < 1) {
            frequency = parseFloat(frequency, 10);
        } else {
            frequency = parseInt(frequency, 10);
        }

        return {
            frequency: frequency,
            element: sensor.sampling.element
        }
    }

    setSensorFrequencyFor(sensor, selectedIndex, selectedValue) {
        const sensorList = this.getSensors();
        const index = sensorList.map(e => e.sensor).indexOf(sensor);

        sensorList[index].sampling.element = selectedIndex;
        sensorList[index].sampling.rate = selectedValue;

        this.fHandler.writeJSONFile("preferences.json", { sensorList: sensorList });
    }

}