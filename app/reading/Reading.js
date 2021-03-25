export class Reading {
    _sessionIdentifier = '';
    _timeStamp = '';
    _batchReading = false;
    _sensorIdentifier = '';
    _data = {};

    constructor(session, sensor, data, batchReading) {
        this._sessionIdentifier = session;
        this._sensorIdentifier = sensor;
        this._timeStamp = Date.now();
        this._batchReading = batchReading;
        this._data = data;
    }

    get() {
        return {
            sessionIdentifier: this._sessionIdentifier,
            sensorIdentifier: this._sensorIdentifier,
            timeStamp: this._timeStamp,
            batchReading: this._batchReading,
            data: this._data
        }
    }

}