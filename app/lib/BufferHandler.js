import FileHandler from "./FileHandler";

export class BufferHandler {

    _bufferName = '';
    fileHandler = new FileHandler();
    bufferCount = 0;

    constructor() {
    }

    constructor(uuid) {
        this.setBufferName(uuid);
    }

    setBufferName(uuid) {
        let bufferLoc = uuid
        this._bufferName = bufferLoc;
    }

    buffer(data) {
        console.log(`Data: ${JSON.stringify(data)}`)
        let fileName = `${this._bufferName}_${this.bufferCount}.json`;
        this.fileHandler.writeCBORFile(fileName, data);
        this.bufferCount += 1;
    }

    loadBuffer() {
        let bufferFile = this.fileHandler.readJSONFile(this._bufferName);
        console.log(`Buffer: ${bufferFile.buffer}`);

        let buffer = [];

        for (let i = 0; i < this.bufferCount; i++) {
            let temp = this.fileHandler.readCBORFile(`${uuid}_${i}.json`)
            buffer.push(temp);
        }

        return buffer;
    }

    clearBuffer() {

    }
    
}