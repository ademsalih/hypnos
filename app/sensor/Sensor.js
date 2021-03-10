export default class Sensor {
    _sensor = null;
    _frequency = 1;
    _batchSize = 0;
    _enabled = false;

    constructor(sensor) {
        this._sensor = sensor;
    }

    start() {
        this._enabled = true;
        this._sensor.start();
    }

    stop() {
        this._sensor.stop();
    }

    onNewEvent() {
        
    }

    getFrequency() {
        return this._sensor.frequency;
    }

    setFrequency(f) {
        if (typeof f === 'number') {
            this._frequency = f;
            this._sensor.setOptions({ frequency: this._frequency});        
        } else {
            console.log("ERROR: Frequency must be a number!");
        }
    }

    setBatchSize(b) {
        if (typeof b === 'number') {
            this._batchSize = b;
            this._sensor.setOptions({ batch: this._batchSize});        
        } else {
            console.log("ERROR: Batch size must be a number!");
        }
    }

}
