<template>
  <div class="svm_monitor_center_main_wrap">
    <div class="svm_monitor_center_main_content">
      <threeTimesSix ref="threeTimesSixRef"></threeTimesSix>
    </div>
    <div class="svm_mointor_center_footer_wrap flex pl_20 pr_20">
        <div class="left"></div>
        <div class="right flex flex_ac">
            <el-button type="primary" @click="flip('left')" class="svm_mointor_center_footer_prev">
               <i-ep-ArrowLeftBold />
            </el-button>
            <el-button type="primary" @click="flip('right')" class="svm_mointor_center_footer_next">
                 <i-ep-ArrowRightBold />
            </el-button>
            <div class="svm_monitor_center_page_content">第{{currentPage}}/{{totalPage}}页</div>
            <div class="svm_mointor_center_footer_currentTime">{{currentTime}}</div>
        </div>
    </div>
    <audio id="alarmOverStock" ref="alarmOverStock" src="@/assets/media/voice_alarm.mp3"></audio>
    <audio id="alarmOverStockMv" ref="alarmOverStockMv" src="@/assets/media/alarm_sound_vent.mp3"></audio>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/tool';
import { ref, onMounted ,onUnmounted} from 'vue';
import * as IntervalHelp from '@/utils/IntervalHelp';
import MVWSAPIDP from '@/api/mv/registerMvCenter/WSAPI'
import { useUserState } from '@/store/userState';
import threeTimesSix from '@/pages/mv/registerMvCenter/components/threeTimesSix.vue'
import {sueMvCenterState} from '@/store/registerMvCenterState';
import MQTTWAVEAPI from '@/api/mv/registerMvCenter/MQTTWAVEAPI'
import MQTTMPAPI from '@/api/mv/registerMvCenter/MQTTMPAPI'
import MQTTALARMAPI from '@/api/mv/registerMvCenter/MQTTALARMAPI'
import {alarmMvNotify} from '@/pages/mv/registerMvCenter/components/AlarmNotificationMain'
import { storeToRefs } from 'pinia'
const wsAPI = new MVWSAPIDP();
const mqWaveAPI = new MQTTWAVEAPI();
const mqMpAPI = new MQTTMPAPI();
const mqAlarmAPI = new MQTTALARMAPI();
const userState = useUserState();
const mvCenterState = sueMvCenterState();
const currentTime = ref<string | Date>(formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'));
const currentPage = ref<number>(1);
const totalPage = ref<number>(1);
const pageSize = 18;
const hosSelectValue = userState?.userInfo?.staffUnitId;
const departmentSelectValue = userState?.userInfo?.departmentId;
const viewSelectValue:string = "mange";
const {records} = storeToRefs(mvCenterState);
const threeTimesSixRef = ref<any>(null)
onMounted(() => {
    initData();
    mqWaveAPI.unsubScribeAllMvWave();
    mqMpAPI.unsubScribeAllMvMp();
    mqAlarmAPI.unsubScribeAllMvAlarm();
    //websocket 请求回调
    wsAPI.onmessage(data => {
        switch (data.action) {
            case "show2.getMvMonitorView":
                if (data.msg.code === wsAPI.STATUS_CODE.SUCCESS) {
                    if(data.msg.result){
                        
                    }else{
                       
                    }
                }
                break;
            case "show.getMvMonitorRecord":
                if (data.msg.code === wsAPI.STATUS_CODE.SUCCESS) {
                    if (data.msg.result.records === undefined) {
                        data.msg.result.records = [];
                    }
                    if(viewSelectValue != "bed" && ((data.msg.result && data.msg.result.current && data.msg.result.current != currentPage.value) || (data.msg.result && data.msg.result.size && data.msg.result.size != pageSize))){
                        break;
                    }
                    if (
                        data.msg.result.records.length === 0 &&
                        currentPage.value > 1  && (viewSelectValue === 'mange')
                    ) {
                        IntervalHelp.runImmediate("wearMachineRecords");
                    } else {
                        //根据获取到的戴机记录订阅结构化数据
                        for (let [index, record] of data.msg.result.records.entries()) {
                            data.msg.result.records[index]["index"] = index;
                            if (record.alarmEndDate&&record.alarmEndDate !== "") {
                                data.msg.result.records[index]["uncheckedAlarmCount"] = 3;
                                if (records.value.length>0) {
                                    records.value[index]['alarmStartDate']= record.alarmStartDate;
                                    records.value[index]['alarmEndDate']= record.alarmEndDate;
                                    records.value[index]['alarmContent']= record.alarmContent;
                                    records.value[index]['alarmLevel']= record.alarmLevel?record.alarmLevel:'U';
                                    records.value[index]['alarmId']= record.alarmId;
                                    records.value[index]['uncheckedAlarmCount'] = 3;
                                }
                            }else{
                                data.msg.result.records[index]["uncheckedAlarmCount"] = -1;
                                if(records.value.length> 0 && records.value[index].uncheckedAlarmCount !== undefined && records.value[index].uncheckedAlarmCount !== data.msg.result.records[index]["uncheckedAlarmCount"]){
                                    records.value[index].uncheckedAlarmCount = -1;
                                }
                            }
                            data.msg.result.records[index] = {
                                ...record,
                                ...record.hospitalAlarmScope
                            };
                        }
                        let isChange = compareRecords(data.msg.result.records);
                        //根据视图切换
                        if (viewSelectValue === 'mange') {
                            currentPage.value = data.msg.result.current
                            totalPage.value = data.msg.result.pages !== undefined ? data.msg.result.pages : 1;
                        }
                        let recordsCopy = completeRecords(data.msg.result.records);
                        //控制订阅取消与关注
                        if (isChange) {
                            records.value = recordsCopy;
                        }
                    }
                }
                break;
        }
    });

    mqWaveAPI.onMessageMvWave((data)=>{
        threeTimesSixRef.value?.pushMpWaveData(data);
    })
    mqMpAPI.onMessageMvMp((data)=>{
        threeTimesSixRef.value?.pushMvMpData(data);
    });
    mqAlarmAPI.onMessageMvAlarm((data)=>{
        alarmMvNotify({
            info:data,
            isShowAlarm:true,
            alarmOverStock:true,
            callback:()=>{}
        })
    })
    mqAlarmAPI.subscribeMvAlarm({hosId:hosSelectValue,departmentId:departmentSelectValue});
});

onUnmounted(()=>{
    mqWaveAPI.unsubScribeAllMvWave();
    mqMpAPI.unsubScribeAllMvMp();
    mqAlarmAPI.unsubScribeAllMvAlarm();
    records.value = [];
    IntervalHelp.endInterval("wearMachineRecords");
    IntervalHelp.endInterval("currentTime");
    alarmMvNotify.close();
})
/**
 * 控制订阅的取消与订阅
 */
const compareRecords = (newRecords: any[]) => {
    let deleteServiceCode = [];
    let addServiceCode = [];
    for (let record of records.value) {
        let flag = false;
        for (let record2 of newRecords) {
            if (record2.serviceCode === record.serviceCode) {
                flag = true;
            }
        }
        if (!flag && record.serviceCode !== undefined) {
            deleteServiceCode.push(record);
        }
    }
    for (let newRecord of newRecords) {
        let flagTwo = false;
        for (let oldRecord2 of records.value) {
            if (oldRecord2.serviceCode === newRecord.serviceCode) {
                flagTwo = true;
            }
        }
        if (!flagTwo && newRecord.serviceCode !== undefined) {
            addServiceCode.push(newRecord);
        }
    }
    //根据获取的戴机记录判断
    for (let serviceCode of deleteServiceCode) {
        if(serviceCode['unitId'] && serviceCode['hosId']==undefined){
            serviceCode['hosId'] = serviceCode['unitId'];
        }
        if(serviceCode['deptId'] && serviceCode['departmentId']==undefined){
            serviceCode['departmentId'] = serviceCode['deptId'];
        }
        mqWaveAPI.unsubscribeMvWave(serviceCode);
        mqMpAPI.unsubscribeMvMp(serviceCode)
    }
    for (let serviceCode of addServiceCode) {
        if(serviceCode['unitId'] && serviceCode['hosId']==undefined){
            serviceCode['hosId'] = serviceCode['unitId'];
        }
        if(serviceCode['deptId'] && serviceCode['departmentId']==undefined){
            serviceCode['departmentId'] = serviceCode['deptId'];
        }
        let tempSubTimeOut = setTimeout(()=>{
            mqWaveAPI.subscribeMvWave(serviceCode);
            mqMpAPI.subscribeMvMp(serviceCode);
            clearTimeout(tempSubTimeOut);
        },1000)
    }

    if (deleteServiceCode.length == 0 && addServiceCode.length == 0) {
        if(records.value.length==0&&newRecords.length==0){
            return  true;
        }else{
            return false;
        }
    } else {
        return true;
    }
}
const flip = (flag: string) => {
    if (flag == "left" && currentPage.value > 1) {
        currentPage.value = currentPage.value -1;
        IntervalHelp.runImmediate("wearMachineRecords");
    } else if (flag == "right" && currentPage.value < totalPage.value) {
        currentPage.value = currentPage.value + 1
        IntervalHelp.runImmediate("wearMachineRecords");
    }
}
const completeRecords = (records: any[]): any => {
    if (viewSelectValue === 'mange') {
        if (records.length < pageSize) {
            let count = pageSize - records.length;
            for (let i = 0; i < count; i++) {
                records.push({index: records.length + i});
            }
        }
        return records;
    }
}
const initData = () => {
    //开启不断刷新请求床位列表和戴机列表
    if (wsAPI.isConnecting()) {
        //初始化 获取戴机记录
        getWearchineRecord();
    } else {
        wsAPI.onopen(() => {
            //初始化 获取戴机记录
            getWearchineRecord();
        });
    }
}
const getWearchineRecord = () =>{
    if (IntervalHelp.isExistKey("wearMachineRecords")) {
        IntervalHelp.runImmediate("wearMachineRecords");
    } else {
        IntervalHelp.startInterval(
            "wearMachineRecords",
            () => {
                let rqparams: any = {
                    hospitalId: hosSelectValue,
                    departmentId: departmentSelectValue,
                    areaId: -1,
                    $page: currentPage.value,
                    $limit: pageSize,
                    viewType:'MANAGE'
                };
                wsAPI.getDemoMonitorRecord(rqparams);
                let viewType = 'MANAGE';
                if(viewType){
                    let rqparamsNew: any = {
                        departmentId:departmentSelectValue,
                        hospitalId: hosSelectValue,
                        areaId: -1,
                        viewType:viewType,
                    };
                    wsAPI.getMvMonitorView(rqparamsNew);
                }
            },
            5000
        );
    }
}
IntervalHelp.startInterval(
    "currentTime",
    () => {
    currentTime.value = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
    },
    1000
);
</script>

<style scoped lang='scss'>
.svm_monitor_center_main_wrap {
  width: 100%;
  height: 100%;
  .svm_monitor_center_main_content{
    height: calc(100% - 61px);
    width: 100%;
    background-color: #14191e;
  }
  .svm_mointor_center_footer_wrap{
    height: 61px;
    background: #1D2229;
    width: calc(100% - 40px);
    .left{
      height: 100%;
      width: 20%;
    }
    .right{
      height: 100%;
      width: 80%;
      justify-content: end;
      >div{
        margin-left: 10px;
      }
      .svm_mointor_center_footer_prev,.svm_mointor_center_footer_next{
        width: 36px;
        height: 45px;
        background: #191D22;
        border: 1px solid #121212;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 45px;
      }
      .svm_monitor_center_page_content{
        width: 112px;
        height: 45px;
        background: #191D22;
        border: 1px solid #121212;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 45px;
      }
      .svm_mointor_center_footer_currentTime{
        width: 165px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 16px;
        color: #fff;
      }
    }
  }
}
</style>