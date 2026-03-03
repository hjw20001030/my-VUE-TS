import svmmqtt from "@/utils/createdMqttClient";
export default class wave {
    private maxSubPerClient = 30;
    private mqttclient : object = {};
    private mvWaveServiceCode: subscribeType[] = [];
    private mvWaveCallback: Function = undefined;
    public isReConnect: boolean = false;
    constructor() {
        this.createdMQTTClient();
    }
    onmessage(e){
        let topic = e.topic;
        if(topic.includes('mv/wave')){
            if (this.mvWaveCallback !== undefined) {
                this.mvWaveCallback(e.message);
            }
        }
        else if(topic.includes('connect')){
            this.isReConnect = true;
        }
    }

    createdMQTTClient(){
        const mqttclient = new svmmqtt((t)=>{
           this.onmessage(t);
        });
        this.mqttclient[mqttclient.clientId] = mqttclient;
    }

    subscribeMvWave(subscribeData: subscribeType) {
        let isSubscribe = false;
        const {serviceCode,hosId,departmentId} = subscribeData;
        for(let key in this.mqttclient){
            if(this.mqttclient[key].topicCount < this.maxSubPerClient){
                isSubscribe = true;
                this.mqttclient[key].addTopic('/user/'+hosId+'/'+departmentId+'/mv/wave/' + serviceCode);
                this.mvWaveServiceCode.push({
                    ...subscribeData,
                    clientId: key,
                });
            }
        }
        if(!isSubscribe){
            this.createdMQTTClient();
            this.subscribeMvWave(subscribeData);
        }
       
    }

    unsubscribeMvWave(subscribeData: subscribeType) {
        const {serviceCode,hosId,departmentId} = subscribeData;
        for (const element of this.mvWaveServiceCode) {
            if(element.serviceCode === serviceCode){
                this.mqttclient[element.clientId].removeTopic('/user/'+hosId+'/'+departmentId+'/mv/wave/' + serviceCode);
                this.mvWaveServiceCode = this.mvWaveServiceCode.filter((item)=>{
                    return item.serviceCode != serviceCode;
                })
            }
        }
    }

     unsubScribeAllMvWave() {
        const mvWaveServiceCode = JSON.parse(JSON.stringify(this.mvWaveServiceCode));
        for (let item of mvWaveServiceCode) {
            const {serviceCode,hosId,departmentId,clientId} = item;
            this.mqttclient[clientId].removeTopic('/user/'+hosId+'/'+departmentId+'/mv/wave/' + serviceCode);
            this.mvWaveServiceCode = this.mvWaveServiceCode.filter((item)=>{
                return item.serviceCode != serviceCode;
            })
        }
    }
    onMessageMvWave(callback: (data: any) => void) {
        this.mvWaveCallback = callback;
    }
}

export  interface  subscribeType {
    serviceCode: string,
    hosId: string,
    departmentId: string,
    clientId?: string,   
}