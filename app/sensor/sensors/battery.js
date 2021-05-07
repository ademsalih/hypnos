import { BatterySensor } from "../virtual/BatterySensor";

export const battery = () => {
    return {
        sensor: new BatterySensor(),
        identifier: "BATTERY",
        properties: ["val"]
    }
}