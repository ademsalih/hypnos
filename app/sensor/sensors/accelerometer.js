import { Accelerometer } from "accelerometer";

export const accelerometer = () => {
    return {
        sensor: new Accelerometer(),
        identifier: "ACCELEROMETER",
        properties: ["x","y","z"]
    }
}

