import { HeartRateSensor } from "heart-rate";

export const heartrate = () => {
    return {
        sensor: new HeartRateSensor(),
        identifier: "HEARTRATE",
        properties: ["heartRate"]
    }
}