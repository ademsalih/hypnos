import { Gyroscope } from "gyroscope"

export const gyroscope = () => {
    const sensor = new Gyroscope();
    const identifier = "GYROSCOPE";

    return {
        sensor: sensor,
        identifier: identifier
    }
}

