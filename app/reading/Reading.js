export class Reading {
    _sessionIdentifier = '';
    _timestamp = '';
    _batchReading = false;
    _sensorIdentifier = '';
    _data = {};

    constructor(session, sensor, data, batchReading, timestamp) {
        this._sessionIdentifier = session;
        this._sensorIdentifier = sensor;
        this._timestamp = timestamp;
        this._batchReading = batchReading;
        this._data = data;
    }

    get() {
        return {
            sessionIdentifier: this._sessionIdentifier,
            sensorIdentifier: this._sensorIdentifier,
            timestamp: this._timestamp,
            batchReading: this._batchReading,
            data: this._data
        }
    }

}