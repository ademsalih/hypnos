import { Reading } from "./Reading";

export class AccelerometerReading extends Reading {

    constructor(sessionID, xReading, yReading, zReading) {
        let data = { x: xReading, y: yReading, z: zReading};
        super(sessionID, "ACCELEROMETER", data);
    }

    get() {
        return super.get();
    }

}