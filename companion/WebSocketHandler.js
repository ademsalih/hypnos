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
    _instance;
    _timeOut;
    _reconenct = true;

    constructor(host, port) {
        this._host = host;
        this._port = port;
    }

    start(inside) {
        const uri = `ws://${this._host}:${this._port}/`
        const websocket = new WebSocket(uri);
        
        websocket.addEventListener("open", () => {
            this._instance = websocket;
            this._onOpenHandler();
            console.log("CONNECTED");
        });

        websocket.addEventListener("close", (e) => {
            console.log("[WebSocketHandler] Close");
            switch(e.code) {
                case 1000:
			        console.log("WebSocket: closed");
			        break;
		        default:
                    console.log("default")
                    this._onCloseHandler();

                    if (inside) {
                        console.log("inside")
                        if (this._reconenct) {
                            console.log("reconnect")
                            this.reConnect();
                        }
                    } else {
                        console.log("outside")
                        this._reconenct = true;
                        this.reConnect();
                    }
			        break;
		    }
        });

        websocket.addEventListener("error", (e) => {
            console.log("[WebSocketHandler] Error");
        });

        websocket.addEventListener("message", (e) => {
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
        this._instance.send(message);
    }

    stop() {
        clearTimeout(this._timeOut);
        this._reconenct = false;
        this._instance = null;
    }
    
}