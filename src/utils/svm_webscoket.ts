import ReconnectingWebSocket from "reconnectingwebsocket";
export default class svmwebscoket {

    private websocket: ReconnectingWebSocket;

    // 0为断开 1为连接
    private connectingState = 0;

    private onOpencallback: any = undefined;
    private onClosecallback: any = undefined;


    private attempSendCount = 10;
    /**
     * 默认系统指令
     */
    private actionObject = {
        "sys.close": (data: any) => {
            this.websocket.close();
            // eslint-disable-next-line
            console.error(data);
        },
        "sys.error": (data: any) => {
            // eslint-disable-next-line
            console.error(data);
        },
        'heart_beat':(_data:any) => {
            this.heartCheck.reset();
        }
    }
    private heartCheck:any = null;
    constructor(url: string) {
        this.websocket = new ReconnectingWebSocket(url, undefined, { automaticOpen: false });
        let selfA = this;
        this.heartCheck = {
            timeout: 50000,//60ms
            serverTimeoutObj: null,
            serverTimeout:null,
            reset: function(){
                clearTimeout(this.serverTimeoutObj);
                this.serverTimeout = setTimeout(_el=>{
                    this.start();
                },this.timeout)
            },
            start: function(){
                var self = this;
                selfA.websocket.send(JSON.stringify({action:'heart_beat',msg:'smo'}));
                self.serverTimeoutObj = setTimeout(function(){
                    selfA.websocket.close();
                }, 60000)
            },
          }
        this.websocket.onopen = (_event:any) => {
            this.connectingState = 1;
            if (this.onOpencallback !== undefined) {
                this.onOpencallback();
                this.heartCheck.start();
            }
        };
        this.websocket.onclose = (_event:any) => {
            this.connectingState = 0;
            if (this.onClosecallback !== undefined) {
                this.onClosecallback();
            }
        }
        this.websocket.open();
    }

    onmessage(callback: (wsData: { action: string, msg: { code: string, msg: string, result: any } }) => void): void {
        let self = this;
        this.websocket.onmessage = onmessage;
        function onmessage(event: any) {
            if (event && event.data !== undefined) {
                let data = JSON.parse(event.data);
                if ((self.actionObject as any)[data.action] !== undefined) {
                    (self.actionObject as any)[data.action](data);
                } else {
                    callback(data)
                }
            }
        }
    } 
    onopen(callback: (event: any) => void) {
        this.onOpencallback = callback;
    }
    onColse(callback: (event: any) => void) {
        this.onClosecallback = callback;
    }
    open() {
        this.websocket.open();
    }
    send(message: any, count?: number) {
        if (this.connectingState === 1) {
            this.websocket.send(JSON.stringify(message));
        } else {
            if (count === undefined) {
                count = 0;
            }
            if (count < this.attempSendCount) {
                count += 1
                this.send(message, count);
            }
        }
    }
    close() {
        this.websocket.close();
    }
    isConnecting() {
        return this.connectingState === 1 ? true : false;
    }
}