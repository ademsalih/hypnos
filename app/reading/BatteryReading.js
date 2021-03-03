import { Reading } from "./Reading";

export class BatteryReadings extends Reading {

    constructor(sessionID, batteryPercentage) {
        let data = { percentage: batteryPercentage};
        super(sessionID, "BATTERY", data);
    }

    get() {
        return super.get();
    }

}