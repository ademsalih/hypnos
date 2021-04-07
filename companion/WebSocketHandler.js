/**
 * A class that augments the WebSocket API for additional functionality
 * such as automatic reconnection.
 */

export class WebSocketHandler {

    /**
     * If the server is unavailable, the client should attempt to reconnect
     * every _reConnectDelay milliseconds.
     */
    _reConnectDelay = 1000;
    _onMessageHandler;
    _onOpenHandler;
    _onCloseHandler;
    _timeOut;
    _reconnect = true;

    constructor(host, port) {
        this._host = host;
        this._port = port;
    }

    start(inside) {
        const uri = `ws://${this._host}:${this._port}/`
        this.websocket = new WebSocket(uri);


        this.websocket.addEventListener("open", () => {
            console.log("[WebSocketHandler] onOpen()")
            this._onOpenHandler();
            console.log("CONNECTED");
        });

        this.websocket.addEventListener("close", (e) => {
            console.log(`[WebSocketHandler] Close, code: ${e.code} ${e.reason}`);
            this._onCloseHandler();

            switch (e.code) {
                case 1000:
                    break;
                default:
                    if (inside) {
                        console.log("inside")
                        if (this._reconnect) {
                            console.log("reconnect")
                            this.reConnect();
                        }
                    } else {
                        console.log("outside")
                        this._reconnect = true;
                        this.reConnect();
                    }
                    break;
            }

        });

        this.websocket.addEventListener("error", (e) => {
            console.log(`[WebSocketHandler] Error: ${e.data}`);
        });

        this.websocket.addEventListener("message", (e) => {
            this.onMessage(e.data);
        })
    }

    reConnect() {
        this._timeOut = setTimeout(() => {
            console.log(`Reconnecting in ${this._reConnectDelay} ms...`)
            this.start(true);
        }, this._reConnectDelay);
    }

    onMessage(message) {
        if (this._onMessageHandler) {
            this._onMessageHandler(message);
        } else {
            console.warn("[WebSocketHandler] No onMessage handler set");
        }
    }

    setOnMessage(f) {
        this._onMessageHandler = f;
    }

    onOpen() {
        if (this._onOpenHandler) {
            this._onOpenHandler();
        } else {
            console.warn("[WebSocketHandler] No onOpen handler set");
        }
    }

    setOnOpen(f) {
        this._onOpenHandler = f;
    }

    onClose() {
        if (this._onCloseHandler) {
            this._onCloseHandler();
        } else {
            console.warn("[WebSocketHandler] No onClose handler set");
        }
    }

    setOnClose(f) {
        this._onCloseHandler = f;
    }

    send(message) {
        if (this.websocket) {
            this.websocket.send(message);
        } else {
            console.log("[WebSocketHandler] websocket instace is null")
        }
    }

    stop() {
        clearTimeout(this._timeOut);
        this._reconnect = false;
    }

    getBufferedAmount() {
        return this.websocket.bufferedAmount;
    }
    
    connectionOpen() {
        return this.websocket.readyState === WebSocket.OPEN;
    }
}