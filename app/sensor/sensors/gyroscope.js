import { Gyroscope } from "gyroscope"

export const gyroscope = () => {
    return {
        sensor: new Gyroscope(),
        identifier: "GYROSCOPE",
        properties: ["x","y","z"]
    }
}

