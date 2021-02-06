export class WebSocketHandler {

    reConnectDelay = 10000;

    constructor(host, port) {
        this._host = host;
        this._port = port;
    }

    start() {
        const uri = `ws://${this._host}:${this._port}/`
        const websocket = new WebSocket(uri);
        
        websocket.addEventListener("open", () => {
            console.log("CONNECTED");
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
            console.log(e.code);
        });
    }

    reConnect() {
        setTimeout(() => {
            console.log(`Reconnecting after ${this.reConnectDelay} ms...`)
            this.start();
        }, this.reConnectDelay);
    }
    
}