<template>
  <div class="mechanicalDataReview"
   v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.2)">
    <div class="body flex">
      <div class="body_l">
        <div class="body_l_header flex ">
          <div class="header_onLeft"></div>
          <div class="header_onRight flex flex_ac">
            <div>
              <span>通气模式: </span>
              <span>{{ currentMvMsg.ventilationMode}}</span>
            </div>
            <div>
              <span>ftot: </span>
              <span>
                {{ currentMvMsg.ftot}}
              </span>
            </div>
            <div>
              <span>Ppeak:</span>
              <span>
                {{ currentMvMsg.ppeak}}
              </span>
            </div>
            <div>
              <span>VTi:</span>
              <span>
                {{currentMvMsg.vti}}
              </span>
            </div>
            <div>
              <span>VTe:</span>
              <span>
                {{currentMvMsg.vte}}
              </span>
            </div>
          </div>
        </div>
        <div class="body_l_second">
          <div class="body_l_second_first flex">
            <div class="body_l_second_first_l flex flex_ac flex_jc"> <span
                    class="iconfont arrow_add"
                  ></span></div>
            <div class="body_l_second_first_m flex flex_ac">
              <span class="ml_10 flex flex_ac">
                <el-date-picker
                  v-model="waveStartDate"
                  type="datetime"
                  placeholder="选择日期时间"
                  :default-time="defaultTime"
                  size="small"
                  :start-placeholder="currentMsg.segmentStartDate"
                  :end-placeholder="currentMsg.segmentEndDate"
                />
              </span>
               <label for="speed" class="flex flex_ac">
                <span>走速</span>
                <el-select
                  v-model="speedValue"
                  size="small"
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="item in speedOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </label>
              <label for="scale" class="flex flex_ac">
                <span>缩放</span>
                <el-select
                  v-model="scaleValue"
                  size="small"
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="item in scaleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </label>
            </div>
            <div class="body_l_second_first_r flex flex_ac">
              <span
                class="icon iconfont icon_cursor"
                :class="{icon_6300ff:cursorIsOpen}"
                @click="disabledCustor()"
                ref="dividersRef"
              ></span>
              <span
                class="icon iconfont arrow_left_more"
                @click="scrolleSetting('left')"
              ></span>
              <span
                class="icon iconfont arrow_left"
                @click="scrolleSetting('upPage')"
              ></span>
              <span
                class="icon iconfont arrow_right"
                @click="scrolleSetting('nextPage')"
              ></span>
              <span
                class="icon iconfont arrow_right_more"
                @click="scrolleSetting('right')"
              ></span>
            </div>
          </div>
          <div class="body_l_second_info flex">
            <div class="mvWaveArea flex">
              <div class="mvWaveArea_left" ref="mvWaveAreaLeft">
                  <div v-for="item of waveListEcgLead" :key="item">
                    <div v-if='item == "Paw"'>{{item}}<span>(cmH<sub>2</sub>O)</span></div>
                    <div v-if='item == "Flow"'>{{item}}<span>(L/min)</span></div>
                    <div v-if='item == "Volume"'>{{item}}<span>(mL)</span></div>
                    <div v-if='item == "CO2"'>{{item}}<span>(mmHg)</span></div>
                    <div v-if='item == "Pes"'>{{item}}<span>(cmH<sub>2</sub>O)</span></div>
                    <div v-if='item == "Ptp"'>{{item}}<span>(cmH<sub>2</sub>O)</span></div>
                  </div>
              </div>
              <div class="mvWaveArea_right" ref="mvWaveArea"></div>
            </div>
            <div class="mvLoopWaveArea">
              <div class="pr">
                  <div class="mv_loopOne_select">
                        <div @click.prevent="mvSelect('mvLoopOneSelect')">
                          {{loopOneValue}}
                          <span :class="[mvLoopOneSelect?'iconfont icon-open':'iconfont icon-close']"></span>
                          <transition name="plus-icon">
                            <div v-show="mvLoopOneSelect">
                              <div v-for="(item,idx) of loopOneOption" :key="idx" @click.stop="mvSelectChild('mvLoopOneSelect',item)">
                                {{item.label}}
                              </div>
                            </div>
                          </transition>
                        </div>
                  </div>
                  <div class="mv_loopTwo_select">
                      <div @click.prevent="mvSelect('mvLoopTwoSelect')">
                        {{loopTwoValue}}
                        <span :class="[mvLoopTwoSelect?'iconfont icon-open':'iconfont icon-close']"></span>
                        <transition name="plus-icon">
                          <div v-show="mvLoopTwoSelect">
                            <div v-for="(item,idx) of loopTwoOption" :key="idx" @click.stop="mvSelectChild('mvLoopTwoSelect',item)">
                              {{item.label}}
                            </div>
                          </div>
                        </transition>
                      </div>
                  </div>
                  <div ref="mvLoopWaveArea" class="loopGraph">

                  </div>
              </div>
              <div class="pr">
                <div class="mv_cdcs_title">
                  {{cdcsValue=='cdyn'?'Cdyn':'Cstat'}} <span style="margin-left:4px">(mL/cmH<sub>2</sub>O)</span>
                </div>
                <div class="mv_cdcs_select">
                  <div @click.prevent="mvSelect('mvCdcsSelect')">
                    {{cdcsValue}}
                    <span :class="[mvCdcsSelect?'iconfont icon-open':'iconfont icon-close']"></span>
                    <transition name="plus-icon">
                      <div v-show="mvCdcsSelect">
                        <div v-for="(item,idx) of cdcsOption" :key="idx" @click.stop="mvSelectChild('mvCdcsSelect',item)">
                          {{item.value}}
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
                <div class="mv_cdcs_chart" ref="cdcsChart"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="body_l_third flex">
           <div ref="selectLead" class="flex flex_ac flex_jc">
              <div>{{ allMapName }}</div>
            </div>
            <div>
              <div ref="thumbnail"></div>
            </div>
        </div>
        <div class="body_l_btn">
          <div class="time_all">
              <fullView ref='fullViewRef' trendBackgroundColor='#ced4db' @getAlarmData="getAlarmDataFull" @getTrendData="getTrendDataFull" @dblclickMaskDom="dblclickMaskDomFull"  @previousStep="previousStep"
              @nextStep="nextStep" :monitorStartDate="custDto.monitorStartDate" :monitorEndDate="monitorEndDate" :waveStartDate="waveStartDate"></fullView>
            </div>
            <div class="analys_grid">
              <meChanicalGrid @handleAlarmTableDbClick='handleAlarmTableDbClick' ref="mechanicalGridRef"></meChanicalGrid>
            </div>
        </div>
    </div>
    <div class="body_r">
       <div class="right_first">
        <div>
          <div>
            <span>{{ custDto.custName ? custDto.custName : '-'}}</span
            ><span>{{ displaySex(custDto.custGender)}}</span
            ><span>{{ custDto.custAge? displayAge(custDto.custAge) :'-'}}岁</span>

            <span class="medicine">{{ custDto.hosName ? custDto.hosName : '-'}}</span
          ><span class="medicine">{{ custDto.deptName ? custDto.deptName : '-'}}</span
          ><span class="medicine">{{ custDto.bedName |formatRole}}</span>
          <span class="diagnosis">
            {{custDto.clinicalDiagnosis?custDto.clinicalDiagnosis:'-'}}
          </span>
          </div>
          <div class="first_msg" ref="patientMsg">
            <span
              class="icon iconfont icon_info"
              @click="patientMsgChange()"
            ></span>
            <div v-if="isShowPatientMsg">
              <div class="postion_parent">
                <div></div>
                <div></div>
              </div>
              <patientmsg :custDto='custDto' :recordId="currentMsg.id" :ventilationMode="currentMvMsg.ventilationMode"></patientmsg>
            </div>
          </div>
        </div>
      </div>
      <div class="right_second flex">
            <div class="right_second_l">
            <div class="second_rightArea">
              <div>
                <div>
                  <div
                    :class="chartOrGrid == 'chart' ? 'changeBackground' : ''"
                    @click="showChartOrGrid('chart')"
                  >
                     趋势图
                  </div>
                  <div
                    :class="chartOrGrid == 'grid' ? 'changeBackground' : ''"
                    @click="showChartOrGrid('grid')"
                  >
                    趋势表
                  </div>
                </div>
                <div class="rightArea_div">
                  <div>
                    <span ref="clickobviceTrendSelectOne">{{ timObvice }}</span>
                  </div>
                 <div ref="showTrendChartTimeControl">
                    <span
                      class="icon iconfont arrow_dropdown_default"
                    ></span>
                    <div v-if="false">
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div v-show="chartOrGrid == 'chart'" class="rightArea_chart">
                  <trendChat  @transmissionToTrendGridFromTrendChart = 'transmissionToTrendGridFromTrendChart' ref="trendChatRef" :timeLines="timObvice"></trendChat>
                </div>
                <div v-show="chartOrGrid == 'grid'" class="rightArea_grid">
                  <trendGrid ref="trendGrids"></trendGrid>
                </div>
              </div>
            </div>
            </div>
            <div class="right_second_r">
               <censusGrid ref="censusGrids"></censusGrid>
            </div>
      </div>
    </div>
    </div>
    <div class="footer flex flex_ac"><span class="ml_10">{{custDto.mvServiceCode}}</span></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref ,onMounted,nextTick,onUnmounted} from 'vue';
