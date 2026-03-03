import mqtt ,{MqttClient} from 'mqtt'
import CryptoJS from 'crypto-js';
import env from '../../env';

class MQTTService {
    private client: MqttClient | null = null;

    private accessKey = 'XXX';
    private secretKey = 'XXX';

    private clientId = '';


    private instanceId = 'XXX';

    private topic = env === "prod" ? "XXX" : "XX x";

    private messageCallback:Function;

    guid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
            c
        ) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

     constructor() {
        let groupId = env === "prod" ? "XXX" : "XXX";
        this.clientId = groupId + '@@@' + this.guid();
        let username = 'Signature|' + this.accessKey + '|' + this.instanceId;
        let password = CryptoJS.HmacSHA1(this.clientId, this.secretKey).toString(CryptoJS.enc.Base64);
        let option = {
            'username': username,
            'password': password,
            'clientId': this.clientId,
            'clean': true,
            'keepalive': 90,
            'connectTimeout': 3000,
            "reconnectPeriod": 1000
        }
        this.client = mqtt.connect('wss://XXX.com', option);
        this.client.on('message', (topic, message, _packet) => {
            if(this.messageCallback) {
                this.messageCallback({
                    topic: topic,
                    message: JSON.parse(message.toString())
                })
            }
        })
        this.client.on('connect', () => {
            console.log('MQTT connected')
            if(this.messageCallback){
                this.messageCallback({
                    topic: "topic/connect",
                    message: ""
                });
            }
        })

        this.client.on('error', (err) => {
            console.error('MQTT error:', err)
        })
    }
    public subscribe(topic: string): void {
        if (!this.client) {
        throw new Error('MQTT client not connected')
        }
        this.client.subscribe(this.topic+topic, (_err) => {})
    }
    public unsubscribe(topic: string): void {
        if (!this.client) {
        throw new Error('MQTT client not connected')
        }
        this.client.unsubscribe(this.topic+topic, (_err) => {})
    }

    public onMessage(messageCallback:() => void){
        this.messageCallback = messageCallback;
    }

    public disconnect(): void {
        if (this.client) {
            this.client.end()
            this.client = null
        }
    }

}

export default MQTTService