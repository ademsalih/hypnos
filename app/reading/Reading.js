export class Reading {
    _sessionIdentifier = '';
    _timeStamp = '';
    _sensorIdentifier = '';
    _data = {};

    constructor(session, sensor, data) {
        this._sessionIdentifier = session;
        this._sensorIdentifier = sensor;
        this._timeStamp = Date.now();
        this._data = data;
    }

    get() {
        return {
            sessionIdentifier: this._sessionIdentifier,
            sensorIdentifier: this._sensorIdentifier,
            timeStamp: this._timeStamp,
            data: this._data
        }
    }

}