import {MvApplicationHos} from "@/lib_wave/main";
import { toPx, toTitleFontPx,displaySex,displayAge} from "@/utils/tool";
import { getDetailApi,getReviewApi ,getAlarmDataApi,getComplianceApi,getTrendDataApi} from "@/api/mv/mechanicalDataReview";
import {formatDate} from "@/utils/tool";
import * as echarts from 'echarts';
import fullView from "@/components/publicFullView.vue";
import meChanicalGrid from "@/pages/mv/mechanicalDataReview/meChanical/mechanical_grid.vue";
import patientmsg from "@/pages/mv/mechanicalDataReview/meChanical/mechanical_patient_msg.vue";
import trendChat from "@/pages/mv/mechanicalDataReview/meChanical/mechanical_trend_chat.vue";
import trendGrid from "@/pages/mv/mechanicalDataReview/meChanical/mechanical_trend_grid.vue";
import censusGrid from "@/pages/mv/mechanicalDataReview/meChanical/mechanical_census_grid.vue";
interface CurtMvMsg {
  ventilationMode: string;
  ftot: string;
  ppeak: string;
  vti: string;
  vte: string;
}
const currentMvMsg = reactive<CurtMvMsg>({
  ventilationMode:'',
  ftot:'',
  ppeak:'',
  vti:'',
  vte:''
});
const option = {
  grid: {
    top: toPx(5,'px'),
    left: toPx(35,'px'),
    right: toPx(20,'px'),
    bottom: toPx(24,'px'),
  },
  xAxis: {
    show:true,
    type: 'category',
    boundaryGap: false,
    axisTick: {
      show: true,
    },
    axisLabel: {
      show:true,
      color:'#C1C1C1',
      fontSize: toPx(12,'px'),
      showMaxLabel:true,
      formatter: (value, index)=>{
        if(value == ''){
          return '-:-';
        }else{
          return value;
        }
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#C1C1C1",
        width: toPx(1.5),
      }
    },
    data:['', '', '', '', ''],
  },
  yAxis: {
    min: 0,
    max: 100,
    interval: 20,
    axisTick: {
      show: false, //不显示坐标轴刻度线
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ["#070925"],
      },
    },
    splitLine: {
      //网格线
      lineStyle: {
        type: "dashed", //设置网格线类型 dotted：虚线 solid:实线
        color: "#5c5d6e",
        width: toPx(1.5),
      },
      show: true, //隐藏或显示
    },
    type: "value",
    axisLabel: {
      show: true,
      color: "#C1C1C1",
      fontSize: toPx(12,'px'),
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#C1C1C1",
        width: toPx(1.5),
      }
    },
  },
  series: [{
    lineStyle: {
      color: '#F84475',
      width: toPx(2),
    },
    type: 'line',
    smooth: true,
    connectNulls: true,
    showSymbol: false,
    data: [],
  }]
}
const waveStartDate = ref<string | Date>(new Date());
const waveStartDateNoChange = ref<string | Date>(new Date());
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const currentMsg = reactive({
  id:"",
  alarmEndDate:"",
  alarmTypeName:"",
  alarmContent:"",
  actionStarStatus: "0",
  markStatus: "0",
  segmentStartDate:'',
  segmentEndDate:'',
})
const speedValue = ref<string>('auto');
const speedOptions = reactive([
  {
    value: 'auto',
    label: "自动",
  },
  {
    value: 2,
    label: "2 mm/s",
  },
  {
    value: 5,
    label: "5 mm/s",
  },
  {
    value: 10,
    label: "10 mm/s",
  },
])
const scaleValue = ref<number>(1);
const scaleOptions = reactive([
  {
    value: 1,
    label: "100%",
  },
  {
    value: 1.5,
    label: "150%",
  },
])
const loopOneValue = ref<string>('压力-容积')
const loopTwoValue = ref<string>('流速-容积')
const cdcsValue = ref<string>('cdyn')
const mvCdcsSelect = ref<boolean>(false)
const mvLoopOneSelect = ref<boolean>(false)
const mvLoopTwoSelect = ref<boolean>(false)
const fullViewRef = ref<any>(null);
const mechanicalGridRef = ref<any>(null);
const loopOneOption = [
  {
    value:'pv',
    label:'压力-容积'
  },
  {
    value:'fv',
    label:'流速-容积'
  },
  {
    value:'fp',
    label:'流速-压力'
  }
]
const loopTwoOption = [
  {
    value:'pv1',
    label:'压力-容积'
  },
  {
    value:'fv1',
    label:'流速-容积'
  },
  {
    value:'fp1',
    label:'流速-压力'
  }
]
const cursorIsOpen = ref<boolean>(false);
const  waveListEcgLead = reactive(["Paw", "Flow","Volume", "CO2",'Pes', 'Ptp']);
const mvLoopWaveArea = ref<HTMLElement | null>(null);
const thumbnail = ref<HTMLElement | null>(null);
const mvWaveArea = ref<HTMLElement | null>(null);
const mvWaveAreaLeft = ref<HTMLElement | null>(null);
let app: MvApplicationHos | null = null;
const guardianshipRecordId = ref<string>('219093');
const loading = ref<boolean>(false);
  //动静态顺应性下拉框
