import { BatterySensor } from "../virtual/BatterySensor";

export const battery = () => {
    const sensor = new BatterySensor();

    const identifier = "BATTERY";

    const properties = [
        "val"
    ]

    return {
        sensor: sensor,
        identifier: identifier,
        properties: properties
    }
}