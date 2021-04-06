import { battery } from "power";

export class Battery {

    /**
     * Frequency of the readings from Battery sensor.
     */
    frequency = 1;

    /**
     * Delay between each reading. Delay is calculated
     * automatically based on frequency that is set.
     */
    delay = 1000;

    /**
     * Delay for each call to onreading method specified.
     * If frequency is the same as batch count, handlerDelay
     * is identical to delay.
     */
    handlerDelay = 1000;

    /**
     * The event handler method called when a new reading
     * or batch is available.
     */
    onreading;

    /**
     * Internal handler for each reading from the virtual
     * battery sensor.
     */
    handler;

    /**
     * Variable for accessing readings from the sensor. The
     * value is Number if readings are not batched and Array
     * if batched.
     */
    pct;

    /**
     * Dictionary that contains battery readings and timestamps.
     */
    readings = {
        pct: [],
        timestamp: []
    };

    /**
     * Temp array for keeping reading until next onreading
     * handler is called.
     */
    buffer = [];

    /**
     * If batch is true, readings will be called
     */
    batch = false;

    /**
     * The size of the batch. The handler is only called
     * if the buffer Array size is larger than this value.
     */
    batchSize = 1;

    /**
     * The timestamp is either a Number or if readings are batched,
     * an Array of Number values.
     */
    timestamp;

    constructor() {
        
    }

    constructor(init) {
        this.setOptions(init);
    }

    setOptions(init) {
        if ("batch" in init) {
            this.setBatch(init.batch);
        }

        if ("frequency" in init) {
            this.setFrequency(init.frequency);
        }
    }

    setBatch(b) {
        this.batch = true;
        this.batchSize = b;
        //this.delay = b/this.frequency;
    }
    
    setFrequency(f) {
        this.frequency = f;
        this.delay = 1000/f;
    }

    start() {
        this.handlerAction();
        this.handler = setInterval(() => {
            this.handlerAction();
        }, this.delay);
    }

    handlerAction() {
        let latestValue = this.getValue();
       
        if (this.batch) {
            this.buffer.push(latestValue)

            if (this.buffer.length > this.batchSize) {
                this.readings.pct = this.buffer.slice(0,this.batchSize);
                this.buffer = this.buffer.splice(this.batchSize);
                this.onreading();
            } else {
                this.pct = latestValue;
            }
        } else {
            this.pct = latestValue;
            this.onreading();
        }
    }

    stop() {
        clearInterval(this.handler);
    }

    getValue() {
        return battery.chargeLevel;
    }
}
