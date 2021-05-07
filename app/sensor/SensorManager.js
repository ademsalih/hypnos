import { accelerometer } from './sensors/accelerometer';
import { gyroscope } from './sensors/gyroscope';

export class SensorManager {
    SENSORS = [accelerometer, gyroscope];

    constructor() {

    }

    startAllSensors() {
        this.SENSORS.forEach(sensor => sensor.start())
    }

    stopAllSensors() {
        this.SENSORS.forEach(sensor => sensor.stop())
    }


}