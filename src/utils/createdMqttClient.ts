
import  svmmqtt  from '@/utils/MQTTService' ;
import  WebpackWorker  from '@/utils/MQTTService';
export default class MqttAPI {
    private mqttclient: WebpackWorker;
    private messageCallback: Function = undefined;
    private isReConnect: boolean = false;
    public topicCount: number = 0;
    public clientId: string = this.guid();
    constructor(messageCallback: Function) {
        this.messageCallback = messageCallback;
        this.mqttclient = new svmmqtt();
        this.mqttclient.onMessage((e:any) => {
            let topic = e.topic;
            if(topic.includes('connect')){
                this.isReConnect = true;
            }
            if(this.messageCallback){
                this.messageCallback(e);
            }
        })
    }
    guid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
            c
        ) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    addTopic(topic: string,isCall=false){
        if(!isCall){
            this.topicCount++;
        }
        if(this.isReConnect){
            this.mqttclient.subscribe(topic);
        }else{
            setTimeout(()=>{
                this.addTopic(topic,true);
            },500);
        }
    }

    removeTopic(topic: string,isCall=false){
        if(!isCall){
            this.topicCount--;
        }
        if(this.isReConnect){
            this.mqttclient.unsubscribe(topic);
        }else{
            setTimeout(()=>{
                this.addTopic(topic,true);
            },500);
        }
    }
}