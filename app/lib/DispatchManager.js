import { unlinkSync } from "fs";
import { outbox } from "file-transfer";

export default class DispatchManager {

    files = [];
    filesLimit = 40;
    delay = 400;
    firstDelay = 20;
    dispatchRate = 20000;
    dispatchInterval;

    constructor() {

    }

    constructor(init) {
        this.setOptions(init);
    }

    setOptions(init) {
        if ("filesLimit" in init) {
            this.setFilesLimit(init.filesLimit);
        }
        if ("delay" in init) {
            this.setDelay(init.delay);
        }
        if ("firstDelay" in init) {
            this.firstDelay(init.firstDelay);
        }
        if ("dispatchRate" in init) {
            this.setDispatchRate(init.dispatchRate);
        }
    }

    setDelay(delay) {
        this.delay = delay;
    }

    setFirstDelay(firstDelay) {
        this.firstDelay = firstDelay;
    }

    setDispatchRate(dispatchRate) {
        this.dispatchRate = dispatchRate;
    }

    setFilesLimit(filesLimit) {
        this.filesLimit = filesLimit;
    }

    start() {
        this.dispatchInterval = setInterval(() => {
            this.dispatch();
        }, this.dispatchRate);
    }

    stop() {
        clearInterval(this.dispatchInterval);
        this.dispatch();
    }

    addToQueue(fileName) {
        if (this.files.length < this.filesLimit) {
            this.files.push(fileName);
        }
    }

    dispatch() {
        let dispatchQueue = this.files.slice(0, this.files.length);
        this.files = this.files.splice(this.files.length);

        console.log(`Dispatching ${dispatchQueue.length} items...`)
        
        for (let i = 0; i < dispatchQueue.length; i++) {

            setTimeout(() => {
                let path = `/private/data/${dispatchQueue[i]}`;

                outbox.enqueueFile(path).then((ft) => {
                    // Should delete file right away because successfully staged transfers
                    // are stored in same location as our disk cache.
                    unlinkSync(path);

                }).catch((error) => {
                    console.log(`Failed to schedule transfer: ${error}`);

                    outbox.enumerate().then((files) => {
                        console.log(`Files to be sent: ${files.length}`)
                        
                        files.map((file) => {
                            console.log(`name=${file.name} readyState=${file.readyState}`)
                            
                            // If available in the file system, reschedule send
                            if (existsSync(`/private/data/${file.name}`)) {
                                console.log(`File ${file.name} exists on disk, rescheduling...`)
                                this.addToQueue(dispatchQueue[i]);
                            }
                            file.cancel();
                        })
                    })
                })
                
            }, this.delay*i + this.firstDelay);
        }
    }

}