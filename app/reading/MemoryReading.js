import { Reading } from "./Reading";

export class MemoryReading extends Reading {

    constructor(sessionID, memoryUsedPercentage, timestamp) {
        let data = [
            {
                type: "PERCENTAGE",
                item: memoryUsedPercentage
            }
        ];
        super(sessionID, "MEMORY", data, false, timestamp);
    }

    get() {
        return super.get();
    }

}