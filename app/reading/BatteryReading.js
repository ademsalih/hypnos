import { Reading } from "./Reading";

export class BatteryReading extends Reading {

    constructor(sessionID, batteryPercentage, timestamp) {
        let data = [
            {
                type: "PERCENT",
                item: batteryPercentage
            }
        ];
        super(sessionID, "BATTERY", data, false, timestamp);
    }

    get() {
        return super.get();
    }

}