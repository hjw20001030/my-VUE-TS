<template>
  <div class="svm_mointor_center_list_wrap">
    <div class="svm_mointor_center_list_item"  v-for="(record, idx) in records"
      @click="goToDetail(record.recordId)"
      :key="idx" :class="isAlarmRecordLevel(record,true)">
        <div class="info" v-if="record.recordId !== undefined">
            <div class="svm_mointor_center_list_item_title flex flex_jb flex_ac">
                <div class="l">
                    <span class="mr_10">{{ fillBedDisplay(record.bedNo) }}</span>
                    <span
                        >{{fillDisplay(record.custName) }} /
                        {{ fillDisplay(displaySex(record.genderAttr,record.unitId)) }} /
                        {{ fillDisplay(displayAge(record.age,record.unitId)) }}岁</span
                    >
                </div>
                <div class="r flex">
                  <span class="mr_15">{{
                    fillDisplay(
                      mvOb[record.serviceCode]
                        ? mvOb[record.serviceCode]["ventilationMode"]
                        : ""
                    )
                  }}</span>
                  <span v-show="isECG(record)" class="mr_10">
                    <i 
                      class="iconfont icon_vita" 
                      :style="{
                        color:
                          record.processState == '1000'
                            ? 'rgb(53, 207, 87)'
                            : 'rgb(168, 168, 168)',
                      }"
                  /></span>
                     <span class="hertAndLungIcon" >
                    <i
                      class="iconfont icon_ventilation"
                      :style="{
                        color:
                          record.processState == '1000'
                            ? 'rgb(53, 207, 87)'
                            : 'rgb(168, 168, 168)',
                      }"
                    />
                  </span>
                </div>
            </div>
            <div class="svm_mointor_center_list_item_content flex">
              <div class="title flex flex_ac flex_jc"><span>Paw</span></div>
              <div class="svm_mointor_center_list_item_content_1 flex flex_ac flex_jc pr">
                <div class="pa flex flex_ac flex_jc">{{fillBedDisplay(record.bedNo)}}</div>
                <div :id="record.serviceCode"></div>
              </div>
              <div class="svm_mointor_center_list_item_content_2 flex">
                <div class="Ppeak">
                  <div>Ppeak</div>
                  <div>{{
                    fillDisplay(
                      mvOb[record.serviceCode]
                        ? mvOb[record.serviceCode]["ppeak"]
                        : ""
                    )
                  }}</div>
                </div>
                <div class="MV">
                  <div>MV</div>
                  <div>{{
                    fillDisplay(
                      mvOb[record.serviceCode]
                        ? mvOb[record.serviceCode]["mve"]
                        : ""
                    )
                  }}</div>
                </div>
                <div class="VTe">
                  <div>VTe</div>
                  <div>{{
                    fillDisplay(
                      mvOb[record.serviceCode]
                        ? mvOb[record.serviceCode]["vte"]
                        : ""
                    )
                  }}</div>
                </div>
                <div class="FiO2">
                  <div class="pr">FiO<span class="pa">2</span></div>
                  <div>{{
                    fillDisplay(
                      mvOb[record.serviceCode]
                        ? mvOb[record.serviceCode]["o2ConcConf"]
                        : ""
                    )
                  }}</div>
                </div>
              </div>
            </div>
            <div class="svm_mointor_center_list_item_bottom flex" :class="isAlarmRecordLevel(record,false)"  v-if="record.alarmStartDate && record.alarmContent&&isAlarmRecord(record)">
              <div>{{ record.alarmStartDate ? record.alarmStartDate : "" }}</div>
              <div v-if="record.alarmStartDate && record.alarmContent" style="opacity: 0.5;">|</div>
              <div>{{ record.alarmContent ? record.alarmContent : "" }}</div>
            </div>
            <div class="svm_mointor_center_list_item_end flex" v-if="!isAlarmRecord(record)">
              <div>
                  {{ fillDisplay(record.unitName) }} ·
                  {{ fillDisplay(record.deptName) }} ·
                  {{ fillDisplay(record.areaName) }}
                  <span> (监护{{ fillDisplay(record.days) }}天)</span>
                </div>
                <div>{{ record.clinicalDiagnosis ? record.clinicalDiagnosis : "" }}</div>
            </div>
        </div>
        <div class="nullData flex flex_ac flex_jc" v-if="record.recordId === undefined&&record.bedNo===undefined">
            <p class="svm_mointor_center_list_item_none">暂无数据</p>
        </div>
       <div class="emptyNo flex flex_ac flex_jc" v-if="record.recordId === undefined&&record.bedNo!==undefined">
        <p class="svm_mointor_center_list_item_empty">
          {{fillDisplay(record.bedNo)}}
          <span>
            床位空闲中
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {sueMvCenterState} from '@/store/registerMvCenterState';
import { storeToRefs } from 'pinia'
import {fillDisplay,displaySex,displayAge,fillBedDisplay} from '@/utils/tool'
import {MvLivesApplication} from "@/lib_wave/main";
import { toPx, toTitleFontPx} from "@/utils/tool";
import { useRouter } from 'vue-router';
const router = useRouter();
import {watch,ref} from 'vue';
const mvCenterState = sueMvCenterState();
const {records} = storeToRefs(mvCenterState);
let timeOut = null;
const ECGOb =  ref<any>({});
const mvOb =  ref<any>({});
const mvWaveSetting = {
  paw: {
    max: 30,
    min: -6,
    unit: "",
    interval: 15,
    left: toPx(20),
    right: "0",
    top: toPx(8),
    bottom: toPx(8),
    time: 18,
    noGrid: true,
    noPartingLine: true,
  },
}
const mvStyle:any = {
  paw: {
    lineColor: "#FFA452",
    lineWidth: toPx(2),
    titleFont: "400 0px arial",
    subFont: "400 0px arial",
    font: toTitleFontPx(400,12,'arial'),
    textColor: "#FFA452",
    unitColor: "#895E37",
    markColor: "#C4DCF6",
    coordinateColor: "#7B91AB",
  }
}
const goToDetail = (recordId:number) =>{
  if(recordId != undefined)
 router.push({
    path: '/mvIndexDetail',
    query: { recordId: recordId }
 });
}
watch(
  ()=>records,(newRecords:any,old:any)=>{
    let hasEq = false;
    let isEq = true;
    for (let item of newRecords.value) {
      let has = false;
      for (let itemOne of old.value) {
        if (
          isEq &&
          item.serviceCode == itemOne.serviceCode &&
          item.alarmEndDate != itemOne.alarmEndDate
        ) {
          isEq = false;
        }
        if (item.serviceCode == itemOne.serviceCode) {
          has = true;
        }
      }
      if (!has) {
        hasEq = true;
      }
    }
    if (!hasEq && !isEq) {
      return;
    }
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      destroyAllEcgOB();
      for (let record of records.value) {
        let dom = document.getElementById(record.serviceCode);
        if (dom) {
          ECGOb.value[record.serviceCode] = new MvLivesApplication(
            dom as HTMLElement,
            ["paw"]
          );
          ECGOb.value[record.serviceCode].setWaveScope(mvWaveSetting);
          ECGOb.value[record.serviceCode].setMvStyle(mvStyle);
        }
      }
    }, 350);
  },{deep: true}
)
const destroyAllEcgOB = () =>{
  for (let [serviceCode, ecgOb] of Object.entries(ECGOb.value)) {
    if (ECGOb.value[serviceCode]) {
      ECGOb.value[serviceCode].destroy();
      ECGOb.value[serviceCode] = undefined;
    }
  }
  ECGOb.value = {};
}
const pushMpWaveData = (data: any) => {
  if (ECGOb.value[data.serviceCode] !== undefined) {
    ECGOb.value[data.serviceCode].pushData(data);
  }
}
const timerOutObj:any = {};
const pushMvMpData = (data: any)=> {
  if (timerOutObj[data.serviceCode]) {
    clearTimeout(timerOutObj[data.serviceCode]);
  }
  timerOutObj[data.serviceCode] = setTimeout((el) => {
    mvOb.value[data.serviceCode]["mve"] = "";
    mvOb.value[data.serviceCode]["fio2"] = "";
    mvOb.value[data.serviceCode]["paw"] = "";
    mvOb.value[data.serviceCode]["pmean"] = "";
    mvOb.value[data.serviceCode]["peep"] = "";
    mvOb.value[data.serviceCode]["vte"] = "";
    mvOb.value[data.serviceCode]["ppeak"] = "";
    mvOb.value[data.serviceCode]["pplat"] = "";
    mvOb.value[data.serviceCode]["o2ConcConf"] = "";
    mvOb.value[data.serviceCode]["fspnftot"] = "";
    mvOb.value[data.serviceCode]["ventilationMode"] = "";
    if (ECGOb.value[data.serviceCode]) {
      ECGOb.value[data.serviceCode].destroy();
      ECGOb.value[data.serviceCode] = undefined;
    }
    let dom = document.getElementById(data.serviceCode);
    if (dom) {
      ECGOb.value[data.serviceCode] = new MvLivesApplication(
        dom as HTMLElement,
        ["paw"]
      );
      ECGOb.value[data.serviceCode].setWaveScope(mvWaveSetting);
      ECGOb.value[data.serviceCode].setMvStyle(mvStyle);
    }
  }, 6000);
  if (data) {
    if (data["pmean"]) {
      data["pmean"] = Math.round(data["pmean"]);
    }
    if (data["peep"]) {
      data["peep"] = Math.round(data["peep"]);
    }
    if (data["ppeak"]) {
      data["ppeak"] = Math.round(data["ppeak"]);
    }
    if (data["mve"]) {
      data["mve"] = Number(data["mve"]).toFixed(1);
    }
    if (data["fio2"]) {
      data["fio2"] = Math.round(data["fio2"]);
    }
    if (data["paw"]) {
      data["paw"] = Math.round(data["paw"]);
    }
    let newMvOb:any = {};
    newMvOb[data.serviceCode] = data;
    mvOb.value = { ...mvOb.value, ...newMvOb };
  }
}
defineExpose({
  pushMpWaveData,pushMvMpData
})
const isAlarmRecordLevel = (record: any,is:boolean) =>{
    if (
      record !== undefined &&
      record.uncheckedAlarmCount !== undefined &&
      record.uncheckedAlarmCount > 0
    ) {
      let str = '';
      switch (record.alarmLevel) {
        case 'H':
          if(is){
            str = 'alarmLevel1AlarmAnimation'
          }else{
            str = 'alarmLevel1baAlarmAnimation'
          }
          break;
          case 'M':
          if(is){
            str = 'alarmLevel2AlarmAnimation'
          }else{
            str = 'alarmLevel2baAlarmAnimation'
          }
          break;
          case 'L':
          if(is){
            str = 'alarmLevel3AlarmAnimation'
          }else{
            str = 'alarmLevel3baAlarmAnimation'
          }
          break;
          case 'U':
          if(is){
            str = 'alarmLevel4AlarmAnimation'
          }else{
            str = 'alarmLevel4baAlarmAnimation'
          }
          break;
        default:
          if(is){
            str = 'alarmLevel4AlarmAnimation'
          }else{
            str = 'alarmLevel4baAlarmAnimation'
          }
      }
      return str;
    } else {
      return '';
    }
}