const cdcsOption = [
  {
    value:'cdyn', 
    label:'Cdyn',
  },
  {
    value:'cstat',
    label:'Cstat',
  }
]
//患者信息
let custDto:any = {
  mvRecordId: "",
  custName: "-",
  deptName: "-",
  bedName: "-",
  hosName: "-",
  custGender: "",
  custAge: "",
}
onUnmounted(()=>{
  window.removeEventListener('resize', handleResize)
})
onMounted(()=>{
  init();
  getDetail();
  window.addEventListener('resize', handleResize);
  mvWaveAreaLeft.value?.addEventListener('scroll', scrollCallback);
  mvWaveArea.value?.addEventListener('scroll', scrollCallback);
});
const scrollCallback = async() => {
  await nextTick();
  mvWaveAreaLeft.value.scrollTop = mvWaveArea.value.scrollTop;
  mvWaveArea.value.scrollTop = mvWaveAreaLeft.value.scrollTop;
  if(mvWaveArea.value?.scrollLeft>=0){
    let widOneSecond = '';
    if(speedValue.value == 'auto'){
      widOneSecond = ((mvWaveArea.value?.clientWidth - toPx(38)) / 60) * scaleValue.value;
    }else{
      widOneSecond = (speedValue.value*24/5)* scaleValue.value;
    }
    let leftTime = Math.floor(mvWaveArea.value?.scrollLeft/widOneSecond);
    waveStartDate.value = getDividersStartTime(leftTime);
    let s = new Date(waveStartDate.value).getTime();
    let e = new Date(waveStartDateNoChange.value).getTime()
    if(!(cursorIsOpen.value)){
      let index = (s-e)/1000;
      setmultiParameters(index);
    }
  }
}
//时间修改处理
const getDividersStartTime = (val:number) => {
    let time = new Date(waveStartDateNoChange.value).getTime();
    let curentTime = time + val*1000;
    return formatDate(new Date(curentTime),'yyyy-MM-dd hh:mm:ss');
}
const handleResize = () => {
  location.reload();
};
const allMapName = ref<string>('Paw');
let cscdChartTrend:any = null;
const cdcsChart = ref<HTMLElement | null>(null);
const chartOrGrid = ref<string>('chart');
const timObvice = ref<string>('2分钟')
//趋势图配置 颜色
const waveDataConfig:object = {
  Flow:{
      max:20,
      min:0,
      color:'#4D92F7'
  },
  Paw:{
      max:60,
      min:0,
      color:'#FFA452'
  },
  Volume:{
      max:1200,
      min:0,
      color:'#3CC6AC'
  },
  CO2:{
      max:50,
      min:0,
      color:'#F4D84E'
  },
  Pes:{
      max:20.1,
      min:-5.1,
      color:'#FA541C'
  },
  Ptp:{
      max:30,
      min:-10,
      color:'#FF935F'
  }
}
const formatRole = (val: string) => {
  if (val != undefined) {
    var bed = val.substr(val.length - 1);
    return bed != "床" ? val + "床" : val;
  }
}
const isShowPatientMsg = ref<boolean>(false);
 //控制患者详细信息的展示
