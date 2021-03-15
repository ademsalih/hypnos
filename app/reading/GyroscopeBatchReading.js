import { BatchReading } from "./BatchReading";

export class GyroscopeBatchReading extends BatchReading {

    constructor(sessionID, x_readings, y_readings, z_readings, timestamps) {
        let items = {
            x: x_readings,
            y: y_readings,
            z: z_readings,
            timestamp: timestamps
        }
        super(sessionID, "GYROSCOPE", items);
    }

    get() {
        return super.get();
    }

}