//报警弹框
import AlarmNotification from "./AlarmNotification.vue";
import {createApp} from 'vue';
import type { ComponentPublicInstance } from 'vue';
import alarm_I_sec8 from '@/assets/media/alarm_I_sec8.mp3';
import alarm_II_sec5 from '@/assets/media/alarm_II_sec5.mp3';
import alarm_III_sec3 from '@/assets/media/alarm_III_sec3.mp3';
// 报警弹框
let instance: ComponentPublicInstance<any>;
let instances: any[] = [];
let seed = 1;
let alarmLevel1:any = null;
let alarmLevel2:any  = null;
let alarmLevel3:any  = null;
let alarmLevel4:any  = null;
let duration = 3000;

function alarmNotifyOpen(options?: any,isNull?: boolean){
    if(!options['isShowAlarm']) return;
    // 创建挂载点
    const mountPoint = document.createElement('div');
    if(isNull){
        alarmLevel1 = null;
        alarmLevel2 = null;
        alarmLevel3 = null;
        alarmLevel4 = null;
    }
    //来一个顶掉上一个
    if (instance) {
        instance.visible = false;
    }
    document.body.appendChild(mountPoint);
    const app = createApp(AlarmNotification);
    (app as any).id = "alarmNotify" + seed++;
    instance = app.mount(mountPoint);
    (instance as any).visible = true;
    (instance as any).mountPoint = mountPoint;
    (instance as any).info = options.info;
    (instance as any).closeCallback = closeCallback;
    (instance as any).callback = options.callback;
    instances.push(instance);
}
function closeCallback(){
    instance = null;
    if(currentTimes)
    clearTimeout(currentTimes);
    if(alarmLevel1){
        alarmNotifyOpen(alarmLevel1);
        playAudio(alarmLevel1);
        alarmLevel1 = null;
    }else if(alarmLevel2){
        alarmNotifyOpen(alarmLevel2);
        playAudio(alarmLevel2);
        alarmLevel2 = null;
    }else if(alarmLevel3){
        alarmNotifyOpen(alarmLevel3);
        playAudio(alarmLevel3);
        alarmLevel3 = null;
    }else if(alarmLevel4){
        alarmNotifyOpen(alarmLevel4);
        playAudio(alarmLevel4);
        alarmLevel4 = null;
    }
}
function playAudio(options?: Object){
    if(!(options['alarmOverStock'] && document.getElementById('alarmOverStock'))) return;
    switch (options['duration']) {
        case 8000:
        (document.getElementById('alarmOverStock') as any).src = alarm_I_sec8;
        break;
        case 5000:
        (document.getElementById('alarmOverStock') as any).src = alarm_II_sec5;
        break;
        case 3000:
        (document.getElementById('alarmOverStock') as any).src = alarm_III_sec3;
        break;
    }
    (document.getElementById('alarmOverStock') as any).currentTime = 0;
    try{
        (document.getElementById('alarmOverStock') as any).play();
    }catch (error) {
        console.info(error);
    }
}
function setData(str?:number,options?:Object){
    switch (str) {
        case 1:
        alarmLevel1 = options;
        break;
        case 2:
        alarmLevel2 = options;
        break;
        case 3:
        alarmLevel3 = options;
        break;
        case 4:
        alarmLevel4 = options;
        break;
    }
}
let currentTimes:any  = null;
function alarmNotifyZhuan(options?: any,str?:number){
    options['duration'] = duration;
    if(!instance){
        if(options['isShowAlarm'])
        alarmNotifyOpen(options,true);
        playAudio(options);
        return;
    }
    if(instance)
    if(options['info']['alarmLevel'] > instance.info.alarmLevel){
        setData(str,options);
        return;
    }else{
        setData(str,options);
        if(currentTimes)
            clearTimeout(currentTimes);
        currentTimes = setTimeout(() => {
            alarmNotify.close();
        }, 2000);
    }
}
export function alarmNotify(options?: any): void {
    //判断有机械通气报警弹框 就关掉
    if(options['info']?.['alarmLevel'] && options['info']?.['alarmLevel'] !='U'){
        if(options['info']?.['alarmLevel'] == 'H'){
            duration = 8000;
            options['info']['alarmLevel'] = 1;
            alarmNotifyZhuan(options,1);
        }else if(options['info']?.['alarmLevel'] == 'M'){
            duration = 5000;
            options['info']['alarmLevel'] = 2;
            alarmNotifyZhuan(options,2);
        }else if(options['info']?.['alarmLevel'] == 'L'){
            duration = 3000;
            options['info']['alarmLevel'] = 3;
            alarmNotifyZhuan(options,3);
        }
    }else{
        duration = 3000;
        options['info']['alarmLevel'] = 4;
        alarmNotifyZhuan(options,4);
    }
}
alarmNotify.close = function () {
    if (instance) {
        instance.close();
    }
}
alarmNotify.open = function () {
    if (instance) {
        instance.visible = true;
    }
}

export function alarmMvNotify(options?: any): void {
    options['info']['message'] = options['info']['alarmMessage'];
    options['info']['date'] = options['info']['alarmEndDate'];
    alarmNotify(options);
}
alarmMvNotify.close = function () {
    if (instance) {
        instance.close();
    }
}
alarmMvNotify.open = function () {
    if (instance) {
        instance.visible = true;
    }
} 
