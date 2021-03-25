import { BatchReading } from "./BatchReading";

export class AccelerometerBatchReading extends BatchReading {

    constructor(sessionID, x_readings, y_readings, z_readings, timestamps) {
        let items = [
            {
                type: "x",
                items: x_readings
            },
            {
                type: "y",
                items: y_readings
            },
            {
                type: "z",
                items: z_readings
            }
        ]
        super(sessionID, "ACCELEROMETER", items, timestamps);
    }

    get() {
        return super.get();
    }

}