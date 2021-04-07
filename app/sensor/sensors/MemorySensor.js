import { memory } from "system";
import { GenericSensor } from "./GenericSensor";

export class Memory extends GenericSensor {

    getReading() {
        return (memory.js.used/memory.js.total)*100;
    }

}
