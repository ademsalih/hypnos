import Reading from "./Reading"

export default class BarometerReading extends Reading {

    constructor(session, pressureReading) {
        let data = {pressure: pressureReading};
        super(session, "BAROMETER", data);
    }

    get() {
        return super.get();
    }
}