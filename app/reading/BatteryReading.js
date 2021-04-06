import { Reading } from "./Reading";

export class BatteryReading extends Reading {

    constructor(sessionID, batteryPercentage) {
        let data = [
            {
                type: "PERCENT",
                item: batteryPercentage
            }
        ];
        super(sessionID, "BATTERY", data, false);
    }

    get() {
        return super.get();
    }

}