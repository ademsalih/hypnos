import Sensor from "./Sensor"

import { Accelerometer } from "accelerometer";
import { HeartRateSensor } from "heart-rate";

export class SensorManager {
    SENSORS = []

    constructor() {
        const accelerometer = new Accelerometer();
        const hrm = new HeartRateSensor();

        this.SENSORS.push(accelerometer);
        this.SENSORS.push(hrm);
    }

    start(sensor) {
        let sensor = this.SENSORS.filter(sensor => sensor[0] == sensor)
        sensor.start();
    }

    stop(sensor) {
        let sensor = this.SENSORS.filter(sensor => sensor[0] == sensor)
        sensor.stop();
    }

    startAll() {
        console.log(`Starting all sensors (${this.SENSORS.length})`)
        this.SENSORS.forEach(sensor => sensor.start())
    }

    stopAll() {
        this.SENSORS.forEach(sensor => sensor.stop())
    }


}