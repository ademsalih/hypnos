export class GenericSensor {

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
    val;

    /**
     * Dictionary that contains battery readings and timestamps.
     */
    readings = {
        val: [],
        timestamp: []
    };

    /**
     * Temp array for keeping reading until next onreading
     * handler is called.
     */
    buffer = [];

    timestampBuffer = [];

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

    /**
     * Default constructor if not options are passed. Frequency of 1
     * and batch readings disabled.
     */
    constructor() {
    }

    /**
     * Initialize sensor with a dictionary containing Number values
     * for frequency, batch or both.
     */
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
    }
    
    setFrequency(f) {
        this.frequency = f;
        this.delay = 1000/f;
    }

    start() {
        this.newReadingHandler();
        this.handler = setInterval(() => {
            this.newReadingHandler();
        }, this.delay);
    }

    newReadingHandler() {
        const { value, timestamp } = this.getReadingWithTimestamp();
       
        if (this.batch) {
            this.buffer.push(value);
            this.timestampBuffer.push(timestamp);

            if (this.buffer.length > this.batchSize) {
                this.readings.val = this.buffer.slice(0,this.batchSize);
                this.buffer = this.buffer.splice(this.batchSize);

                this.readings.timestamp = this.timestampBuffer.slice(0,this.batchSize);
                this.timestampBuffer = this.timestampBuffer.splice(this.batchSize);

                this.onreading();
            } else {
                this.val = value;
                this.timestamp = timestamp;
            }
        } else {
            this.val = value;
            this.timestamp = timestamp;
            this.onreading();
        }
    }

    stop() {
        clearInterval(this.handler);
    }

    getReadingWithTimestamp() {
        return {
            value: this.getReading(),
            timestamp: Date.now()
        }
    }

    getReading() {
        return 0;
    }

}
