export default class Session {
    _session_id;
    _duration;
    _start_time;
    _end_time;
    _sensors = [];
    constructor() {
        this._session_id = this.uuidv4();
    }
    getIdentifier() {
        return this._session_id;
    }
    uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (16 * Math.random()) | 0,
                    v;
                return ("x" == c ? r : (3 & r) | 8).toString(16);
            }
        );
    }
}