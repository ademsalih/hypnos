import { Reading } from "./Reading";

export class AccelerometerReading extends Reading {
    _timestamp;
    _x;
    _y;
    _z;

    constructor(xReading, yReading, zReading, timestamp) {
        this._timestamp = timestamp;
        this._x = xReading;
        this._y = yReading;
        this._z = zReading;
    }

    get() {
        return {
            timestamp: this._timeStamp,
            x: this._x,
            y: this._y,
            z: this._z
        }
    }

}