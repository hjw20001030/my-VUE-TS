<template>
   <div class="analys_trend_chart">
    <div class="chart_x_scale">
      <div v-for="(time, idx) of timeLineList" :key="idx">
        {{ time }}
        <div>|</div>
      </div>
    </div>
    <div class="chart_x_map">
      <div v-for="item of trendChartList" :key="item.code" class="map_father_box">
        <div class="map_title">
          <div>
            <div v-html="item.name"></div><span>{{ item.unit }}</span>
          </div>
          <div>
            <div v-html="item.avg"></div>
          </div>
        </div>
        <div class="map_box" :id="item.code"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,onMounted,nextTick } from 'vue'
import {formatDate,toPx} from '@/utils/tool'
import * as echarts from 'echarts'
import {getTrendDatasApi} from '@/api/mv/mechanicalDataReview'
const prop = defineProps({
  timeLines: {
    type: String,
    default: () => ''
  }
})
const timeLine = ref('');
const trendChartList = ref([
    {
        name: "<span style='margin-right:5px;color:#266BFE'>FiO2</span>",
        unit: "(%)",
        avg: "<span style='margin-left:10px;color:#266BFE'>-</span>",
        code: "fio2",
    },
    {
        name:"<span style='margin-left:0px;color:#FF9E4D'>Ppeak</span><span>/</spna></spna><span style='color:#333333'>Pmean</span><span>/</spna><span style='margin-right:5px;color:#FFA320'>PEEP</span>",
        unit: "(cmH2O)",
        avg: "<span style='margin-left:10px;color:#FF811A'>-</span><span style='margin-left:10px;color:#333333'>-</span><span style='margin-left:10px;color:#FFA320'>-</span>",
        code: "PkPnPe",
    },
    {
        name: "<span style='color:#11CE6B'>MVi</span><span>/</spna><span style='margin-right:5px;color:#4DA2F2'>MVe</span>",
        unit: "(L/min)",
        avg: "<span style='margin-left:10px;color:#11CE6B'>-</span><span style='margin-left:10px;color:#4DA2F2'>-</span>",
        code: "mime",
    },
    {
        name: "<span style='color:#15C875'>VTi</span><span>/</spna><span style='margin-right:5px;color:#4DA2F2'>VTe</span>",
        unit: "(mL)",
        avg: "<span style='margin-left:10px;color:#2ACB95'>-</span><span style='margin-left:10px;color:#3E84DE'>-</span>",
        code: "tite",
    },
    {
        name: "<span style='color:#F4D84E'>RSB</span><span>/</spna><span style='margin-right:5px;color:#FF980C'>%fspont</span>",
        unit: "",
        avg: "<span style='margin-left:10px;color:#F4D84E'>-</span><span style='margin-left:10px;color:#FF980C'>-</span>",
        code: "rsbi",
    },
    {
        name: "<span style='color:#F6C543'>ftot</span><span>/</spna><span style='margin-right:5px;color:#333333'>fspn</span>",
        unit: "(bpm)",
        avg: "<span style='margin-left:10px;color:#F6C543'>-</span><span style='margin-left:10px;color:#333333'>-</span>",
        code: "rr",
    },
    {
        name: "<span style='color:#f84475'>Cdyn</span><span>/</spna><span style='margin-right:5px;color:#ef7cf6'>Cstat</span>",
        unit: "(mL/cmH2O)",
        avg: "<span style='margin-left:10px;color:#f84475'>-</span><span style='margin-left:10px;color:#ef7cf6'>-</span>",
        code: "cdcs",
    },
])
const params = ref("HR,RESP,SPO2,NIBP,TEMPERATURE");
const trendData = ref([]);
const echartsObj = ref({});
const optionData = ref({});
const startDateA= ref<string>('')
const endDateA= ref<string>('')
const duration = ref<number>(1)
const keyColorObject: any = {
    PkPnPe: {
        ppeak:'#FF811A',
        pmean:'#AAAAAA',
        peep:'#FFA320',
    },
    tite: {
        vti:'#11CE6B',
        vte:'#4A9CE9',
    },
    fio2: {
        fio2:'#276CFF',
    },
    mime: {
        mvi: "#11CE6B",
        mve: "#4DA2F2",
    },
    rr: {
        rr: "#F4D84E",
        fspn:"#AAAAAA"
    },
    rsbi:{
        rsb:'#F4D84E',
        fspont:'#FF980C',
    },
    cdcs:{
        cdyn:'#f84475',
        csta:'#ef7cf6',
    }
}
const MaxMinOb:any =  {
    PkPnPe: {
        max: 60,
        min: 0,
        interval: 15,
        left:'35px'
    },
    tite: {
        max: 1200,
        min: 0,
        interval: 300,
        left:'35px'
    },
    fio2: {
        max: 52,
        min: 0,
        interval: 13,
        left:'35px'
    },
    mime: {
        max: 20.0,
        min: 0,
        interval: 5,
        left:'35px'
    },
    rr: {
        max: 52,
        min: 0,
        interval: 13,
        left:'35px'
    },
    cdcs: {
        max: 100,
        min: 0,
        interval: 25,
        left:'35px'
    },
    rsbi:{
        max: 100,
        min: 0,
        interval: 25,
        left:'35px'
    }
}
const ChartOption: any = {
    grid: {
        top: toPx(0,'px'),
        left: toPx(35,'px'),
        right: toPx(0,'px'),
        bottom: toPx(0,'px'),
        width:toPx(264,'px'),
        containLabel: false,
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        show: false, //不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
        axisTick: {
        show: false, //不显示坐标轴刻度线
        },
        axisLine: {
        show: false, //不显示坐标轴线
        },
        axisLabel: {
        show: false, //不显示坐标轴上的文字
        },
    },
    yAxis: {
        min: 0,
        max: 400,
        interval: 100,
        axisTick: {
        show: false, //不显示坐标轴刻度线
        },
        splitArea: {
        show: true,
        areaStyle: {
            color: ["#0F0F2B"],
        },
        },
        splitLine: {
        //网格线
        lineStyle: {
            type: "dashed", //设置网格线类型 dotted：虚线 solid:实线
            color: "#DDDDDD",
            width: 0.5,
        },
        show: true, //隐藏或显示
        },
        type: "value",
        axisLabel: {
        show: true,
        color: "#000000",
        fontSize: toPx(10,'px'),
        },
    },
    series: [
        {
        type: "line",
        connectNulls: true,
        smooth: 0.1,
        lineStyle: {
            color: "#5470C6",
            width: toPx(1.5,'px'),
        },
        markLine: {
            hoverAnimation:false,
            symbol: ["none", "none"],
            label: { show: false },
            lineStyle: {
            color: "#DDDDDD",
            width: toPx(0.5,'px'),
            },
            data: [{ xAxis: toPx(1,'px') }, { xAxis: toPx(2,'px') }, { xAxis: 3 }],
        },
        data: [
            ['0', ''],
            ['1', ''],
            ['2', ''],
            ['3', ''],
            ['4', ''],
        ],
        }
    ]
}
const timeLineList = ref([
    "-:-:-",
    "-:-:-",
    "-:-:-",
    "-:-:-",
    "-:-:-",
])
const segmentEndDate = ref(null);
const timeObject = {
    2: 120000,
    30: 1800000,
    60: 3600000
}
onMounted(() => {
    timeLine.value = prop.timeLines;
    initEchart();
    setOption();
})
//初始化趋势图
const initEchart = () => {
    for (let item of trendChartList.value) {
        const chart = echarts.getInstanceByDom( document.getElementById(item.code) as HTMLElement);
        if (chart) chart.dispose(); // 销毁旧实例
        echartsObj.value[item.code] = echarts.init(
            document.getElementById(item.code) as HTMLElement
        );
    }
}
//设置趋势图数据
const setOption = async () => {
    for (let key in echartsObj.value) {
        let option = changeOption(key);
        echartsObj.value[key].setOption(option,true);
    }
}
//处理趋势图加载数据封装option
const changeOption = (key: string) => {
    let line = {
    type: "line",
        connectNulls: true,
        smooth: 0.1,
        lineStyle: {
            color: "#5470C6",
            width: 1,
        },
        markLine: {
            hoverAnimation:false,
            symbol: ["none", "none"],
            label: { show: false },
            lineStyle: {
            color: "#DDDDDD",
            width: 0.5,
            },
            data: [],
        },
        data: [],
    };
    let option = JSON.parse(JSON.stringify(ChartOption));
    option.yAxis.max = MaxMinOb[key].max;
    option.yAxis.min = MaxMinOb[key].min;
    option.yAxis.interval = MaxMinOb[key].interval;
    if(key == 'mime' || key == 'tite'){
    option.yAxis.axisLabel.formatter = function (value:number, index:number) {         
            if(value ==0 || key == 'tite'){
            return value;
            }else{
            return value.toFixed(1);
            }
        }
    }
    option.series = [];
    if (optionData.value[key]) {
    let dataSelf = optionData.value[key];
    for (let i = 0; i < dataSelf.length; i++) {
        if (dataSelf[i].length > 0) {
        let myLine = JSON.parse(JSON.stringify(line));
        if(key == 'PkPnPe'){
            let selfDataTwo = JSON.parse(JSON.stringify(dataSelf[i]));
            myLine.data = selfDataTwo;
            if(i==0){
            myLine.lineStyle.color = keyColorObject[key]['ppeak']
            }else if(i == 1){
            myLine.lineStyle.color = keyColorObject[key]['pmean']
            }else{
            myLine.lineStyle.color = keyColorObject[key]['peep']
            }
        }else if(key == 'tite'){
            let selfDataTwo = JSON.parse(JSON.stringify(dataSelf[i]));
            myLine.data = selfDataTwo;
            if(i==0){
            myLine.lineStyle.color = keyColorObject[key]['vti']
            }else if(i == 1){
            myLine.lineStyle.color = keyColorObject[key]['vte']
            }
        }else if(key == 'fio2'){
            let selfDataTwo = JSON.parse(JSON.stringify(dataSelf[i]));
            myLine.data = selfDataTwo;
            if(i==0){
            myLine.lineStyle.color = keyColorObject[key]['fio2']
            }
        }else if(key == 'mime'){
            let selfDataTwo = JSON.parse(JSON.stringify(dataSelf[i]));
            myLine.data = selfDataTwo;
            if(i==0){
            myLine.lineStyle.color = keyColorObject[key]['mvi']
            }else if(i == 1){
            myLine.lineStyle.color = keyColorObject[key]['mve']
            }
        }else if(key == 'rr'){
            let selfDataTwo = JSON.parse(JSON.stringify(dataSelf[i]));
            myLine.data = selfDataTwo;
            if(i==0){
            myLine.lineStyle.color = keyColorObject[key]['rr']
            }else if(i == 1){
            myLine.lineStyle.color = keyColorObject[key]['fspn']
            }
        }else if(key == 'rsbi'){
            let selfDataTwo = JSON.parse(JSON.stringify(dataSelf[i]));
            myLine.data = selfDataTwo;
            if(i==0){
            myLine.lineStyle.color = keyColorObject[key]['rsb']
            }else if(i == 1){
            myLine.lineStyle.color = keyColorObject[key]['fspont']
            }
        }else if(key == 'cdcs'){
            let selfDataTwo = JSON.parse(JSON.stringify(dataSelf[i]));
            myLine.data = selfDataTwo;
            if(i==0){
            myLine.lineStyle.color = keyColorObject[key]['cdyn']
            }else if(i == 1){
            myLine.lineStyle.color = keyColorObject[key]['csta']
            }
        }
        if(duration.value == 1){
            myLine.markLine.data = [
            { xAxis: dataSelf[i].length / 4 },
            { xAxis: (dataSelf[i].length / 4) * 2},
            { xAxis: (dataSelf[i].length / 4) * 3 - 1 },
            ];
        }else{
            myLine.markLine.data = [
            { xAxis: dataSelf[i].length / 4 },
            { xAxis: (dataSelf[i].length / 4) * 2 },
            { xAxis: (dataSelf[i].length / 4) * 3 },
            ];
        }
        option.series.push(myLine);
        } else {
        option.series = option.series;
        return option;
        }
    }
    return option;
    }else{
    option.series = option.series;
    return option;
    }
}
const setTimeLineList = (segmentDate:Date|string,timeLength:Date|string,id:number,ondutyStatus:boolean,time:Date|string) => {
    timeLine.value = timeLength;
      let duration = timeLength == "2分钟" ? 2 : (timeLength == "30分钟" ? 30 : 60);
      if (!ondutyStatus) {
        timeLineList.value = [
          "--:--:--",
          "--:--:--",
          "--:--:--",
          "--:--:--",
          "--:--:--",
        ];
        return;
      }
      segmentEndDate.value = segmentDate;
      let endDate = segmentDate;
      let date = new Date(formatDate(endDate, "yyyy/MM/dd hh:mm:ss"));
      let miniutes = date.getMinutes();
      let endDates;
      if (date.getSeconds() > 0 && (duration == 30 || duration == 60)) {
        endDates = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          miniutes,
          0
        );
        endDates = new Date(endDates.getTime() + 60000);
      } else {
        endDates = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          miniutes,
          date.getSeconds()
        );
      }
      endDateA.value = endDates;
      timeLineList.value = [];
      if (duration == 2) {
        let startDate = new Date(
          // endDates.getTime() - this.timeObject[duration]
           endDates.getTime()
        );
        startDateA.value = startDate;    
        let lineDate, seconds, hours, minu;
        for (let i = 0; i < 5; i++) {
          seconds =
            i == 0 ? startDate.getSeconds() : startDate.getSeconds() + i * 30;
          if (seconds >= 60) {
            if(seconds >= 120){
             seconds = seconds - 120;
             minu = startDate.getMinutes() + 2;
            }else{
             seconds = seconds - 60;
             minu = startDate.getMinutes() + 1;
            }
            hours = startDate.getHours();
            if (minu >= 60) {
              minu = minu - 60;
              hours = startDate.getHours() + 1;
              if (hours >= 24) {
                hours = hours - 24;
              }
            }
          } else {
            minu = startDate.getMinutes();
            hours = startDate.getHours();
          }
          seconds = seconds < 10 ? "0" + seconds : seconds;
          hours = hours < 10 ? "0" + hours : hours;
          minu = minu < 10 ? "0" + minu : minu;
          lineDate = hours + ":" + minu + ":" + seconds;
          timeLineList.value.push(lineDate);
        }
      } 
      getTrendData(time,id);
}
const emit = defineEmits(['transmissionToTrendGridFromTrendChart']);
 //获取趋势图数据//在getParamsNames里面调用
