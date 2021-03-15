export class BatchReading {
    _sessionIdentifier = '';
    _timeStamp = '';
    _sensorIdentifier = '';
    _items = {};

    constructor(session, sensor, items) {
        this._sessionIdentifier = session;
        this._sensorIdentifier = sensor;
        this._timeStamp = Date.now();
        this._items = items;
    }

    get() {
        return {
            sessionIdentifier: this._sessionIdentifier,
            sensorIdentifier: this._sensorIdentifier,
            timeStamp: this._timeStamp,
            items: this._items
        }
    }

}