const patientMsgChange = () => {
  isShowPatientMsg.value = !isShowPatientMsg.value;
}
//初始化波形和全览图区域
const init = ()=>{
  cscdChartTrend = echarts.init(cdcsChart.value)
  cscdChartTrend.setOption(option);
  app = reactive<MvApplicationHos>(new MvApplicationHos(mvWaveArea?.value,thumbnail?.value,mvLoopWaveArea?.value));
  app?.setDataAndTime(120);
  app?.cursorIsOpen(false);
  app?.returnData((data)=>{
      app?.emptyLoopMode();
      let index = parseInt((data/1000).toString());
      //多参信息
      if(index!==0)
        index = index - 1;
      if(index>=120)
        index = 119;
      setmultiParameters(index);
      if(dataAll?.flow){
        app?.clickTheCursorToDrawLoopGraph(parseInt((data/1000).toString()));
      }
    })
}
let dataAll = {};
const monitorEndDate = ref<string | Date>('');
const getDetail = async (id:number) => {
  loading.value = !0;
  const res = await getDetailApi(guardianshipRecordId.value);
  if(res && res.result){
    custDto = reactive(res.result || {});
    if(res.result.mvProcessStateName == '监护中')
      monitorEndDate.value = formatDate(new Date('2025-08-27 20:52:34'), "yyyy-MM-dd hh:mm:ss");
    else
      monitorEndDate.value = res.result.monitorEndDate;
    //获取波形数据
    getReview(getNowFormatDate(monitorEndDate.value,2,false),false,false);
    waveStartDate.value = getNowFormatDate(monitorEndDate.value,2,false);
    waveStartDateNoChange.value = getNowFormatDate(monitorEndDate.value,2,false);
    await nextTick();
    //获取报警表单
    mechanicalGridRef.value.getHandled(undefined,undefined,guardianshipRecordId.value,undefined);
    //时间轴所需配置
    setcurrentPositionOrDrawAlarm("setWaveDataConfig", waveDataConfig);
  }else{
    loading.value = !1;
  }
}
const trendChatRef = ref<any>(null);
// 从新加载趋势图
const trendloading = (istrue?:boolean,isOpen?:boolean,time?:number | Date) => {
  let newDate = waveStartDateNoChange.value;
    if(!waveStartDateNoChange.value){
      newDate = getNowFormatDate(formatDate(new Date(monitorEndDate.value),"yyyy/MM/dd hh:mm:ss"),2,false,false);
    }
    //加载趋势图
    trendChatRef.value?.setTimeLineList(waveStartDateNoChange.value,2+'分钟',guardianshipRecordId.value,true,newDate);
}
const trendGrids = ref<any>(null);
//调用trendGrid里的方法，
const transmissionToTrendGridFromTrendChart = ( data:any,time:string,duration:string) =>{
  trendGrids.value?.setGridData(data,time,duration);
}
const getReview = async (start:string | Date,istrue:boolean,isPage:boolean,callback:Function) =>{
  let flag = !1;
  if(!loading.value){
    loading.value = !0;
    flag = !0;
  }
  const res = await getReviewApi(guardianshipRecordId.value,{
    start:formatDate(start, "yyyy-MM-dd hh:mm:ss"),
    duration:2
  });
  if(res && res.result){
    if(flag){
      loading.value = !1;
    }
    dataAll = reactive<any>(res.result || {});
    let newDate = ''
    if(custDto.mvProcessStateName == '监护中')
    newDate = start;
    else
    newDate = custDto.monitorEndDate;
    if(!dataAll.flow&&!res.result.startDate){
      if(istrue)
      newDate =  monitorEndDate.value;
      let select = new Date(start).getTime();
      if(select>new Date(custDto.monitorStartDate).getTime() && select <= new Date(newDate).getTime()){
        ElMessage({
          message: "该时段未获取到回顾数据",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      ElMessage({
        message: "请选择监护时间范围内的时间"+ formatDate(custDto.monitorStartDate, "yyyy-MM-dd hh:mm:ss")+'~'+formatDate(newDate, "yyyy-MM-dd hh:mm:ss"),
        type: "warning",
        duration: 1000,
      });
      return;
    }
    draw(res.result);
    waveStartDate.value = res.result.startDate;
    waveStartDateNoChange.value = res.result.startDate;
    //多参信息
    setmultiParameters(0);
    //加载动态趋势图
    getCompliance(start);
    //获取报警信息数据
    getAlarmData(start,false);
    trendloading(true);
  }else{
    ElMessage({
      message: res.msg,
      type: "warning",
      duration: 1000,
    })
    loading.value = !1;    
  }
}
//时间轴 插件回调
const getAlarmDataFull = (start: string | Date, callback: Function)=>{
  loading.value = !0;
  getAlarmData(start,true,(data)=>{
    if(callback) callback(data);
  });
}
//控制趋势图与列表的展示
const showChartOrGrid = (val:string) => {
  chartOrGrid.value = val;
}
//双击时间轴
const dblclickMaskDomFull = (currentTime: string | Date)=>{
  let newDate = new Date(getNowFormatDate(monitorEndDate.value,2,false)).getTime();
  let date = new Date(currentTime).getTime() - newDate;
  //判断是否是最后两分钟,如果不是加两分钟,如果是还是当前时间
  if(new Date(currentTime).getTime() - new Date(custDto.monitorStartDate).getTime() <= 0){
    getReview(custDto.monitorStartDate)
    messageBox();
  }else if(new Date(currentTime).getTime() > newDate && date < 120000){
    getReview(formatDate(new Date(newDate),'yyyy/MM/dd hh:mm:ss'));
    messageBox();
  }else{
    getReview(currentTime);
  }
}
let waveData = [];
const getTrendDataFull = async (start: string | Date, callback: Function)=>{
  loading.value = !0;
  const data = await getTrendDataApi(guardianshipRecordId.value,{
    start:formatDate(start, "yyyy-MM-dd hh:mm:ss"),
    duration:7
  });
  if(data && data.result){
    await nextTick();
    waveData = [];
    data.result.forEach((e:any)=>{
      setData(e);
    })
    callback(waveData);
    fullViewRef.value.selectChange(allMapName.value);
    loading.value = !1;
  }
}

 //历史记录和加签记录表双击调用
const handleAlarmTableDbClick = (row:any) => {
    getReview(getNowFormatDate(getNowFormatDate(row.alarmTime,1,true),2,false),false,true);
}
//设置时间轴光标 || 时间轴报警信息
const setcurrentPositionOrDrawAlarm = (fun:String,data?:any) =>{
  if(fullViewRef.value){
      fullViewRef.value[fun](data);
  }else{
      setTimeout(()=>{
        setcurrentPositionOrDrawAlarm(fun,data);
      },500);
  }
}
//设置时间轴趋势数据
const setData = (data:object|any)=>{
  //2.解析paw数据
  if (data['ppeak'] !== undefined) {
      if (waveData['Paw'] === undefined) {
        waveData['Paw'] = [];
      }
    waveData['Paw'].push({
          name:data.createDate,
            value: [
            data.createDate,
            data['ppeak']
            ]
      });
  }else{
        if (waveData['Paw'] === undefined) {
        waveData['Paw'] = [];
      }
    waveData['Paw'].push({
          name:data.createDate,
            value: [
            data.createDate,
            ''
            ]
      });
  }
    //解析flow数据
  if (data['mve'] !== undefined) {
      if (waveData['Flow'] === undefined) {
        waveData['Flow'] = [];
      }
    waveData['Flow'].push({
          name:data.createDate,
            value: [
            data.createDate,
            data['mve']
            ]
      });
  }else{
      if (waveData['Flow'] === undefined) {
        waveData['Flow'] = [];
      }
    waveData['Flow'].push({
          name:data.createDate,
            value: [
            data.createDate,
            ''
            ]
      });
  }
  //解析volume数据
  if (data['vte'] !== undefined) {
      if (waveData['Volume'] === undefined) {
        waveData['Volume'] = [];
      }
    waveData['Volume'].push({
          name:data.createDate,
            value: [
            data.createDate,
            data['vte']
            ]
      });
  }else{
      if (waveData['Volume'] === undefined) {
        waveData['Volume'] = [];
      }
    waveData['Volume'].push({
          name:data.createDate,
            value: [
            data.createDate,
            ''
            ]
      });
  }
  //解析co2数据
  if (data['etco2'] !== undefined) {
      if (waveData['CO2'] === undefined) {
        waveData['CO2'] = [];
      }
    waveData['CO2'].push({
          name:data.createDate,
            value: [
            data.createDate,
            data['etco2']
            ]
      });
  }else{
        if (waveData['CO2'] === undefined) {
        waveData['CO2'] = [];
      }
    waveData['CO2'].push({
          name:data.createDate,
            value: [
            data.createDate,
            ''
            ]
      });
  } 
  if (data['Pes'] !== undefined) {
      if (waveData['Pes'] === undefined) {
        waveData['Pes'] = [];
      }
    waveData['Pes'].push({
          name:data.createDate,
            value: [
            data.createDate,
            data['Pes']
            ]
      });
  }else{
        if (waveData['Pes'] === undefined) {
        waveData['Pes'] = [];
      }
    waveData['Pes'].push({
          name:data.createDate,
            value: [
            data.createDate,
            ''
            ]
      });
  }
  if (data['Ptp'] !== undefined) {
      if (waveData['Ptp'] === undefined) {
        waveData['Ptp'] = [];
      }
    waveData['Ptp'].push({
          name:data.createDate,
            value: [
            data.createDate,
            data['Ptp']
            ]
      });
  }else{
        if (waveData['Ptp'] === undefined) {
        waveData['Ptp'] = [];
      }
    waveData['Ptp'].push({
          name:data.createDate,
            value: [
            data.createDate,
            ''
            ]
      });
  }
  }
const nextStep = ()=>{
  let newDate = waveStartDateNoChange.value;
  if(!waveStartDateNoChange.value){
  newDate = monitorEndDate.value;
  }
  let date = new Date(getNowFormatDate(newDate,2,false,true)).getTime();
  let staTime =new Date(monitorEndDate.value).getTime();
  //判断是否是最后两分钟,如果不是加两分钟,如果是还是当前时间
  if(date < staTime && (staTime - date) > 120000)
    getReview(getNowFormatDate(newDate,2,false,true));
  else{
    getReview(getNowFormatDate(monitorEndDate.value,2,false),false,false,(data)=>{
      messageBox();
    });
  }
}
const previousStep = ()=>{
  let newDate = waveStartDateNoChange.value;
  if(!waveStartDateNoChange.value){
    newDate = monitorEndDate.value;
  }
  let date = new Date(getNowFormatDate(newDate,2,false)).getTime();
  let staTime = new Date(custDto.monitorStartDate).getTime();
  if(date > staTime && (date-staTime) >= 0)
  getReview(getNowFormatDate(newDate,2,false))
  else{getReview(custDto.monitorStartDate,false,false,(data)=>{
    messageBoxLeft();
  });}
}
const messageBox = ()=>{
  let newDate = '';
  if(custDto.mvProcessStateName == '监护中')
  newDate = waveStartDateNoChange.value;
  else
  newDate = custDto.monitorEndDate;
  ElMessage({
      message: "请选择监护时间范围内的时间"+ formatDate(custDto.monitorStartDate, "yyyy-MM-dd hh:mm:ss")+'~'+formatDate(newDate, "yyyy-MM-dd hh:mm:ss"),
      type: "warning",
      duration: 1000,
  });
}
const messageBoxLeft = ()=>{
  let newDate = '';
  if(custDto.mvProcessStateName == '监护中')
  newDate = monitorEndDate.value;
  else
  newDate = custDto.monitorEndDate;
  let endDate = getNowFormatDate(newDate,2,false);
  ElMessage({
      message: "请选择监护时间范围内的时间"+ formatDate(custDto.monitorStartDate, "yyyy-MM-dd hh:mm:ss")+'~'+formatDate(endDate, "yyyy-MM-dd hh:mm:ss"),
      type: "warning",
      duration: 1000,
  });
}
let startAndCTrendDate:object = {};
const getCompliance = async (start:string | Date) =>{
  const res = await getComplianceApi(guardianshipRecordId.value,{
    start:formatDate(start, "yyyy-MM-dd hh:mm:ss"),
    duration:2
  });
  if(res && res.result){
    startAndCTrendDate = res.result;
    dealOptionAndSet(res.result,true);
  }
}
const dealOptionAndSet = (data:any,iscdyn:boolean) =>{
  let endDate = waveStartDateNoChange.value;
  let date = new Date(formatDate(endDate, "yyyy/MM/dd hh:mm:ss"));
  let startDate = new Date(date.getTime());
  let axixData = [];
  let type = [];
  if(iscdyn)
  type = data.cdynTrendList;
  else
  type = data.cstatTrendList;
  for(let i=0;i<=type.length;i++){
    axixData.push(formatDate(new Date(startDate.getTime()+i*1000),'mm:ss'));
  }
  let newOption = JSON.parse(JSON.stringify(option));
  newOption.xAxis.data = axixData;
  newOption.series[0].data = type;
  cscdChartTrend.setOption(newOption,true);
}
const getAlarmData = async (start:string | Date,isAll:boolean,callback?:Function) =>{
  let duration:number = 2;
  if(isAll){
    duration = (7*24)*60;
  }
  const data = await getAlarmDataApi(guardianshipRecordId.value,{
    start:formatDate(start, "yyyy-MM-dd hh:mm:ss"),
    duration:duration
  });
  setcurrentPositionOrDrawAlarm('currentPosition');
  if(isAll){
      nextTick(()=>{
          if(callback) callback(data.result);
      })
  }else{
    await nextTick();
    let alarmDataArr = [];
    if(data.result.length>0){
        for (let index = 0; index < data.result.length; index++) {
          const element = data.result[index];
          if(element.secondAlarms&&element.secondAlarms.length>0){
            for(let item of element.secondAlarms){
              alarmDataArr.push( {
                  alarmStartDate:item.alarmStartDate,
                  alarmEndDate:item.alarmEndDate,
                  alarmContent:item.alarmTypeAttr,
                  alarmType:item.alarmType
              })
            }
          }else{
            alarmDataArr.push({
                alarmStartDate:element.alarmStartDate,
                alarmEndDate:element.alarmEndDate,
                alarmContent:element.alarmContent,
                alarmType:element.alarmType
            })
          }
        }
    }else{
      loading.value = !1;
    }
    app?.callThePolice(alarmDataArr,waveStartDateNoChange.value);
  }
}
const censusGrids = ref<any>();
const setmultiParameters = (index:number) =>{
  if(!dataAll?.multiParameters || !dataAll?.multiParameters[index]) return;
    getMultiInfo(dataAll.multiParameters[index],alarmMulti=>{
        censusGrids.value?.getCensusData(alarmMulti);
          currentMvMsg.ventilationMode = alarmMulti.ventilationMode ? alarmMulti.ventilationMode:'-';
          currentMvMsg.ftot = alarmMulti.ftot ? alarmMulti.ftot:'-';
          currentMvMsg.ppeak = alarmMulti.ppeak ? alarmMulti.ppeak:'-';
          currentMvMsg.vti = alarmMulti.vti ? alarmMulti.vti:'-';
          currentMvMsg.vte = alarmMulti.vte ? alarmMulti.vte:'-';
      })
}

 //机械通气报警多参数据
const getMultiInfo = (data:any,successCallback:Function,ErrorCallback?:Function) =>{
    for(let item in data){
      if(item == 'mve'||item == 'wob'||item == 'flowTriggerConf'||item == 'apneaInspTimeConf'||item == 'tubeSizeConf' || item == 'highTimeConf' || item == 'lowTimeConf'){
        data[item] = Number(data[item]).toFixed(1);
      }else if(item == 'slopeTimeConf'||item == 'tinspConf'){
        data[item] = Number(data[item]).toFixed(2);
      }else{
        if(typeof data[item] != 'string'){
          data[item] = Math.round(data[item]);
        }else{
          data[item] = data[item];
        }
      }
    }
  successCallback(data);
}
const draw = (wavaData:any) =>{
  app.setDataAndParse(wavaData);
  let ary = [];
  for(let itemOne of loopOneOption){
    if(itemOne.label == loopOneValue.value){
      ary.push(itemOne.value);
    }
  }
  for(let itemTwo of loopTwoOption){
    if(itemTwo.label == loopTwoValue.value){
      ary.push(itemTwo.value);
    }
  }
  app?.setPanoramaMode(allMapName.value.toLocaleLowerCase());
  app?.setLoopMode(ary);
  app?.drawWave(true);
  app?.setWaveObvice(waveListEcgLead,true);
  app?.setSpeed(speedValue.value, true);
  app?.setScale(scaleValue.value, true);
  app?.emptyLoopMode();
  app?.clickTheCursorToDrawLoopGraph(7);
  // handleSelect(checkList);
}
const getNowFormatDate = (date:string | Date,minutes:number,isList:boolean,backward:boolean) =>{
      let interTimes = minutes*60*1000;
      if(backward){
        date=new Date(Date.parse(date)+interTimes);
      }else{
        date=new Date(Date.parse(date)-interTimes);
        if(isList){
            let newTimes = parseInt((2*60*1000).toString()); //2分钟
            date=new Date(Date.parse(date) + newTimes);
        }
      }
      return formatDate(new Date(date), "yyyy-MM-dd hh:mm:ss");;
}
const scrolleSetting = (single:string)=>{
      let canvas = mvWaveArea.value;
      if (single == "left") {
        canvas.scrollLeft = 0;
      } else if (single == "upPage") {
        canvas.scrollLeft = canvas.scrollLeft - (canvas.clientWidth - toPx(38));
      } else if (single == "nextPage") {
        canvas.scrollLeft = canvas.scrollLeft + (canvas.clientWidth - toPx(38));
      } else if (single == "right") {
        canvas.scrollLeft = canvas.scrollWidth;
      }
}
const disabledCustor = ()=>{
  if(!dataAll.multiParameters) return;
  cursorIsOpen.value = !cursorIsOpen.value;
  app?.cursorIsOpen(cursorIsOpen.value);
  if(cursorIsOpen.value)
  app?.emptyLoopMode();
}
const mvSelect = (val:string) =>{
  if(val == 'mvCdcsSelect'){
    mvCdcsSelect.value = !mvCdcsSelect.value;
  }else if(val == 'mvLoopOneSelect'){
    mvLoopOneSelect.value = !mvLoopOneSelect.value;
  }else if(val == 'mvLoopTwoSelect'){
    mvLoopTwoSelect.value = !mvLoopTwoSelect.value;
  }
}
const mvSelectChild = (val:string,item:object) =>{
  if(val == 'mvCdcsSelect'){
      mvCdcsSelect.value = !mvCdcsSelect.value;
    if(item?.label == 'Cstat'){
      option.series[0].lineStyle.color = '#ef7cf6';
      dealOptionAndSet(startAndCTrendDate,false);
      cdcsValue.value = 'cstat'
    }
    else{
      option.series[0].lineStyle.color = '#f84475';
      dealOptionAndSet(startAndCTrendDate,true);
      cdcsValue.value = 'cdyn';
    }
  }else if(val == 'mvLoopOneSelect'){
    mvLoopOneSelect.value = !mvLoopOneSelect.value;
    loopOneValue.value = item.label;
    let ary = [];
    ary.push(item.value);
    for(let itemTwo of loopTwoOption){
      if(itemTwo.label == loopTwoValue.value){
        ary.push(itemTwo.value);
      }
    }
    if(app){
      app?.setLoopMode(ary,true);
    }
  }else if(val == 'mvLoopTwoSelect'){
    mvLoopTwoSelect.value = !mvLoopTwoSelect.value;
    loopTwoValue.value = item.label;
    let aryTwo = [];
    for(let itemOne of loopOneOption){
      if(itemOne.label == loopOneValue.value){
        aryTwo.push(itemOne.value);
      }
    }
    aryTwo.push(item.value);
    if(app){
      app?.setLoopMode(aryTwo,true);
    }
  }
}
</script>

<style lang="scss" scoped>
-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
$selfLeftWid: 30px;
$selfBorderColor: 1px solid #dddddd;
$selfBgcColor: #eeeeee;
.iconfonts{
  font-family: "iconfont" !important;
  font-size: 12px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
}
%flex-common-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
@mixin userNone(){
  -webkit-user-select: none; /*谷歌 /Chrome*/
  -moz-user-select: none; /*火狐/Firefox*/
  -ms-user-select: none; /*IE 10+*/
  user-select: none;
}
@mixin scrollHidden() {
    &::-webkit-scrollbar {
        width: 0px;
    }
}
@mixin scrollBarStyle() {
    &::-webkit-scrollbar {
        width: 9px;
        height: 9px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px #9b9ba3;
        background: rgba(152, 155, 163, 0.5);
    }
    /*鼠标悬浮在滚动条上的主干部分*/
    &::-webkit-scrollbar-track:hover {
      box-shadow: inset 0 0 5px #ccc;
      background-color: rgba(0, 0, 0, 0.01);
    }
}
.mechanicalDataReview{
  height: 100%;
  width: 100%;
  .body{
    width: 100%;
    height: calc(100% - 24px);
    .body_l{
      height: 100%;
      width: calc(100% - 640px);
      &_header{
        width: 100%;
        height: 40px;
        background: #FFFFFF;
        box-shadow: inset -1px -1px 0 0 #DDDDDD;
        .header_onLeft{
          width: 30%;
          height: 100%;
        }
        .header_onRight{
          width: 70%;
          height: 100%;
          justify-content: right;
          >div{
            margin-right: 20px;
            font-size: 12px;
            font-face: PingFangSC;
            font-weight: 600;
            letter-spacing: 0;
            >span:last-child{
              margin-left: 5px;
              color: #534aff;
            }
          }
        }
      }
      .body_l_second{
        width: 100%;
        height: calc(100% - 126px - 60px - 40px);
        .body_l_second_first{
          height: 40px;
          background: #EEEEEE;
          box-shadow: inset -1px -1px 0 0 #DDDDDD;
          .body_l_second_first_l{
            width: 30px;
            height: 100%;
            box-shadow: inset -1px -1px 0 0 #DDDDDD;
            cursor: pointer;
          }
          .body_l_second_first_m{
            width: calc(100% - 264px - 30px);
            height: 100%;
            :deep(.el-input){
                width: 180px;
                height: 30px;
                .el-input__wrapper{
                border-radius: 2px;
                }
                .el-input__inner{
                  height: 100%;
                  background: #FFFFFF;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  font-size: 12px;
                  color: #333333;
                }
              }
            >label{
              margin-left: 10px;
              >span{
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 12px;
                color: #333333;
                margin-right: 8px;
              }
              :deep(.el-select){
                width: 120px;
                height: 30px;
                .is-disabled{
                  background: #FFFFFF;
                }
                .el-select__wrapper{
                  height: 100%;
                  border-radius: 2px;
                }
              }
            }
          }
          .body_l_second_first_r{
            width: 264px;
            height: 100%;
            @include userNone;
            height: 100%;
            justify-content: right;
            & > span {
              cursor: pointer;
              margin-right: 30px;
            }
            .icon_6300ff{
              color: #6300ff;
            }
          }
        }
        .body_l_second_info{
          width: 100%;
          height: calc(100% - 40px - 1px);
          background-color: #070925;
          border-bottom: 1px solid #ddd;
          .mvWaveArea{
            width: calc(100% - 264px);
            height: 100%;
            .mvWaveArea_right{
              width: calc(100% - 30px);
              height: 100%;
              @include scrollBarStyle;
            }
            .mvWaveArea_left{
              @include scrollHidden();
              width: 30px;
              height: 100%;
              background-color: #2b2d45;
              overflow-y: auto;
              overflow-x: hidden;
              & > div{
                @extend %flex-common-center;
                height: 153px;
                border-bottom: 1px solid #93939a;
                width: 100%;
                &>div{
                  color: #ffffff;
                  transform: rotate(-90deg);
                  font-family: PingFangSC-Medium;
                  font-weight: 500;
                  font-size: 12px;
                  color: #FFFFFF;
                  &>span{
                    margin-left: 5px;
                  }
                }
              }
            }
          }
          .mvLoopWaveArea{
            width: 264px;
            height: 100%;
            >div:first-child{
              height: calc(100% - 207px);
              width: 100%;
              .mv_loopOne_select{
                z-index: 1;
                position: absolute;
                width: 90px;
                height: 24px;
                line-height: 24px;
                border: 1px solid #4b4d61;
                background-color: #161832;
                left: 155px;
                top:  7px;
                color:#bcbcbd;
                border-radius: 2px;
                font-size: 12px;
                &>div{
                  width: 100%;
                  height: 100%;
                  position: relative;
                  text-align: left;
                  box-sizing: border-box;
                  padding-left: 5px;
                  &>span{
                    position: absolute;
                    right: 5px;
                  }
                  &>div{
                    line-height: 24px;
                    border: 1px solid #4b4d61;
                    background-color: #161832;
                    color:#bcbcbd;
                    border-radius: 2px;
                    position: absolute;
                    top: 28px;
                    left: -1px;
                    width: 90px;
                    height: auto;
                    z-index: 1;
                    &>div{
                      box-sizing: border-box;
                      padding-left: 5px;
                      text-align: left;
                      height: 24px;
                      width: 100%;
                      color: #bcbcbd;
                      cursor: pointer;
                    }
                    &>div:hover{
                      background-color: #3492fc;
                    }
                  }
                }
            }
            .mv_loopTwo_select{
                z-index: 1;
                position: absolute;
                width: 90px;
                height: 24px;
                line-height: 24px;
                border: 1px solid #4b4d61;
                background-color: #161832;
                left: 155px;
                top:  calc(100% / 2 + 5px);
                color:#bcbcbd;
                border-radius: 2px;
                font-size: 12px;
                &>div{
                  width: 100%;
                  height: 100%;
                  position: relative;
                  text-align: left;
                  box-sizing: border-box;
                  padding-left: 5px;
                  &>span{
                    position: absolute;
                    right: 5px;
                  }
                  &>div{
                    line-height: 24px;
                    border: 1px solid #4b4d61;
                    background-color: #161832;
                    color:#bcbcbd;
                    border-radius: 2px;
                    position: absolute;
                    top: 28px;
                    left: -1px;
                    width: 90px;
                    height: auto;
                    z-index: 1;
                    &>div{
                      box-sizing: border-box;
                      padding-left: 5px;
                      text-align: left;
                      height: 24px;
                      width: 100%;
                      color: #bcbcbd;
                      cursor: pointer;
                    }
                    &>div:hover{
                      background-color: #3492fc;
                    }
                  }
                }
            }
              .loopGraph{
                height: 100%;
                width: 100%;  
              }
            }
            >div:last-child{
              border-top: 1px solid #c1c1c1;
              height: 207px;
              width: 100%;
              .mv_cdcs_title{
                font-family: PingFangSC-Medium;
                font-size: 12px;
                height: 35px;
                width: 100%;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding-left: 14px;
                color: #FFFFFF;
            }
            .mv_cdcs_select{
                position: absolute;
                width: 90px;
                height: 24px;
                font-size: 12px;
                line-height: 24px;
                border: 1px solid #4b4d61;
                background-color: #161832;
                left: 155px;
                top:  7px;
                color:#bcbcbd;
                border-radius: 2px;
                &>div{
                  width: 100%;
                  height: 100%;
                  position: relative;
                  text-align: left;
                  box-sizing: border-box;
                  padding-left: 5px;
                  &>span{
                    position: absolute;
                    right: 5px;
                  }
                  &>div{
                    line-height: 24px;
                    border: 1px solid #4b4d61;
                    background-color: #161832;
                    color:#bcbcbd;
                    border-radius: 2px;
                    position: absolute;
                    top: 28px;
                    left: -1px;
                    width: 90px;
                    height: auto;
                    z-index: 1;
                    &>div{
                      box-sizing: border-box;
                      padding-left: 5px;
                      text-align: left;
                      height: 24px;
                      width: 100%;
                      color: #bcbcbd;
                      cursor: pointer;
                    }
                    &>div:hover{
                      background-color: #3492fc;
                    }
                  }
                }
            }
            .mv_cdcs_chart{
                height: calc(100% - 35px);
                width: 100%;
            }
            }
          }
        }
      }
      .body_l_third{
        width: 100%;
        height: 60px;
         cursor: pointer;
         :deep(.v_panoramaContentCoverMask){
          mix-blend-mode:screen;
         }
         >div:first-child{
            background: #2B2D45;
            height: 100%;
            width: $selfLeftWid;
            border-right: $selfBorderColor;
            & > div:nth-child(1) {
              font-family: PingFangSC-Medium;
              font-size: 12px;
              color: #FFFFFF;
              transform: rotate(-90deg);
            }
         }
         >div:last-child{
            width: calc(100% - $selfLeftWid);
            height: 100%;
            >div{
              height: 100%;
              width: 100%;
            }
         }
      }
      .body_l_btn{
        width: 100%;
        height: 126px;
        .time_all{
          height: 40px;
          width: 100%;
        }
        .analys_grid{
          width: 100%;
          height: calc(100% - 40px);
        }
      }
    }
    .body_r{
      height: calc(100% - 1px);
      width: 640px;
      border-bottom: $selfBorderColor;
      z-index: 1;
      .right_second{
         height: calc(100% - (40px));
          width: 100%;
          box-shadow: 0 -1px 0 0 #DDDDDD;
        &>div{
            flex: 1;
          }
          &_l{
          .second_rightArea {
            width: 322px;
            height: 100%;
            .changeBackground {
              background: #ffffff !important;
            }
            & > div:nth-child(1) {
              height: 40px;
              width: 100%;
              background-color: $selfBgcColor;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              @include userNone;
              .rightArea_div {
                display: flex;
                cursor: pointer;
                align-items: center;
                font-size: 12px;
                & > div:nth-child(1) {
                  margin-right: 10px;
                }
                & > div:nth-child(2) {
                  cursor: pointer;
                  margin-right: 10px;
                  position: relative;
                  @include userNone;
                  & > div {
                    position: absolute;
                    top: 41px;
                    left: -43px;
                    border: 1px solid #dddddd;
                    background: #ffffff;
                    border-radius: 5px;
                    z-index: 10;
                    height: 96px;
                    width: 63px;
                    & > div {
                      height: 32px;
                      width: 100%;
                      line-height: 32px;
                      text-align: center;
                    }
                    & > div:hover {
                      background-color: #ebebff;
                    }
                  }
                }
              }
              & > div:nth-child(1) {
                display: flex;
                // align-items: flex-end;
                padding-left: 15px;
                & > div {
                  @extend %flex-common-center;
                  cursor: pointer;
                  height: 32px;
                  background: #DDDDDD;
                  border: $selfBgcColor;
                  border-bottom: 0;
                  border-top-left-radius: 5px;
                  border-top-right-radius: 5px;
                  width: 64px;
                  margin-top: 9px;
                  margin-right: 6px;
                }
              }
            }
            & > div:nth-child(2) {
              width: 100%;
              height: calc(100% - 40px);
              & > div {
                height: 100%;
                width: 100%;
              }
            }
          }
          }
      }
        .right_first {
          height: 40px;
          width: 100%;
          background-color: $selfBgcColor;
          box-shadow: inset -1px -1px 0 0 #DDDDDD;
          & > div:nth-child(1) {
            height: 100%;
            line-height: 40px;
            box-sizing: border-box;
            padding-left: 19px;
            padding-right: 13px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            & > div:nth-child(1) {
            display: flex;
            &>.diagnosis{
            max-width: 200px;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            }
              & > span {
                margin-right: 13px;
              }
            }
            .first_msg {
              position: relative;
              & > div {
                width: 319px;
                height: 600px;
                position: absolute;
                background: #fff;
                border: $selfBorderColor;
                top: 66px;
                right: -13px;
                z-index: 10;
                border-radius: 13px;
                border-top-right-radius: 0px;
                .postion_parent {
                  position: relative;
                  & > div:nth-child(1) {
                    position: absolute;
                    top: -25px;
                    left: 287px;
                    border: 12px solid;
                    border-color: transparent transparent #ccc transparent;
                  }
                  & > div:nth-child(2) {
                    position: absolute;
                    top: -24px;
                    left: 287px;
                    border: 12px solid;
                    border-color: transparent transparent #fff transparent;
                  }
                }
              }
            }
          }
          & > div:nth-child(2) {
            font-size: 12px;
            font-weight: 500;
            color: #666666;
            padding-top: 12px;
            padding-left: 19px;
            & > span {
              margin-right: 10px;
            }
          }
          .medicine{
            font-family: PingFangSC-Medium;
            font-weight: 500;
            font-size: 12px;
            color: #666666;
            letter-spacing: 0;
          }
          .diagnosis{
            font-family: PingFangSC-Medium;
            font-weight: 500;
            font-size: 12px;
            color: #534AFF;
            letter-spacing: 0;
          }
        }
    }
  }
  .footer{
    height: 24px;
    width: 100%;
    background: #FFFFFF;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
  }
}
</style>