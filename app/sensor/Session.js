export default class Session {
    _session_id;
    _duration;
    _start_time;
    _end_time;
    _sensors = []

    constructor() {
        this._session_id = this.uuidv4();
    }

    getIdentifier() {
        return this._session_id;
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
}