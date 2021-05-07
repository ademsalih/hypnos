import { MemorySensor } from "../virtual/MemorySensor";

export const memory = () => {
    return {
        sensor: new MemorySensor(),
        identifier: "MEMORY",
        properties: ["val"]
    }
}