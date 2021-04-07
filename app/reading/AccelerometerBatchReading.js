import { BatchReading } from "./BatchReading";

export class AccelerometerBatchReading extends BatchReading {

    constructor(sessionID, x_readings, y_readings, z_readings, timestamp, timestamps) {
        let items = [
            {
                type: "X",
                items: x_readings
            },
            {
                type: "Y",
                items: y_readings
            },
            {
                type: "Z",
                items: z_readings
            }
        ]
        super(sessionID, "ACCELEROMETER", items, timestamp, timestamps);
    }

    get() {
        return super.get();
    }

}