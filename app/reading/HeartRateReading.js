import { Reading } from "./Reading"

export class HeartRateReading extends Reading {

    constructor(session, bpmReading) {
        let data = [
            {
                "type": "BPM",
                "item": bpmReading
            }
        ]
        super(session, "HEARTRATE", data, false);
    }

    get() {
        return super.get();
    }

}