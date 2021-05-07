import { battery } from "power";
import { GenericSensor } from "./GenericSensor";

export class BatterySensor extends GenericSensor {

    getReading() {
        return battery.chargeLevel;
    }

}
