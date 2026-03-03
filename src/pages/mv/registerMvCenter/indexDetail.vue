<template>
  <div class="svm_monitor_center_detail_wrap" ref="wrapRef">
     <div class="svm_monitor_center_detail_title flex flex_ac flex_jb" ref="detail_titleRef">
        <div>
            <i class="iconfont icon_back" @click="goToMain" style="cursor: pointer"/>
            <span style="color: #44A6EB">{{fillBedDisplay(record?record.bedNo:"-")}}</span>
            <span>{{fillDisplay(record?record.custName:"-")}}</span>
            <span>{{fillDisplay(record?displaySex(record.genderAttr,record.unitId):"-")}}</span>
            <span>{{fillDisplay(record?displayAge(record.age,record.unitId):"-")}}岁</span>
            <span>医院：{{fillDisplay(record?record.unitName:"-")}}</span>
            <span>科室：{{fillDisplay(record?record.deptName:"-")}}</span>
            <span>病区：{{fillDisplay(record?record.areaName:"-")}}</span>
        </div>
        <div>
            <span class="span_nth3">监护开始时间：{{fillDisplay(record?record.monitorStartDate:"-")}}</span>
            <span class="span_nth4">
                监护时长：{{fillDisplay(monitorTime)}}
            </span>
            <el-button type="primary" @click="dialogVisible=true">患者详情</el-button>
        </div>
    </div>
    <div class="svm_monitor_center_detail_middle" ref="detail_middleRef">
        <mvDetail ref="mvDetailRef" ></mvDetail>
    </div>
    <div class="svm_monitor_center_detail_footer flex pl_20 pr_20" ref="detail_footerRef">
        <div class="left">
            <AlarmDetail ref="AlarmDetailRef"></AlarmDetail>
        </div>
        <div class="right flex flex_ac">
            <el-button type="primary" @click="flip('left')" class="svm_mointor_center_footer_prev">
               <i-ep-ArrowLeftBold />
            </el-button>
            <el-button type="primary" @click="flip('right')" class="svm_mointor_center_footer_next">
                 <i-ep-ArrowRightBold />
            </el-button>
            <div class="svm_mointor_center_footer_currentTime">{{currentTime}}</div>
        </div>
    </div>

    <el-dialog
        v-model="dialogVisible"
        title="患者详情"
    >
    <div>患者姓名：{{fillDisplay(record.custName)}}</div>
    <div>性别：{{fillDisplay(displaySex(record.genderAttr,record.unitId))}}</div>
    <div>出生日期：{{fillDisplay(record.birthday)}}</div>
    <div>{{fillDisplay(record.certiTypeAttr)}}：{{fillDisplay(record.certiNumber)}}</div>
    <div>医院：{{fillDisplay(record.unitName)}}</div>
    <div>科室：{{fillDisplay(record.deptName)}}</div>
    <div>病区：{{fillDisplay(record.areaName)}}</div>
    <div>床位号：{{fillDisplay(record.bedNo)}}</div>
    <div>设备号：{{fillDisplay(record.extInstCode)}}</div>
    <div>责任医生：{{fillDisplay(record.bedDoctorName)}}</div>
    <div>责任护士：{{fillDisplay(record.bedNurseName)}}</div>
    <div>主诉：{{fillDisplay(record.chiefComplaint)}}</div>
    <div>临床诊断：{{fillDisplay(record.clinicalDiagnosis)}}</div>
    <div><el-button type="primary" @click="dialogVisible=false">确定</el-button></div>
    </el-dialog>
  </div>
</template>

