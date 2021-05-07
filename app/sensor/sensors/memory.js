import { MemorySensor } from "../virtual/MemorySensor";

export const memory = () => {
    const sensor = new MemorySensor();

    const identifier = "MEMORY";

    const properties = [
        "val"
    ]

    return {
        sensor: sensor,
        identifier: identifier,
        properties: properties
    }
}