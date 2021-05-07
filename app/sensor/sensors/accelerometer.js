import { Accelerometer } from "accelerometer";

export const accelerometer = () => {
    const sensor = new Accelerometer();
    const identifier = "ACCELEROMETER";

    return {
        sensor: sensor,
        identifier: identifier
    }
}

