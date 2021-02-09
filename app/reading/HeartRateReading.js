import { Reading } from "./Reading"

export class HeartRateReading extends Reading {

    constructor(session, bpmReading) {
        let data = {bpm: bpmReading}
        super(session, "HEARTRATE", data);
    }

    get() {
        return super.get();
    }

}