const getTrendData = async(startDate :string | Date,id:string) => {
    let durationL = timeLine.value == "2分钟" ? 2 : (timeLine.value == "30分钟" ? 30:60 );
    duration.value = durationL;
    let requestData = {
    start:formatDate(startDate),
    duration:durationL
    }
    const data = await getTrendDatasApi(id,requestData);
    if(data?.result){
        setTrendChartList(data.result);
        setTimeout(() => {
            emit('transmissionToTrendGridFromTrendChart',data.result,startDateA.value.getTime(),duration);
        });
        await nextTick();
        initEchart();
        setOption();
    }
}
//动态调整页面显示//只在getTrendData里调用
const setTrendChartList = (data:any) => {
    for (let item of trendChartList.value) {
    if(item.code == 'PkPnPe'){
        item.avg = `<span style='margin-left:5px;color:#FF811A'>${data.ppeakAvg >=0 ? data.ppeakAvg:'-'}</span></span><span style='margin-left:5px;color:#333333'>/</span><span style='margin-left:5px;color:333333'>${data.pmeanAvg >=0 ?data.pmeanAvg:'-'}</span><span style='margin-left:5px;color:#333333'>/</span><span style='margin-left:5px;color:#FF811A'>${data.peepAvg >=0 ?data.peepAvg:'-'}</span>`
    }else if(item.code == 'tite'){
        item.avg = `<span style='margin-left:5px;color:#15C875'>${data.vtiAvg >=0 ? data.vtiAvg:'-'}</span><span style='margin-left:5px;color:#333333'>/</span><span style='margin-left:5px;color:#4DA2F2'>${data.vteAvg >=0 ? data.vteAvg:'-'}</span>`
    }else if(item.code == 'fio2'){
        item.avg = `<span style='margin-left:5px;color:#266BFE'>${data.fio2Avg >=0 ? data.fio2Avg:'-'}</span>`
    }else if(item.code == 'mime'){
        item.avg = `<span style='margin-left:5px;color:#11CE6B'>${data.mviAvg >=0 ? data.mviAvg:'-'}</span><span style='margin-left:5px;color:#333333'>/</span><span style='margin-left:5px;color:#4DA2F2'>${data.mveAvg >=0 ? data.mveAvg:'-'}</span>`
    }else if(item.code == 'rr'){
        item.avg = `<span style='margin-left:5px;color:#F6C543'>${data.ftotAvg >=0 ? data.ftotAvg:'-'}</span><span style='margin-left:5px;color:#333333'>/</span><span style='margin-left:5px;color:#333333'>${data.fspnAvg >=0 ? data.fspnAvg:'-'}</span>`
    }else if(item.code == 'rsbi'){
        item.avg = `<span style='margin-left:5px;color:#F4D84E'>${data.rsbiAvg >=0 ? data.rsbiAvg:'-'}</span><span style='margin-left:5px;color:#333333'>/</span><span style='margin-left:5px;color:#FF980C'>${data.fspontAvg >=0 ? data.fspontAvg:'-'}</span>`
    }else if(item.code == 'cdcs'){
        item.avg = `<span style='margin-left:5px;color:#f84475'>${data.cdynAvg >=0 ? data.cdynAvg:'-'}</span><span style='margin-left:5px;color:#333333'>/</span><span style='margin-left:5px;color:#ef7cf6'>${data.cstatAvg >=0 ? data.cstatAvg:'-'}</span>`
    }
    pushTrendData(data, item.code);
    }
}
//获取平均值并且将数据格式处理为趋势图需要的数据//只在setTrendChartList里调用
const pushTrendData = (data:any,msg:string) => {
    if (msg == "PkPnPe") {
    let arryMes = [[],[],[]];
    for(let i=1;i<=data.ppeakList.length;i++){
        let ppeakList = [];
        ppeakList.push(i);
        if(data.ppeakList[i-1] == -11){
        ppeakList.push('');
        }else{
        ppeakList.push(data.ppeakList[i-1]);
        }
        arryMes[0].push(ppeakList);
        let pmeanList = [];
        pmeanList.push(i);
        if(data.pmeanList[i-1] == -11){
        pmeanList.push('');
        }else{
        pmeanList.push(data.pmeanList[i-1]);
        }
        arryMes[1].push(pmeanList);
        let peepList = [];
        peepList.push(i);
        if(data.peepList[i-1] == -11){
        peepList.push('');
        }else{
        peepList.push(data.peepList[i-1]);
        }
        arryMes[2].push(peepList);
    }
    optionData.value[msg] = arryMes;
    } else if (msg == "tite") {
    let arryMes = [[],[]];
    for(let i=1;i<=data.vtiList.length;i++){
        let vtiList = [];
        vtiList.push(i);
        if(data.vtiList[i-1] == -11){
        vtiList.push('');
        }else{
        vtiList.push(data.vtiList[i-1]);
        }
        arryMes[0].push(vtiList);
        let vteList = [];
        vteList.push(i);
        if(data.vteList[i-1] == -11){
        vteList.push('');
        }else{
        vteList.push(data.vteList[i-1]);
        }
        arryMes[1].push(vteList);
    }
    optionData.value[msg] = arryMes;
    } else if (msg == "fio2") {
    let arryMes = [[]];
    for(let i=1;i<=data.fio2List.length;i++){
        let fio2List = [];
        fio2List.push(i);
        if(data.fio2List[i-1] == -11){
        fio2List.push('');
        }else{
        fio2List.push(data.fio2List[i-1]);
        }
        arryMes[0].push(fio2List);
    }
    optionData.value[msg] = arryMes;
    }else if (msg == "mime") {
    let arryMes = [[],[]];
    for(let i=1;i<=data.mviList.length;i++){
        let mviList = [];
        mviList.push(i);
        if(data.mviList[i-1] == -11){
        mviList.push('');
        }else{
        mviList.push(data.mviList[i-1]);
        }
        arryMes[0].push(mviList);
        let mveList = [];
        mveList.push(i);
        if(data.mveList[i-1] == -11){
        mveList.push('');
        }else{
        mveList.push(data.mveList[i-1]);
        }
        arryMes[1].push(mveList);
    }
    optionData.value[msg] = arryMes;
    }else if (msg == "rr") {
    let arryMes = [[],[]];
    for(let i=1;i<=data.ftotList.length;i++){
        let ftotList = [];
        ftotList.push(i);
        if(data.ftotList[i-1] == -11){
        ftotList.push('');
        }else{
        ftotList.push(data.ftotList[i-1]);
        }
        arryMes[0].push(ftotList);
        let fspnArry=[];
        fspnArry.push(i);
        if(data.fspnList[i-1] == -11){
        fspnArry.push('');
        }else{
        fspnArry.push(data.fspnList[i-1]);
        }
        arryMes[1].push(fspnArry);
    }
    optionData.value[msg] = arryMes;
    }else if (msg == "rsbi") {
    let arryMes = [[],[]];
    if(!data.rsbiList) return;
    for(let i=1;i<=data.rsbiList.length;i++){
        let rsbiList = [];
        rsbiList.push(i);
        if(data.rsbiList[i-1] == -11){
        rsbiList.push('');
        }else{
        rsbiList.push(data.rsbiList[i-1]);
        }
        arryMes[0].push(rsbiList);
        let fspontList = [];
        fspontList.push(i);
        if(data.fspontList[i-1] == -11){
        fspontList.push('');
        }else{
        fspontList.push(data.fspontList[i-1]);
        }
        arryMes[1].push(fspontList);
    }
    optionData.value[msg] = arryMes;
    }else if (msg == "cdcs") {
    let arryMes = [[],[]];
    for(let i=1;i<=data.cdynList.length;i++){
        let cdynList = [];
        cdynList.push(i);
        if(data.cdynList[i-1] == -11){
        cdynList.push('');
        }else{
        cdynList.push(data.cdynList[i-1]);
        }
        arryMes[0].push(cdynList);
        let cstatList = [];
        cstatList.push(i);
        if(data.cstatList[i-1] == -11){
        cstatList.push('');
        }else{
        cstatList.push(data.cstatList[i-1]);
        }
        arryMes[1].push(cstatList);
    }
    optionData.value[msg] = arryMes;
    }
}
defineExpose({
    setTimeLineList
})
</script>

