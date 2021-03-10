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

    writeJSONFile(filename, data) {
        fs.writeFileSync(filename, data, "json");
    }

    readJSONFile(filename) {
        return fs.readFileSync(filename, "json");
    }

    readRawFile(fileName) {
        let file = fs.openSync(fileName, "r")
        let buffer = new ArrayBuffer(this.fileSize(fileName));
        fs.readSync(file, buffer);
        let bytes = new Float64Array(buffer);

        return bytes;
    }

    readFile(fileName) {
        let bytes = this.readRawFile(fileName);

        let s = ""
        for (var i = 0; i < bytes.length; i++) {
            s += bytes[i] + "\n"
        }
        fs.closeSync(file);
        return s;
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

    allFiles() {
        const listDir = listDirSync(this.LOCAL_PATH);
        var files = [];

        let dirIter = null;
        while((dirIter = listDir.next()) && !dirIter.done) {
            files.push(dirIter.value);
        }

        return files;
    }

    deleteFile(fileName) {
        fs.unlinkSync(fileName);
    }
}