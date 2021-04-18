import { existsSync, writeFileSync, readFileSync } from "fs";

export default class PreferencesManager {

    getPreferenceObject() {
        return readFileSync("preferences.json", "json");
    }

    getSensors() {
        if (existsSync("/private/data/preferences.json")) {
            return this.getPreferenceObject().sensorList;
        }
        return [];
    }

    createPreferencesIfNotExists() {
        if (!existsSync("/private/data/preferences.json")) {
            const sensorDefLoader = () => import("../sensor/sensorDefinitions");
            sensorDefLoader().then((module) => {
                const { SENSOR_DEFINITIONS } = module;
                let readSensorList = []
                SENSOR_DEFINITIONS.forEach(i => {
                    readSensorList.push({
                        sensor: i.sensor,
                        displayName: i.displayName,
                        enabled: true,
                        sampling: {
                            element: 2,
                            rate: 1
                        }
                    });
                });
                writeFileSync("preferences.json", { sensorList: readSensorList}, "json");
            }).catch((e) => {
                console.log(`Something bad happened, could load sensor list: ${e}`)
            });
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

        writeFileSync("preferences.json", { sensorList: sensorList}, "json");
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

        writeFileSync("preferences.json", { sensorList: sensorList}, "json");
    }

}