<style lang="scss" scoped>
@mixin scrollBarStyle() {
    &::-webkit-scrollbar {
        width: 11px;
        height: 11px;
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
.analys_trend_chart {
  height: 100%;
  width: 100%;
  .chart_x_scale {
    height: 30px;
    width: 100%;
    background-color: #EBEBEB;;
    display: flex;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    & > div:nth-child(1){
        margin-left: 11px;
    }
    & > div {
      font-size: 12px;
      transform: scale(0.84);
      height: 100%;
      width: 51px;
      text-align: center;
      line-height: 30px;
      // margin-left: 11px;
      margin-left: 16px;
      position: relative;
      & > div {
        position: absolute;
        font-size: 12px;
        transform: scale(0.7);
        top: 12px;
        left: 24px;
        color: #000000;
      }
    }
  }
  .chart_x_map {
    height: calc(100% - 30px);
    width: 100%;
    background-color: #ffffff;
    overflow-y: auto;
    @include scrollBarStyle;
    & > div {
      height: 134px;
      width: 100%;
      position: relative;
      .map_title {
        font-family: PingFangSC-Semibold, PingFang SC;
        color: #000000;
        font-weight: Semibold;
        width: 297px;
        height: 20px;
        line-height: 20px;
        padding-left: 36px;
        box-sizing: border-box;
        justify-content: space-between;
        display: flex;
        & > div {
          font-size: 12px;
          //transform: scale(0.84);
        }
        & > div:nth-child(1) {
          &>div{
            display: inline-block;
            width: auto;
            height: 100%;
            text-align: left;
          }
        }
      }
      .map_box {
        width: 307px;
        margin-top: -5px;
        height: calc(100% - 15px);
      }
      .map_box_fragment{
        position: absolute;
        height: 111px;
        background-color: rgba(152, 155, 163, 0.5);
        right: 10px;
        top: 21px;
      }
    }
  }
}
</style>