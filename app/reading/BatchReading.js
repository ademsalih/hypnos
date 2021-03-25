export class BatchReading {
    _sessionIdentifier = '';
    _timeStamps = [];
    _sensorIdentifier = '';
    _batchReading = true;
    _data = [];

    constructor(session, sensor, data, timeStamps) {
        this._sessionIdentifier = session;
        this._sensorIdentifier = sensor;
        this._timeStamps = timeStamps;
        this._data = data;
    }

    get() {
        return {
            sessionIdentifier: this._sessionIdentifier,
            sensorIdentifier: this._sensorIdentifier,
            batchReading: this._batchReading,
            timeStamps: this._timeStamps,
            data: this._data
        }
    }

}