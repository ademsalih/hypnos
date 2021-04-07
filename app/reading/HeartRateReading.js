import { Reading } from "./Reading"

export class HeartRateReading extends Reading {

    constructor(session, bpmReading, timestamp) {
        let data = [
            {
                "type": "BPM",
                "item": bpmReading
            }
        ]
        super(session, "HEARTRATE", data, false, timestamp);
    }

    get() {
        return super.get();
    }

}