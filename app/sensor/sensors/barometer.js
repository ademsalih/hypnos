import { Barometer } from "barometer";

export const barometer = () => {
    return {
        sensor: new Barometer(),
        identifier: "BAROMETER",
        properties: ["pressure"]
    }
}