<script lang='ts' setup>
import {ref,onMounted, h,nextTick,onUnmounted} from 'vue'
import * as IntervalHelp from '@/utils/IntervalHelp';
import {fillDisplay,displaySex,displayAge,fillBedDisplay,formatDate,setParameters} from '@/utils/tool'
import { useRouter,useRoute } from 'vue-router';
import {getMonitorApi} from '@/api/mv/registerMvCenter/API'
import AlarmDetail from '@/pages/mv/registerMvCenter/components/AlarmDetail.vue'
import MQTTWAVEAPI from '@/api/mv/registerMvCenter/MQTTWAVEAPI'
import MQTTMPAPI from '@/api/mv/registerMvCenter/MQTTMPAPI'
import MQTTALARMAPI from '@/api/mv/registerMvCenter/MQTTALARMAPI'
import mvDetail from '@/pages/mv/registerMvCenter/components/mvDetail.vue';
const basicParameters:any = [
    {field:'pplat',id:'0001',name:'平台压：',val:'-',unit:'cmH<sub>2</sub>O',nameColor:'#FFAD63',color:'#FFAD63',unitColor:'#896340'},
    {field:'pmean',id:'0002',name:'平均压：',val:'-',unit:'cmH<sub>2</sub>O',nameColor:'#FFAD63',color:'#FFAD63',unitColor:'#896340'},
    {field:'peep',id:'0003',name:'呼末正压：',val:'-',unit:'cmH<sub>2</sub>O',nameColor:'#FFAD63',color:'#FFAD63',unitColor:'#896340'},
    {field:'ftot',id:'0007',name:'总频率：',val:'-',unit:'rpm',nameColor:'#4D92F7',color:'#4D92F7',unitColor:'#30558A'},
    {field:'vti',id:'0005',name:'吸气潮气量：',val:'-',unit:'mL',nameColor:'#4D92F7',color:'#4D92F7',unitColor:'#30558A'},
    {field:'vte',id:'0006',name:'呼气潮气量：',val:'-',unit:'mL',nameColor:'#4D92F7',color:'#4D92F7',unitColor:'#30558A'},
    {field:'vtePerIbw',id:'0009',name:'TVe/IBW：',val:'-',unit:'mL/kg',nameColor:'#4D92F7',color:'#4D92F7',unitColor:'#30558A'},
    {field:'vtespn',id:'0010',name:'TVe spn：',val:'-',unit:'mL',nameColor:'#4D92F7',color:'#4D92F7',unitColor:'#30558A'},
    {field:'etco2',id:'0011',name:'EtCO<sub>2</sub>：',val:'-',unit:'mmHg',nameColor:'#F4D84E',color:'#F4D84E',unitColor:'#A5963B'},
    {field:'rexp',id:'0013',name:'Re：',val:'-',unit:'cmH<sub>2</sub>O/L/s',nameColor:'#87E8DE',color:'#87E8DE',unitColor:'#528483'},
    {field:'cdyn',id:'0014',name:'Cdyn：',val:'-',unit:'mL/cmH<sub>2</sub>O',nameColor:'#87E8DE',color:'#87E8DE',unitColor:'#528483'},
    {field:'wob',id:'0015',name:'WOB：',val:'-',unit:'J/min',nameColor:'#87E8DE',color:'#87E8DE',unitColor:'#528483'},
];
const basicParametersTwo:any = [
    {field:'rinsp',id:'0041',name:'Ri：',val:'-',unit:'cmH<sub>2</sub>O/L/s',nameColor:'#87E8DE',color:'#87E8DE',unitColor:'#528483'},
    {field:'cstat',id:'0042',name:'Cstat：',val:'-',unit:'mL/cmH<sub>2</sub>O',nameColor:'#87E8DE',color:'#87E8DE',unitColor:'#528483'},
    {field:'rsbi',id:'0043',name:'RSBI：',val:'-',unit:'1/(min-L)',nameColor:'#87E8DE',color:'#87E8DE',unitColor:'#528483'},
];
let basicParametersThree:any = [];
const basicBigFontParameters:any = [
    {field:'ppeak',id:'0031',min:'',max:'50',name:'峰值压',val:'-',unit:'(cmH<sub>2</sub>O)',nameColor:'#FFAD63',color:'#FFAD63',unitColor:'#896340',minMaxColor:'#FFAD63'},
    {field:'mve',id:'0032',min:'2.9',max:'7.4',name:'分钟通气量',val:'-',unit:'(L/min)',nameColor:'#4D92F7',color:'#4D92F7',unitColor:'#30558A',minMaxColor:'#4D92F7'},
    {field:'fio2',id:'0033',min:'18',max:'31',name:'FiO<sub>2</sub>',val:'-',unit:'(%)',nameColor:'#FFFFFF',color:'#FFFFFF',unitColor:'#8D8D8D',minMaxColor:'#C6C6C6'},
];
const router = useRouter();
const route = useRoute();
const record = ref<any>({});  
const monitorTime = ref<string>('');  
const dialogVisible = ref<boolean>(false);
const currentTime = ref<string | Date>(formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'));
const AlarmDetailRef = ref<any>(null);
const mvDetailRef =  ref<any>(null);
const detail_footerRef=  ref<any>(null);
const detail_middleRef=  ref<any>(null);
const detail_titleRef=  ref<any>(null);
const wrapRef=  ref<any>(null);
const mqWaveAPI = new MQTTWAVEAPI();
const mqMpAPI = new MQTTMPAPI();
const mqAlarmAPI = new MQTTALARMAPI();
const goToMain = () =>{
 router.push({
    path: '/registerMvCenter'
 });
}
IntervalHelp.startInterval(
    "currentTime",
    () => {
    currentTime.value = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
    },
    1000
);
onMounted(()=>{
    const recordId:string = (route.query as any).recordId;
    getMonitorApi(recordId).then((res)=>{
        if(res.result){
            record.value = res.result;
            if(record.value['unitId'] && record.value['hosId']==undefined){
                record.value['hosId'] = record.value['unitId'];
            }
            if(record.value['deptId'] && record.value['departmentId']==undefined){
                record.value['departmentId'] = record.value['deptId'];
            }
            IntervalHelp.startInterval(
                "monitorTime",
                () => {
                    getMonitorTime(record.value.monitorStartDate);
                },
                1000
            );
            initData();
        }
    });
    calculateAspectRatio();
});
const baseHeight = ref(0);
const calculateAspectRatio = () =>{
    baseHeight.value = wrapRef.value.offsetHeight/34;
    (detail_middleRef.value as HTMLDivElement).style.height = (baseHeight.value*30)+"px";
    (detail_titleRef.value as HTMLDivElement).style.height = (baseHeight.value*2)+"px";
    (detail_footerRef.value as HTMLDivElement).style.height = (baseHeight.value*2)+"px";
    mvDetailRef.value.setBaseHeight(baseHeight.value);
}
onUnmounted(()=>{
    mqWaveAPI.unsubScribeAllMvWave();
    mqMpAPI.unsubScribeAllMvMp();
    mqAlarmAPI.unsubScribeAllMvAlarm();
})
let timerReset:any = null;
const initData = ()=>{
    mqWaveAPI.unsubScribeAllMvWave();
    mqMpAPI.unsubScribeAllMvMp();
    mqAlarmAPI.unsubScribeAllMvAlarm();
    mqWaveAPI.onMessageMvWave((data)=>{
        if(timerReset) clearTimeout(timerReset)
        timerReset = setTimeout(function(){
            for(let item of basicParameters){
                item.val = '-'
            }
            for(let itemOne of basicParametersTwo){
                itemOne.val = '-'
            }
            for(let itemTwo of basicParametersThree){
                itemTwo.val = '-'
            }
            for(let itemThree of basicBigFontParameters){
                itemThree.val = '-'
            }
            showpageChorse();
        },5000);
        (mvDetailRef.value as any).pushMvData(data);
    })
    mqMpAPI.onMessageMvMp((data)=>{
        dealmvMpDataToBasicParamter(data);
        if(mvDetailRef.value){
            (mvDetailRef.value as any).setServiceCode(record.value.serviceCode,data.createDate);
        }
    });
    mqAlarmAPI.onMessageMvAlarm((data)=>{
        AlarmDetailRef.value.open({
            info:data.info,
        })
    })
    mqAlarmAPI.subscribeMvAlarm(record.value);
    mqMpAPI.subscribeMvMp(record.value);
    mqWaveAPI.subscribeMvWave(record.value);
    dealmvMpDataToBasicParamter({});
}
//融合页，心电页，机械通气页切换函数
const  showpageChorse =async () =>{
    await nextTick();
    if(mvDetailRef.value){
        (mvDetailRef.value as any).setBasicParmeterTomv(basicParameters, basicParametersTwo, basicParametersThree, basicBigFontParameters);
        (mvDetailRef.value as any).mvReset();
    }
}
  //处理呼吸机基本参数并且分发到机械通气界面和融合界面
const dealmvMpDataToBasicParamter = (data: any) => {
    for (let item of basicParameters) {
        item.val = '-';
        if (data[item.field] != undefined) {
            if(item.field == 'tinspConf'|| 'wob' == item.field){
                item.val = data[item.field].toFixed(1);
            }else{
                item.val = Math.round(data[item.field]); 
            }
            
        }
    }
    for (let item of basicParametersTwo) {
        item.val = '-';
        if (data[item.field]!= undefined) {
                item.val = Math.round(data[item.field]); 
        }
    }
    basicParametersThree = setParameters(data.ventilationModeCategory);
    basicParametersThree.unshift({
        field:'ventilationMode',id:'1000',name:'通气模式：',val:'-',unit:'',nameColor:'#D3D3D3',color:'#FFFFFF',unitColor:'#8D8D8D'
    })
    for (let item of basicParametersThree){
        item.val = '-';
        if (data[item.field]!= undefined){
            if('ventilationMode' == item.field){
                item.val = data[item.field];
            }else if('tinspConf' == item.field||'slopeTimeConf' == item.field||'apneaInspTimeConf'== item.field){
                item.val = data[item.field].toFixed(2);
            }else if('flowTriggerConf' == item.field||'tubeSizeConf'==item.field||'highTimeConf' == item.field||'lowTimeConf' == item.field){
                item.val = data[item.field].toFixed(1);
            }else{
                item.val =Number(data[item.field]) ?  Math.round(data[item.field]) : data[item.field]; 
            }
        }
        if(data[item.field]!= undefined&&'peepConf' == item.field&&item.val==0){
            item.val='OFF',
            item.unit=''
        }
        if(data[item.field]!= undefined&&'pauseTimeConf' == item.field&&item.val==0){
            item.val='OFF',
            item.unit=''
        }
        if(data[item.field]!= undefined&&'deltaIntPeepConf' == item.field&&item.val==0){
            item.val='OFF',
            item.unit=''
        }
        if(data[item.field]!= undefined&&'expTriggerConf' == item.field&&item.val==0){
                item.val='Auto',
                item.unit=''
        }
        if(data[item.field]!= undefined&&'sighIntervalConf' == item.field&&item.val<60){
                item.unit='s'
        }else if(data[item.field]!= undefined&&'sighIntervalConf' == item.field&&item.val>=60){
        item.val=Math.floor(item.val/60)
        }
    }
    for (let item of basicBigFontParameters) {
        item.val = '-';
        if (data[item.field]!= undefined) {
            if(item.field == 'mve'){
                item.val = data[item.field].toFixed(1);
            }else{
                item.val = Math.round(data[item.field]); 
            } 
        }
    }
    if (mvDetailRef.value) {
        mvDetailRef.value.setBasicParmeterTomv(basicParameters, basicParametersTwo, basicParametersThree, basicBigFontParameters);
    }
}
// 监护时长
const getMonitorTime = (startDate: string) => {
    var s;
    startDate = startDate.replace(/-/g, "/");
    let newD = new Date();
    let oldT = startDate || newD;
    var data = new Date(newD.getTime() - new Date(oldT).getTime()).getTime();
    var days = Math.floor(data / (1000 * 60 * 60 * 24));
    var hours = Math.floor((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((data % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((data % (1000 * 60)) / 1000);
    if(days>0){
        s = days +
            "天 " +
            (hours < 10 ? "0" + hours : hours) +
            ":" +
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds);
    }else{
        s =
            (hours < 10 ? "0" + hours : hours) +
            ":" +
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds);
    }
    monitorTime.value = s;
}
</script>

<style lang='scss' scope>
%flex-common-center {
    display: flex;
    align-items: center;
    justify-content: center;
}
.svm_monitor_center_detail_wrap{
    width: 100%;
    height: 100%;
    background: #1D2229;
    .svm_monitor_center_detail_title{
        height: 55px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 2px solid #2B333D;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;
        color: #FFFFFF;
        &>div:nth-child(1){
            display: flex;
            align-items: center;
            height: 100%;
            & > i{
                margin-left: 24px;
                font-size: 20px;
            }
            & > span {
                margin-left:  16px;
            }
        }
        &>div:nth-child(2){
            height: 100%;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-right:15px;
            &>div{
                width: 40px;
                height: 40px;
                background: #000000;
                margin-left: 10px;
                @extend %flex-common-center;
                &>i{
                    font-size: 27px;
                }
            }
            >.el-button{
                width: 120px;
                height: 32px;
                background: #1890FF;
                border-radius: 4px;
                font-weight: 600;
                font-size: 16px;
                color: #FFFFFF;
            }
            .span_nth3{
                margin-left: 11px;
            }
            .span_nth4{
                margin-left: 31px;
                margin-right: 10px;
            }
        }
    }
    .svm_monitor_center_detail_middle{
        height: calc(100% - 55px - 55px);
        width: 100%;
        box-shadow: inset 0 -2px 0 0 #2B333D;
    }
    .svm_monitor_center_detail_footer{
        height: 55px;
        width: calc(100% - 40px);
        .left{
            height: 100%;
            width: 70%;
        }
        .right{
            height: 100%;
            width: 30%;
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
            .svm_mointor_center_footer_currentTime{
                width: 165px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 16px;
                color: #fff;
            }
        }
    }
    .el-dialog{
        width: 360px;
        // height: 600px;
        padding: 20px;
       
        .el-dialog__body{
            >div{
                font-size: 14px;
                line-height: 30px;
                overflow: hidden;
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            >div:last-child{
                text-align: end;
            }
        }
    }
}
</style>