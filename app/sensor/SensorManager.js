import Sensor from "./Sensor"

export default class SensorManager {
    SENSORS = []

    constructor() {

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