import svmmqtt from "@/utils/createdMqttClient";
export default class mp {
    private maxSubPerClient = 30;
    private mqttclient : object = {};
    private mvMpServiceCode: subscribeType[] = [];
    private mvMpCallback: Function = undefined;
    public isReConnect: boolean = false;
    constructor() {
        this.createdMQTTClient();
    }
    onmessage(e){
        let topic = e.topic;
        if(topic.includes('mv/mp')){
            if (this.mvMpCallback !== undefined) {
                this.mvMpCallback(e.message);
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

    subscribeMvMp(subscribeData: subscribeType) {
        let isSubscribe = false;
        const {serviceCode,hosId,departmentId} = subscribeData;
        for(let key in this.mqttclient){
            if(this.mqttclient[key].topicCount < this.maxSubPerClient){
                isSubscribe = true;
                this.mqttclient[key].addTopic('/user/'+hosId+'/'+departmentId+'/mv/mp/' + serviceCode);
                this.mvMpServiceCode.push({
                    ...subscribeData,
                    clientId: key,
                });
            }
        }
        if(!isSubscribe){
            this.createdMQTTClient();
            this.subscribeMvMp(subscribeData);
        }
       
    }

    unsubscribeMvMp(subscribeData: subscribeType) {
        const {serviceCode,hosId,departmentId} = subscribeData;
        for (const element of this.mvMpServiceCode) {
            if(element.serviceCode === serviceCode){
                this.mqttclient[element.clientId].removeTopic('/user/'+hosId+'/'+departmentId+'/mv/mp/' + serviceCode);
                this.mvMpServiceCode = this.mvMpServiceCode.filter((item)=>{
                    return item.serviceCode != serviceCode;
                })
            }
        }
    }

     unsubScribeAllMvMp() {
        const mvMpServiceCode = JSON.parse(JSON.stringify(this.mvMpServiceCode));
        for (let item of mvMpServiceCode) {
            const {serviceCode,hosId,departmentId,clientId} = item;
            this.mqttclient[clientId].removeTopic('/user/'+hosId+'/'+departmentId+'/mv/mp/' + serviceCode);
            this.mvMpServiceCode = this.mvMpServiceCode.filter((item)=>{
                return item.serviceCode != serviceCode;
            })
        }
    }
    onMessageMvMp(callback: (data: any) => void) {
        this.mvMpCallback = callback;
    }
}

export  interface  subscribeType {
    serviceCode: string,
    hosId: string,
    departmentId: string,
    clientId?: string,   
}