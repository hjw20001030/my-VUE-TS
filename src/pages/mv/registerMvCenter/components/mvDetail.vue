<template>
   <div class="svm_monitor_center_detail_mv flex">
    <div class="mv_left_waveArea">
        <div class="mv_left_waveArea_top" >
            <div ref="mvWaveAreaRef" >
            
            </div>
        </div>
        <div class="mv_left_waveArea_bottom flex">
            <div ref="mvloopAreaRef" class="mv_left_waveArea_bottom_loop">
                <div class="mv_left_waveArea_bottom_selectOne">
                      <el-select
                        v-model="selectOne"
                        size="small"
                        placeholder="请选择"
                        >
                            <el-option
                                v-for="item in loopOneOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                </div>
                <div class="mv_left_waveArea_bottom_selectTwo">
                       <el-select
                        v-model="selectTwo"
                        size="small"
                        placeholder="请选择"
                        >
                            <el-option
                                v-for="item in loopTwoOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                </div>
            </div>
             <div class="mv_left_waveArea_bottom_trend">
                <div class="mv_left_waveArea_bottom_trend_title" :style="{color:filedA=='cdyn'? '#F84475': '#EF7CF6'}">
                    {{filedA=='cdyn'?'Cdyn':'Cstat'}} <span>(mL/cmH<sub>2</sub>O)</span>
                </div>
                <div class="mv_left_waveArea_bottom_trend_select">
                    <el-select
                    @change="handleChangeTrend"
                        v-model="filedA"
                        size="small"
                        placeholder="请选择"
                        >
                        <el-option
                            label="Cdyn趋势"
                            value="cdyn"
                        ></el-option>
                        <el-option
                            label="Cstat趋势"
                            value="cstat"
                        ></el-option>
                    </el-select>
                </div>
                <div ref="trendChartRef" class="mv_left_waveArea_bottom_trend_chart"></div>
                <div class="mv_left_waveArea_bottom_trend_bottom">
                    Time <span>(min)</span>
                </div>
             </div>
        </div>
    </div>
    <div class="mv_right_Content">
        <div class="mv_right_top">
            <div class="threeContentTwo">
                <div class="big_Font_class" v-for="item of basicBigFontParameters" :key="item.id">
                    <div v-html="item.name" :style="{color:item.nameColor}"></div>
                    <div v-html="item.unit" :style="{color:item.unitColor}"></div>
                    <div>
                        <div :style="{color:item.minMaxColor}">
                            <div>{{item.max}}</div>
                            <div>{{item.min}}</div>
                        </div>
                        <div :style="{color:item.color}" class="valFamily">{{item.val}}</div>
                    </div>
                </div>
                <div class="big_Font_class_bottom">
                    <div v-for="(item,i) in basicParametersTwo" :key="item.id" :style="{color:item.color}" class="threeContent">
                        <div :class="(i+1)%4!=0?'':'specialStyle'" v-html="item.name" :style="{color:item.nameColor}"></div>
                        <div :class="(i+1)%4!=0?'':'specialStyle'">
                            <span class="valFamily">{{item.val}}</span>
                            <div :style="{color:item.unitColor}" v-html="item.unit"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="threeContentOne">
                <div v-for="(item) in basicParameters" :key="item.id" :style="{color:item.color}" class="threeContent">
                    <div  v-html="item.name" :style="{color:item.nameColor}"></div>
                    <div>
                        <span class="valFamily mr_10">{{item.val}}</span>
                        <div :style="{color:item.unitColor}" v-html="item.unit"></div>
                    </div>
                </div>
                <div v-for="(item) in basicParametersFour" :key="item.id" :style="{color:item.color}" class="threeContent">
                    <div  v-html="item.name" :style="{color:item.nameColor}"></div>
                    <div>
                        <span class="valFamily mr_10">{{item.val}}</span>
                        <div :style="{color:item.unitColor}" v-html="item.unit"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mv_right_bottom">
            <div class="mv_right_bottom_content" :style="{height:baseHeight*2+'px',color:item.color}" v-for="item in basicParametersSeeting" :key="item.id">
                <div class="threeContent_left">
                    <div  v-html="item.left[0].name" :style="{padding:item.left[0].name=='-'?'0 0 0 15%':'',color:item.left[0].nameColor,width:item.left[0].name=='通气模式：'?'50%':''}"></div>
                    <div :style="{padding:item.left[0].name=='通气模式'?'0 5px 0 0':'',width:item.left[0].name=='通气模式：'?'50%':''}">
                        <span class="valFamily" :style="{padding:item.left[0].name=='-'?'0 15% 0 0':'',color:item.left[0].color}">{{item.left[0].val}}</span>
                        <div :style="{color:item.left[0].unitColor,padding:item.left[0].name=='通气模式：'?'0':''}" v-html="item.left[0].unit"></div>
                    </div>
                </div>
                <div class="threeContent_right">
                    <div  v-html="item.right[0].name" :style="{padding:item.right[0].name=='-'?'0 0 0 15%':'',color:item.right[0].nameColor,width:item.right[0].name=='通气模式：'?'50%':''}"></div>
                        <div :style="{padding:item.right[0].name=='通气模式'?'0 5px 0 0':'',width:item.right[0].name=='通气模式：'?'50%':''}">
                            <span class="valFamily" :style="{padding:item.right[0].name=='-'?'0 15% 0 0':'',color:item.left[0].color}">{{item.right[0].name?item.right[0].val:''}}</span>
                        <div :style="{color:item.right[0].unitColor,padding:item.right[0].name=='通气模式：'?'0':''}" v-html="item.right[0].unit"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
   </div>
