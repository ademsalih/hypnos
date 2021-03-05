import { battery } from "power";

export class Battery {
    frequency = 1;
    delay = 1000;
    onreading;
    handler;
    batteryLevel;

    constructor(init) {
        if ("frequency" in init) {
            let frequency = init.frequency;
            this.setFrequency(frequency);
        }
    }
    
    setFrequency(f) {
        this.frequency = f;
        this.delay = 1000/this.frequency;
    }

    start() {
        this.handlerAction();
        this.handler = setInterval( () => {
            this.handlerAction();
        }, this.delay);
    }

    handlerAction() {
        this.batteryLevel = battery.chargeLevel
        this.onreading();
    }

    stop() {
        clearInterval(this.handler);
    }
}
