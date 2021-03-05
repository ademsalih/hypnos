import { Reading } from "./Reading";

export class BatteryReading extends Reading {

    constructor(sessionID, batteryPercentage) {
        let data = { batteryLevel: batteryPercentage};
        super(sessionID, "BATTERY", data);
    }

    get() {
        return super.get();
    }

}