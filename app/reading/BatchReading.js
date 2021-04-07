export class BatchReading {
    _sessionIdentifier = '';
    _timestamp = 0;
    _timestamps = [];
    _sensorIdentifier = '';
    _batchReading = true;
    _data = [];

    constructor(session, sensor, data, timestamp, timestamps) {
        this._sessionIdentifier = session;
        this._sensorIdentifier = sensor;
        this._timestamp = timestamp;
        this._timestamps = timestamps;
        this._data = data;
    }

    get() {
        return {
            sessionIdentifier: this._sessionIdentifier,
            sensorIdentifier: this._sensorIdentifier,
            batchReading: this._batchReading,
            timestamp: this._timestamp,
            timestamps: this._timestamps,
            data: this._data
        }
    }
    
}