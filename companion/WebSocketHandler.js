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
    _instance;

    constructor(host, port) {
        this._host = host;
        this._port = port;
    }

    start() {
        const uri = `ws://${this._host}:${this._port}/`
        const websocket = new WebSocket(uri);
        
        websocket.addEventListener("open", () => {
            console.log("CONNECTED");
            this._instance = websocket;
        });

        websocket.addEventListener("close", (e) => {
            console.log("DISCONNECTED");
            switch(e.code) {
                case 1000:
			        console.log("WebSocket: closed");
			        break;
		        default:
                    this.reConnect();
			        break;
		    }
        });

        websocket.addEventListener("error", (e) => {
            console.log(e);
        });

        websocket.addEventListener("message", (e) => {
            this.onMessage(e.data);
        })
    }

    reConnect() {
        setTimeout(() => {
            console.log(`Reconnecting in ${this._reConnectDelay} ms...`)
            this.start();
        }, this._reConnectDelay);
    }

    onMessage(message) {
        if (this._onMessageHandler) {
            this._onMessageHandler(message);
        } else {
            console.warn("No onMessage handler set");
        }
    }

    setOnMessage(f) {
        this._onMessageHandler = f;
    }

    send(message) {
        this._instance.send(message);
    }
    
}