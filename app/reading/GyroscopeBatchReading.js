import { BatchReading } from "./BatchReading";

export class GyroscopeBatchReading extends BatchReading {

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
        super(sessionID, "GYROSCOPE", items, timestamp, timestamps);
    }

    get() {
        return super.get();
    }

}