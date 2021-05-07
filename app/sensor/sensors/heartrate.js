import { HeartRateSensor } from "heart-rate";

export const heartrate = () => {
    const sensor = new HeartRateSensor();

    const identifier = "HEARTRATE";

    const properties = [
        "heartRate"
    ]

    return {
        sensor: sensor,
        identifier: identifier,
        properties: properties
    }
}