const isECG = (record: any) =>{
  let is=false
  if ( record !== undefined &&record.childMonitorList!== undefined &&record.childMonitorList.length > 0) {
    for (let i = 0; i < record.childMonitorList.length; i++) {
      const element = record.childMonitorList[i];
      if (element.type=='ECG') {
          is= true;
          break;
      }
    }
  }
  return is
}
const isAlarmRecord = (record: any) => {
  if (
    record !== undefined &&
    record.uncheckedAlarmCount !== undefined &&
    record.uncheckedAlarmCount > 0
  ) {
    return true;
  } else {
    return false;
  }
}
</script>

<style lang='scss' scoped>
@media (max-width: 1024px) {
  .svm_mointor_center_list_wrap{
    gap: 1px;
    // .svm_mointor_center_list_item{
    //   width: calc(100% - 2px);
    //   height: calc(100% - 2px);
    //   border: 1px solid transparent;
    // }
  }
}
@media (min-width: 1024px) {
  .svm_mointor_center_list_wrap{
    gap: 1.9px;
    // .svm_mointor_center_list_item{
    //   border: 1px solid transparent;
    //   width: calc(100% - 2px);
    //   height: calc(100% - 2px);
    // }
  }
}
.svm_mointor_center_list_wrap{
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(6, 1fr);
    background: #565f6c;
    .svm_mointor_center_list_item{
        background-color: #14191E;
        width: calc(100% - 1px - 1px);
        height: calc(100% - 1px - 1px);
        border: 1px solid transparent;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        >div{
            width: 100%;
            height: 100%;
            border: 1px solid transparent;
        }
        .svm_mointor_center_list_item_none{
            color: #49515D;
            font-size: 76.8px;
        }
        .svm_mointor_center_list_item_empty{
            color: #49515D;
            font-size: 76.8px;
        }
        .info{
            color: #FFFFFF;
            width: 100%;
            height: 100%;
            .svm_mointor_center_list_item_title{
                width: calc(100% - 35px);
                height: 40px;
                padding-left: 20px;
                padding-right: 15px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 18px;
                color: #FFFFFF;
                >div{
                    width: 50%;
                }
                .r{
                  justify-content: end;
                  >span:nth-child(1){
                    color: #E3FDFD;
                  }
                  >span{
                    >i{
                      font-size: 18px;
                    }
                  }
                }
            }
            .svm_mointor_center_list_item_content{
              width: 100%;
              height: calc(100% - 30px - 40px);
              .title{
                width: 20px;
                height: 100%;
                font-family: PingFangSC-Medium;
                font-weight: 500;
                font-size: 12px;
                color: #FFA452;
                letter-spacing: 0;
                >span{
                  transform: rotate(-90deg);
                  display: block;
                }
              }
              .svm_mointor_center_list_item_content_1{
                width: calc(100% - 20px - 298px);
                height: 100%;
                >div{
                  width: 100%;
                  height: 100%;
                }
                >div:first-child{
                  opacity: 0.3;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  font-size: 40px;
                  color: #CCCDDC;
                  overflow: hidden;
                  white-space: nowrap;
                }
              }
              .svm_mointor_center_list_item_content_2{
                width: calc(298px - 15px);
                height: 100%;
                padding-left: 15px;
                >div{
                  width: calc(100% / 4);
                  height: 100%;
                  >div:nth-child(1){
                    font-family: PingFangSC-Medium;
                    font-weight: 500;
                    font-size: 14px;
                    height: 20px;
                    // padding-bottom: ;
                  }
                  >div:last-child{
                    font-family: DINAlternate-Bold;
                    font-weight: 700;
                    font-size: 38px;
                    height: calc(100% - 20px);
                    display: flex;
                    align-items: flex-end;
                    line-height: 1;
                  }
                }
                .MV{
                  color: #38A8F3;
                }
                .FiO2{
                  color: #F6F6F6;
                  padding-right: 15px;
                  display: flex;
                  flex-direction: column;
                  align-items: end;
                  >div:first-child{
                    width: 33px;
                    border: 1px solid #F6F6F6;
                    border-radius: 2px;
                    text-align: center;
                    padding-right: 4px;
                    >span{
                      font-size: 10px;
                      top: 6px;
                    }
                  }
                }
                .Ppeak{
                  color: #FFA452;
                }
                .VTe{
                  color: #00AD7C;
                }
              }
            }
            .svm_mointor_center_list_item_end{
              height: 30px;
              opacity: 0.7;
              background: #1F2429;
              width: calc(100% - 1px);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              align-items: center;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 18px;
              letter-spacing: 0;
              justify-content: space-between;
              &>div{
                  box-sizing: border-box;
                  margin-left: 20px;
              }
              &>div:nth-child(2){
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  max-width: 580px;
                  height: 100%;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  font-size: 18px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  // padding-right: 15px;
              }
            }
            .svm_mointor_center_list_item_bottom{
              height: 30px;
              opacity: 0.7;
              background: #1F2429;
              width: 100%;
              color: #FFFFFF;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              align-items: center;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 18px;
              margin-left: -1px;
               &>div{
                  box-sizing: border-box;
                  padding-left: 20px;
              }
              &>div:nth-child(3){
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 584px;
                  height: 100%;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  font-size: 18px;
                  color: #FFFFFF;
                  letter-spacing: 0;
              }
            }
        }
    }
  .alarmLevel1AlarmAnimation {
      border:1px solid #F61702 !important;
  }
  .alarmLevel2AlarmAnimation {
      border:1px solid #F6B902 !important;
  }
  .alarmLevel3AlarmAnimation {
      border:1px solid #3CD8DA !important;
  }
  .alarmLevel4AlarmAnimation {
      border:1px solid #FFFFFF !important;
  }
  .alarmLevel1baAlarmAnimation {
      background: #F61702 !important;
  }
  .alarmLevel2baAlarmAnimation {
      background: #F6B902 !important;
  }
  .alarmLevel3baAlarmAnimation {
      background: #3CD8DA !important;
  }
  .alarmLevel4baAlarmAnimation {
      background: #3F4356 !important;
  }
}
</style>