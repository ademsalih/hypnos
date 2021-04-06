export class BatchReading {
    _sessionIdentifier = '';
    _timeStamp = 0;
    _timeStamps = [];
    _sensorIdentifier = '';
    _batchReading = true;
    _data = [];

    constructor(session, sensor, data, timeStamp, timeStamps) {
        this._sessionIdentifier = session;
        this._sensorIdentifier = sensor;
        this._timeStamp = timeStamp;
        this._timeStamps = timeStamps;
        this._data = data;
    }

    get() {
        return {
            sessionIdentifier: this._sessionIdentifier,
            sensorIdentifier: this._sensorIdentifier,
            batchReading: this._batchReading,
            timeStamp: this._timeStamp,
            timeStamps: this._timeStamps,
            data: this._data
        }
    }
    
}