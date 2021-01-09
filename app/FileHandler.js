import * as fs from "fs";
import { listDirSync } from "fs";

export default class FileHandler {

    LOCAL_PATH = "/private/data/"

    constructor() {
    }

    fileSize(fileName) {
        let stats = fs.statSync(fileName);
        return stats.size;
    }

    fileLastModified(fileName) {
        let stats = fs.statSync(fileName);
        return stats.mtime;
    }

    fileExists(fileName) {
        let path = `${this.LOCAL_PATH}${fileName}`
        return fs.existsSync(path)
    }
    
    renameFile(oldName, newName) {
        fs.renameSync(oldName, newName);
    }

    writeToFile(fileName, content) {
        fs.writeFileSync(fileName, content, "ascii");
    }

    appendToFile(fileName, buffer) {
        let file = fs.openSync(fileName, "a+");
        fs.writeSync(file, buffer);
        fs.closeSync(file);
    }
    
    deleteAllFiles() {
        const listDir = listDirSync(this.LOCAL_PATH);
        let dirIter = null;
        while((dirIter = listDir.next()) && !dirIter.done) {
            this.deleteFile(dirIter.value);
        }   
    }

    deleteFile(fileName) {
        fs.unlinkSync(fileName);
    }
}