</template>

<script lang='ts' setup>
 export interface MvStyle {
    [key: string]: {
        lineColor: string, lineWidth: number,titleFont:string, font: string,yfont?:string,textColor: string,subFont?:string,unitColor?:string,markColor?:string,coordinateColor?:string, scopeLineColor?: string,xleft?: number,ytop?:number
    }
}
import {ref,onMounted, h,onUnmounted} from 'vue'
import * as IntervalHelp from '@/utils/IntervalHelp';
import {MvLivesApplication} from "@/lib_wave/main";
import {fillDisplay,displaySex,displayAge,fillBedDisplay,formatDate,toPx, toTitleFontPx} from '@/utils/tool'
import SvmTrendCharts from "smo-frontend-lib-charts";
import {getComplianceData} from "@/api/mv/registerMvCenter/API"
const baseHeight = ref<number>(0);
const basicParameters = ref();
const basicParametersTwo = ref();
const basicParametersFour = ref();
const basicBigFontParameters = ref();
const basicParametersSeeting = ref();
const mvloopAreaRef = ref<any>(null);
const mvWaveAreaRef = ref<any>(null);
const mvWave = ref<MvLivesApplication>();
const mvLoop = ref<MvLivesApplication>();
const selectOne = ref<string>('pv');
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
const selectTwo = ref<string>('fv1');
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
const mvStyle: MvStyle = {
    "flow": {
        lineColor: '#4D92F7',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,20,'arial'),
        font: toTitleFontPx(400,10,'arial'),
        textColor: '#4D92F7',
        unitColor:'#30558A',
        markColor:'#C4DCF6',
        coordinateColor:'#7B91AB',
        subFont:toTitleFontPx(400,16,'arial'),
        xleft: 0,
        ytop: 0 
    },
    "paw": {
        lineColor: '#FFA452',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,20,'arial'),
        font: toTitleFontPx(400,10,'arial'),
        subFont:toTitleFontPx(400,16,'arial'),
        textColor: '#FFA452',
        unitColor:'#895E37',
        markColor:'#C4DCF6',
        coordinateColor:'#7B91AB',
        xleft: 0,
        ytop: 0 
    },
    "volume": {
        lineColor: '#3CC6AC',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,20,'arial'),
        subFont:toTitleFontPx(400,16,'arial'),
        font: toTitleFontPx(400,10,'arial'),
        textColor: '#3CC6AC',
        unitColor:'#276F64',
        markColor:'#C4DCF6',
        coordinateColor:'#7B91AB',
        xleft: 0,
        ytop: 0 
    },
    "co2": {
        lineColor: '#F4D84E',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,20,'arial'),
        font: toTitleFontPx(400,10,'arial'),
        subFont:toTitleFontPx(400,16,'arial'),
        textColor: '#F4D84E',
        unitColor:'#837835',
        markColor:'#C4DCF6',
        coordinateColor:'#7B91AB',
        xleft: 0,
        ytop: 0 
    },
    "Pes": {
        lineColor: '#FA541C',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,20,'arial'),
        font: toTitleFontPx(400,10,'arial'),
        subFont:toTitleFontPx(400,16,'arial'),
        textColor: '#FA541C',
        unitColor:'#86361C',
        markColor:'#C4DCF6',
        coordinateColor:'#7B91AB',
        xleft: 0,
        ytop: 0 
    }, 
    "ptp": {
        lineColor: '#FF935F',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,20,'arial'),
        font: toTitleFontPx(400,10,'arial'),
        subFont:toTitleFontPx(400,16,'arial'),
        textColor: '#FF935F',
        unitColor:'#89563E',
        markColor:'#C4DCF6',
        coordinateColor:'#7B91AB',
        xleft: 0,
        ytop: 0 
    },
    "pv": {
        lineColor: '#FFA452',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,14,'arial'),
        subFont:toTitleFontPx(400,14,'arial'),
        font: toTitleFontPx(400,12,'arial'),
        yfont: toTitleFontPx(400,12,'arial'),
        textColor: '#AAAAAA',
        unitColor:'#777777',
        markColor:'#AAAAAA',
        coordinateColor:'#48596B',
        xleft: 0,
        ytop: 0  
    },
    "fv": {
        lineColor: '#4D92F7',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,14,'arial'),
        subFont:toTitleFontPx(400,14,'arial'),
        font: toTitleFontPx(400,12,'arial'),
        yfont: toTitleFontPx(400,12,'arial'),
        textColor: '#AAAAAA',
        unitColor:'#777777',
        markColor:'#AAAAAA',
        coordinateColor:'#48596B',
        xleft: 0,
        ytop: 0  
    },
    "fp": {
        lineColor: '#FFA452',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,14,'arial'),
        subFont:toTitleFontPx(400,14,'arial'),
        font: toTitleFontPx(400,12,'arial'),
        yfont: toTitleFontPx(400,12,'arial'),
        textColor: '#AAAAAA',
        unitColor:'#777777',
        markColor:'#AAAAAA',
        coordinateColor:'#48596B',
        xleft: 0,
        ytop: 0
    },
    "pv1": {
        lineColor: '#FFA452',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,14,'arial'),
        subFont:toTitleFontPx(400,14,'arial'),
        font: toTitleFontPx(400,12,'arial'),
        yfont: toTitleFontPx(400,12,'arial'),
        textColor: '#AAAAAA',
        markColor:'#AAAAAA',
        unitColor:'#777777',
        coordinateColor:'#48596B',
        xleft: 0,
        ytop: 0  
    },
    "fv1": {
        lineColor: '#4D92F7',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,14,'arial'),
        subFont:toTitleFontPx(400,14,'arial'),
        font: toTitleFontPx(400,12,'arial'),
        yfont: toTitleFontPx(400,12,'arial'),
        textColor: '#AAAAAA',
        unitColor:'#777777',
        markColor:'#AAAAAA',
        coordinateColor:'#48596B',
        xleft: 0,
        ytop: 0  
    },
    "fp1": {
        lineColor: '#FFA452',
        lineWidth: toPx(2),
        titleFont:toTitleFontPx(400,14,'arial'),
        subFont:toTitleFontPx(400,14,'arial'),
        font: toTitleFontPx(400,12,'arial'),
        yfont: toTitleFontPx(400,12,'arial'),
        textColor: '#AAAAAA',
        unitColor:'#777777',
        markColor:'#AAAAAA',
        coordinateColor:'#48596B',
        xleft: 0,
        ytop: 0
    }
}
onUnmounted(()=>{
    (MvLivesApplication as any).ADAPTICONALTTUDE = true;
})
const setBasicParmeterTomv = (valOne:any,valtwo:any,valThree:any,valFour:any)=>{
    let valOneSelf = JSON.parse(JSON.stringify(valOne));
    basicParameters.value = valOneSelf.splice(0,9);
    basicParametersTwo.value = valOneSelf.splice(0,3);
    basicParametersFour.value = valtwo;
    basicBigFontParameters.value = valFour;
    let isleft = true;
    basicParametersSeeting.value = [];
    let obj:any = {id:'',left:[],right:[]};
    if(valThree.length % 2 !== 0){
        valThree.push({})
    }
    for(let item of valThree){
        if(obj.left.length>0&&obj.right.length>0){
            obj = {id:'',left:[],right:[]};
        }
        obj.id = item.id;
        if(isleft){
            obj.left.push(item);
            isleft = !isleft;
        }else{
            obj.right.push(item);
            isleft = !isleft;
        }
        if(obj.left.length>0&&obj.right.length>0){
            basicParametersSeeting.value.push(obj);
        }
    }
}
const setBaseHeight = (bsHeight:number)=>{
   baseHeight.value = bsHeight;
   setAdaptive();
}
const setAdaptive = () =>{
    let allWidth = window.innerWidth;//页面总宽度
    (document.getElementsByClassName('svm_monitor_center_detail_mv')[0] as HTMLDivElement).style.height = (baseHeight.value*30)+"px";
    (document.getElementsByClassName('mv_right_bottom')[0] as HTMLDivElement).style.height = (baseHeight.value*6)+"px";
    (document.getElementsByClassName('mv_right_Content')[0] as HTMLDivElement).style.width = (baseHeight.value*17)+"px";//右侧参数宽度为17栅格
    (document.getElementsByClassName('mv_left_waveArea')[0] as HTMLDivElement).style.width = (allWidth-(baseHeight.value*17))+"px";//左侧波形宽度
    (mvWaveAreaRef.value as HTMLDivElement).style.height = (baseHeight.value*30)+"px";//波形区域高度为30栅格
    (mvloopAreaRef.value as HTMLDivElement).style.height = (baseHeight.value*12)+"px";//环形区域高度
    (document.getElementsByClassName('mv_right_top')[0] as HTMLDivElement).style.height = (baseHeight.value*24)+"px";
    (document.getElementsByClassName('threeContentTwo')[0] as HTMLDivElement).style.width = (baseHeight.value*17/2)+"px";
    (document.getElementsByClassName('threeContentOne')[0] as HTMLDivElement).style.width = (baseHeight.value*17/2)+"px";
    (document.getElementsByClassName('threeContentTwo')[0] as HTMLDivElement).style.height =(baseHeight.value*24)+"px";
    (document.getElementsByClassName('threeContentOne')[0] as HTMLDivElement).style.height = (baseHeight.value*24)+"px";
    (trendChartRef.value as HTMLDivElement).style.height = (baseHeight.value*11.7)+"px";
    (mvloopAreaRef.value as HTMLDivElement).style.width = (baseHeight.value*28)+"px";
    (document.getElementsByClassName('mv_left_waveArea_bottom_trend')[0] as HTMLDivElement).style.width = (allWidth-(baseHeight.value*45))+"px";
    (MvLivesApplication as any).ADAPTICONALTTUDE = false;
    mvWave.value = new MvLivesApplication(mvWaveAreaRef.value as HTMLElement,['paw','flow','volume','pes','ptp'],'waveShape' as string,true);
    mvLoop.value = new MvLivesApplication(mvloopAreaRef.value as HTMLElement,['paw','flow','volume'],'loopGraph' as string,true);
    mvWave.value.setMvStyle(mvStyle);
    mvLoop.value.setMvStyle(mvStyle);
    let endDates = new Date();
    if (endDates.getSeconds() > 0) {
        endDates = new Date(
            endDates.getFullYear(),
            endDates.getMonth(),
            endDates.getDate(),
            endDates.getHours(),
            endDates.getMinutes(),
            0
        );
        endDate.value = new Date(endDates.getTime() + 60000);
    } else {
        endDate.value = endDates;
    }
    let startDates:any = endDate.value.getTime() - 10*60000;
    startDate.value = new Date(startDates);
    loadingTrendChart([])
}
const trendChartRef = ref<any>(null)
const charts = ref<SvmTrendCharts>();
const endDate = ref<string | Date>('');
const startDate = ref<string | Date>('');
const filedA = ref<string>('cdyn');
const getTrendChartData = ()=>{
    let parmtStartDate = formatDate(startDate.value,'yyyyMMddhhmmss');
    let parmtEndDate = formatDate(endDate.value,'yyyyMMddhhmmss');
    getComplianceData({
            serviceCode: serviceCode.value,
            startDate: parmtStartDate,
            endDate: parmtEndDate,
            filed:filedA.value
        })
        .then(data => {
            if (data.result) {
                loadingTrendChart(dealDataToTrendChart(data.result));
            }
        });
}
const mvReset = () => {
    if(mvWave.value){
        setTimeout(()=>{
            mvWave.value.reset();
        })  
    }
    if(mvLoop.value){
        setTimeout(()=>{
            mvLoop.value.reset();
        })
    }
    loadingTrendChart([]);
}
const dealDataToTrendChart = (data:number[]) =>{
    let ary:any = [];
    let statDate = startDate.value;
    let timeTml = statDate.getTime();
    for(let item of data){
        let aryobj:any = {};
        if(item == -1){
            aryobj['y'] = undefined;
        }else{
            aryobj['y'] = item;
        }
        aryobj['x'] = formatDate(new Date(timeTml),'yyyy-MM-dd hh:mm:ss');
        ary.push(aryobj);
        timeTml = timeTml+1000*30;
    }
    return ary;
}
const serviceCode = ref<string>('');
let hasSetTime:boolean = false;
let timeTrendChart:any;
let isFirstLoad:boolean = true;
const setServiceCode = (serviceCodes:string,endTimes:string) =>{
    serviceCode.value = serviceCodes;
    let endDates = new Date(endTimes);
    if (endDates.getSeconds() > 0) {
        endDates = new Date(
            endDates.getFullYear(),
            endDates.getMonth(),
            endDates.getDate(),
            endDates.getHours(),
            endDates.getMinutes(),
            0
        );
        endDate.value = new Date(endDates.getTime() + 60000);
    } else {
        endDate.value = endDates;
    }
    let startDates:any = endDate.value.getTime() - 10*60000;
    startDate.value = new Date(startDates);
    if(isFirstLoad){
        getTrendChartData();
        isFirstLoad = false;
    }
    if(hasSetTime) return;
    hasSetTime = true;
    timeTrendChart = setTimeout(function(){
        getTrendChartData();
        hasSetTime = false;
    },60000)
}
const handleChangeTrend = (val:string) =>{
    filedA.value = val;
    let startDates:any = endDate.value.getTime() - 10*60000;
    startDate.value = new Date(startDates);
    getTrendChartData();
}
const loadingTrendChart = (data:any) =>{
    let chartsDom =  trendChartRef.value;
    if(!charts.value){
        charts.value = new SvmTrendCharts(chartsDom as HTMLElement);
    }
    let objOption:any = {
        grid: {
            color: "#2A333D",
            type: "dashed",
            top: baseHeight.value,
            bottom: baseHeight.value,
            left: baseHeight.value*2,
            right: baseHeight.value,
            rows: 6,
            cols: 6
        },
        scale: {
            y: { max:100, min: 0, interval: 20, color: "#AAAAAA", fontSize: toPx(12).toString(),textPadding:[0,21,0,0]},
            x: {
                type: "time",
                max: formatDate(endDate.value,'yyyy-MM-dd hh:mm:ss'),
                min: formatDate(startDate.value,'yyyy-MM-dd hh:mm:ss'),
                interval:
                (endDate.value.getTime() -
                    startDate.value.getTime()) /
                5,
                fontSize: toPx(12).toString(),
                color: "#C4DCF6",
                textPadding:[6,0,0,0],
                formatter: (date: any) => {
                    return formatDate(date, "hh:mm");
                }
            }
        },
        series: [
            {
                type: "line",
                opacity: 0.5,
                data: [],
                color: "#F84475",
                rectColor: "#fff",
                rectOpacity: 0.5,
                rectWidth: toPx(5),
                symbol: false,
                lineWidth: toPx(2)
            }
        ]
    }
    objOption.series[0].data = data;
    if(filedA.value == 'cdyn'){
        objOption.series[0].color = '#F84475'
    }else{
        objOption.series[0].color = '#EF7CF6'
    }
    charts.value?.setOptions(objOption);
}
const pushMvData = (data:any) =>{
    setTimeout(function(){
        mvWave.value?.pushData(data);
    })
    setTimeout(function(){
        mvLoop.value?.pushData(data);
    })
}
defineExpose({
    setBasicParmeterTomv,
    setBaseHeight,
    pushMvData,
    setServiceCode,mvReset
})
</script>

