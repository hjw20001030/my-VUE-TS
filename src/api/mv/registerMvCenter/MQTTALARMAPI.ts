import svmmqtt from "@/utils/createdMqttClient";
export default class mp {
    private maxSubPerClient = 30;
    private mqttclient : object = {};
    private mvAlarmServiceCode: subscribeType[] = [];
    private mvAlarmCallback: Function = undefined;
    public isReConnect: boolean = false;
    constructor() {
        this.createdMQTTClient();
    }
    onmessage(e){
        let topic = e.topic;
        if(topic.includes('mv/alarm')){
            if (this.mvAlarmCallback !== undefined) {
                this.mvAlarmCallback(e.message);
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

    subscribeMvAlarm(subscribeData: subscribeType) {
        let isSubscribe = false;
        for(let key in this.mqttclient){
            if(this.mqttclient[key].topicCount < this.maxSubPerClient){
                isSubscribe = true;
                this.mqttclient[key].addTopic(this.strPing(subscribeData));
                this.mvAlarmServiceCode.push({
                    ...subscribeData,
                    clientId: key,
                });
            }
        }
        if(!isSubscribe){
            this.createdMQTTClient();
            this.subscribeMvAlarm(subscribeData);
        }
    }

    unsubscribeMvAlarm(subscribeData: subscribeType) {
        const {hosId,departmentId} = subscribeData;
        for (const element of this.mvAlarmServiceCode) {
            if(element.hosId === hosId && departmentId === element.departmentId){
                this.mqttclient[element.clientId].removeTopic(this.strPing(subscribeData));
                this.filterMvAlarmServiceCode(item);
            }
        }
    }

     unsubScribeAllMvAlarm() {
        const mvAlarmServiceCode = JSON.parse(JSON.stringify(this.mvAlarmServiceCode));
        for (let item of mvAlarmServiceCode) {
            const {clientId} = item;
            this.mqttclient[clientId].removeTopic(this.strPing(item));
            this.filterMvAlarmServiceCode(item);
        }
    }

    strPing(item:subscribeType){
        const {serviceCode,hosId,departmentId} = item;
        let str = '/user/'+hosId+'/'+departmentId+'/mv/alarm';
        if(serviceCode) {
            str+='/'+serviceCode;
        }
        return str;
    }
    filterMvAlarmServiceCode(item:subscribeType){
        const {serviceCode,hosId,departmentId} = item;
        this.mvAlarmServiceCode = this.mvAlarmServiceCode.filter((item)=>{
            let isValid = item.hosId != hosId && item.departmentId != departmentId;
            if(serviceCode) isValid = isValid && item.serviceCode != serviceCode;
            return isValid;
        })
    }

    onMessageMvAlarm(callback: (data: any) => void) {
        this.mvAlarmCallback = callback;
    }
}

export  interface  subscribeType {
    serviceCode?: string,
    hosId: string,
    departmentId: string,
    clientId?: string,   
}