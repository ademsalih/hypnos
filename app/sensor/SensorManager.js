import Sensor from "./Sensor"
import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";

export class SensorManager {
    SENSORS = []
    _onReadingCallback;

    constructor() {
        const accelerometer = new Accelerometer();
        const hrm = new HeartRateSensor();

        this.SENSORS.push(accelerometer);
        this.SENSORS.push(hrm);
    }

    setOnReadingCallback(f) {
        this._onReadingCallback = f;
    }

    start(sensor) {
        let sensor = this.SENSORS.filter(sensor => sensor[0] == sensor)
        sensor.start();
    }

    stop(sensor) {
        let sensor = this.SENSORS.filter(sensor => sensor[0] == sensor)
        sensor.stop();
    }

    startAllSensors() {
        console.log(`Starting all sensors (${this.SENSORS.length})`)
        this.SENSORS.forEach(sensor => sensor.start())
    }

    stopAllSensors() {
        this.SENSORS.forEach(sensor => sensor.stop())
    }


}