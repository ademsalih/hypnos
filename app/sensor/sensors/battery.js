import { battery } from "power";
import { GenericSensor } from "./GenericSensor";

export class Battery extends GenericSensor {

    getReading() {
        return battery.chargeLevel;
    }

}