<style lang='scss' scope>
$selfBorderColor: 1px solid #2a313b;
::-webkit-scrollbar {
    width: 5px;
    height: 5px
}

::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 5px
}

::-webkit-scrollbar-thumb {
    background: #44444f;
    border-radius: 5px
}

::-webkit-scrollbar-thumb:hover {
    background: #44444f
}
.svm_monitor_center_detail_mv {
    width: 100%;
    height: 100%;
    .mv_left_waveArea{
        width: calc(100% - 508px);
        height: 100%;
        .mv_left_waveArea_top{
            height: 60%;
            width: 100%;
            transition: 1s;
            overflow-y: scroll;
        }
        .mv_left_waveArea_bottom{
            border-top: $selfBorderColor;
            height:40%;
            width: 100%;
            .mv_left_waveArea_bottom_loop{
                position: relative;
                >div{
                    width: 100px;
                    height: 30px;
                    position: absolute;
                    z-index: 99999;
                    .el-select{
                        width: 100%;
                        height: 100%;
                        border: none;
                        .el-select__wrapper{
                            box-shadow: none;
                            background-color: transparent;
                        }
                    }
                    
                }
                .mv_left_waveArea_bottom_selectOne{
                    left: 50%;
                    transform: translateX(-150%);
                }
                .mv_left_waveArea_bottom_selectTwo{
                    left: 100%;
                    transform: translateX(-150%);
                }
            }
            .mv_left_waveArea_bottom_trend{
                width: 469px;
                height: 100%;
                border-left: $selfBorderColor;
                position: relative;
                .mv_left_waveArea_bottom_trend_title{
                    display: flex;
                    color: #f16af4;
                    position: absolute;
                    font-size: 14px;
                    transform: rotate(-90deg);
                    left: -45px;
                    top: 50%;
                    >span{
                        margin-left: 4px;
                    }
                }
                .mv_left_waveArea_bottom_trend_select{
                    position:absolute;
                    right: 57px;
                    z-index: 1;
                    width: 100px;
                    height: 30px;
                    .el-select{
                        width: 100%;
                        height: 100%;
                        border: none;
                        .el-select__wrapper{
                            box-shadow: none;
                            background-color: transparent;
                        }
                    }
                }
                .mv_left_waveArea_bottom_trend_chart{
                    margin-top: 0;
                    height: calc(100% - 40px);
                    width: 100%;
                }
                .mv_left_waveArea_bottom_trend_bottom{
                    display: flex;
                    font-size: 14px;
                    color: #AAAAAA;
                    position: absolute;
                    bottom: 1%;
                    left: 50%;
                    >span{
                        margin-left: 4px;
                    }
                }
            }
        }
    }
    .mv_right_Content{
        width: 508px;
        height: 100%;
         .mv_right_top{
            width: 100%;
            // height: 100%;
            display: flex;
            &>div{
                box-sizing: border-box;
                height: 100%;
            }
            .threeContentOne{
                //width:px2rem(254,25.6);
                background: #1D2229;
                border-left: $selfBorderColor;
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                .threeContent{
                    display: flex;
                    justify-content: space-between;
                    height: calc(calc(100% / 12) - 1px);
                    border-top: $selfBorderColor;
                    padding-right: 20px;
                    &>div:nth-child(1){
                        height: 100%;
                        display: flex;
                        align-items: center;
                        padding-left: 14px;
                    }
                    &>div:nth-child(2){
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding-right: 14;
                        &>div:nth-child(2){
                            font-size: 16px;
                            padding-left: 8;
                        }
                    }
                }
                &>div:nth-child(-n+11){
                    &>div:nth-child(2){
                        &>span{
                            font-size: 26px;
                        }
                    }
                }
            }
            .threeContentTwo{
                //width:calc(100% - 9.921rem);
                background: #1D2229;
                .big_Font_class{
                    height: 25%;
                    width: 100%;
                    box-sizing: border-box;
                    border-top: $selfBorderColor;
                    padding-top: 14px;
                    &>div:nth-child(1){
                        box-sizing: border-box;
                        height:28px;
                        font-size: 20px;
                        padding-left: 24px;
                    }
                    &>div:nth-child(2){
                        box-sizing: border-box;
                        font-size:16px;
                        height: 22px;
                        padding-left: 14px;
                    }
                    &>div:nth-child(3){
                        display: flex;
                        width: 100%;
                        padding-top:4px;
                        height: calc(100% - 40px);
                        position: relative;
                        &>div:nth-child(1){
                            box-sizing: border-box;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            padding-bottom: 30px;
                            padding-top: 10px;
                            padding-left: 14px;
                            width: 30%;
                            height: 100%;
                            font-size: 20px;
                            font-family: DINAlternate-Bold, DINAlternate;
                            font-weight: bold;
                        }
                        &>div:nth-child(2){
                            position: absolute;
                            text-align: center;
                            right: 5px;
                            bottom:21px;
                            width: 70%;
                            font-size: 90px;
                            font-family: DINAlternate-Bold, DINAlternate;
                            font-weight: bold;
                            top: 0px;
                        }
                    }
                }
                .big_Font_class_bottom{
                    font-size: 20px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    height: 33.333333333%;
                    width: 100%;
                    .threeContent{
                        display: flex;
                        justify-content: space-between;
                        height: 25%;
                        border-top: $selfBorderColor;
                        &>div:nth-child(1){
                            width: 120px;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            padding-left:14px;
                        }
                        &>div:nth-child(2){
                            width:120px;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                            padding-right: 14px;
                            &>div:nth-child(2){
                                font-size: 16px;
                                padding-left:8px;
                            }
                        }
                    }
                }
            }
        }
        .mv_right_bottom{
            width: 100%;
            overflow: auto;
            .mv_right_bottom_content{
                background: #393f46;
                height: calc(calc(100% / 3) - 1px - 1px) !important;
                width: 100%;
                border-top: $selfBorderColor;
                border-bottom: $selfBorderColor;
                display: flex;
                white-space:nowrap;
                .threeContent_left{
                    height: calc(100%);
                    width: calc(50%);
                    display: flex;
                    justify-content: space-between;
                    border-right: $selfBorderColor;
                    font-size: 20px;
                    &>div:nth-child(1){
                        width: 175px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        text-align: left;
                        padding-left: 14px;
                    }
                    &>div:nth-child(2){
                        width:105px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        text-align: right;
                        justify-content: flex-end;
                        padding-right: 14px;
                        &>div:nth-child(2){
                            font-size: 16px;
                            padding-left: 8px;
                        }
                    }
                }
                .threeContent_right{
                    display: flex;
                    justify-content: space-between;
                    width: calc(50% - 4px);
                    height: 100%;
                    font-size: 20px;
                    &>div:nth-child(1){
                        width: 140px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        padding-left: 14px;
                    }
                    &>div:nth-child(2){
                        width: 105px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding-right: 14px;
                        &>div:nth-child(2){
                            font-size: 16px;
                            padding-left: 8px;
                        }
                    }
                }
            }
        }
    }
}
</style>