<template>
    <div class="realtime_analys_census">
    <div class="analys_census_top">
      <div >呼吸参数</div>
      <div>
        <span class="iconfonts icon_sidebar"></span>
      </div>
    </div>
    <div class="analys_census_down">
      <div>
        <div class="userbasicInfo">
             <div class="infotitle">
               病人基本信息
             </div>
             <div class="table">
                  <div class="item" v-for="(v,i) in basicInfo" :key="i">
                    <div>{{v.name}}</div>
                    <div>{{v.val}}</div>
                  </div>
             </div>
        </div>
        <div class="usersetParameters">
             <div class="infotitle">
               设置参数
             </div>
             <div class="table">
                  <div class="items">
                    <div >通气模式</div>
                    <div >{{ventModeName}}</div>
                  </div>
                  <div class="item" v-for="(v,i) in setParameters" :key="i">
                    <div >{{v.name}}</div>
                    <div >{{v.val}}</div>
                  </div>
             </div>
        </div>
         <div class="multiParameters">
             <div class="infotitle">
              <span @click="scrollTo(0)" :class="{C_5149DB:currentscrollTop>=0&&currentscrollTop<scrollToArr[1]}">通用监测参数</span> 
              <span>|</span>
              <span @click="scrollTo(1)" :class="{C_5149DB:currentscrollTop>=scrollToArr[1]&&currentscrollTop<scrollToArr[2]}">呼吸力学和通气</span>
              <span>|</span>
              <span @click="scrollTo(2)" :class="{C_5149DB:currentscrollTop>=scrollToArr[2]}">脱机评估</span>
             </div>
             <div>
               <div class="table">
                  <div class="item" v-for="(v,i) in monitor" :key="i">
                    <div >{{v.name}}</div>
                    <div >{{v.val}}</div>
                  </div>
             </div>
             <div class="table">
                  <div class="item" v-for="(v,i) in monitor1" :key="i">
                    <div >{{v.name}}</div>
                    <div >{{v.val}}</div>
                  </div>
             </div>
               <div class="table">
                  <div class="item" v-for="(v,i) in monitor2" :key="i">
                    <div >{{v.name}}</div>
                    <div >{{v.val}}</div>
                  </div>
             </div>
              <div class="table">
                  <div class="item" v-for="(v,i) in monitor3" :key="i">
                    <div >{{v.name}}</div>
                    <div>{{v.val}}</div>
                  </div>
             </div>
             </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref,onMounted} from 'vue'
import {setParameters as $setParameters} from '@/utils/tool'
const ventMode = ref('P-A/C');//当前的通气模式
//设置参数 根据不同通气模式
const setParameters = ref([]);//设置参数 根据不同通气模式   
//多参数 滚动条距离
const scrollToArr = ref([0]);
//当前 滚动条距离
const currentscrollTop = ref(0);
//
const ventModeName = ref('-');
const monitor1 = ref([  
    {field:'ppeak',id:'0031',name:'峰值压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'pplat',id:'0001',name:'平台压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'pmean',id:'0002',name:'平均气道压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'peep',id:'0003',name:'呼气末正压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'rinsp',id:'0032',min:'2.9',max:'7.4',name:'吸气阻力',val:'-',unit:'L/min'},
    {field:'rexp',id:'0032',min:'2.9',max:'7.4',name:'呼气阻力',val:'-',unit:'L/min'},
    {field:'cstat',id:'0042',name:'静态顺应性',val:'-',unit:'mL/cmH<sub>2</sub>O'},
    {field:'cdyn',id:'0014',name:'动态顺应性',val:'-',unit:'mL/cmH<sub>2</sub>O'},
    {field:'PEEPi',id:'0014',name:'PEEPi',val:'-',unit:'mL/cmH<sub>2</sub>O'},
    {field:'Pes',id:'0014',name:'食道压',val:'-',unit:'mL/cmH<sub>2</sub>O'},
    {field:'Ptp',id:'0014',name:'跨肺压',val:'-',unit:'mL/cmH<sub>2</sub>O'},
]);
const monitor3 = ref([
    {field:'fio2',id:'0033',min:'18',max:'31',name:'吸入氧浓度',val:'-',unit:'%',color:'#333333'},
    {field:'peep',id:'0003',name:'呼气末正压',val:'-',unit:'cmH<sub>2</sub>O',color:'#333333'},
    {field:'mve',id:'0032',min:'2.9',max:'7.4',name:'分钟通气量',val:'-',unit:'L/min',color:'#333333'},
    {field:'deltaPInspConf',id:'0003',name:'Δ吸气压',val:'-',unit:'cmH<sub>2</sub>O',color:'#333333'},
    {field:'rsbi',id:'0043',name:'浅快呼吸指数',val:'-',unit:'1/(min-L)',color:'#333333'},
    {field:'fspn%',id:'0032',min:'2.9',max:'7.4',name:'自主通气频率%',val:'-',unit:'L/min',color:'#333333'},
]);
const monitor = ref([
    {field:'ppeak',id:'0031',name:'峰值压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'pplat',id:'0001',name:'平台压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'pmean',id:'0002',name:'平均气道压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'peep',id:'0003',name:'呼气末正压',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'deltaPInspConf',id:'0003',name:'Δ吸气压力',val:'-',unit:'cmH<sub>2</sub>O'},
    {field:'vti',id:'0005',name:'吸气潮气量',val:'-',unit:'mL'},
    {field:'vte',id:'0006',name:'呼气潮气量',val:'-',unit:'mL',},
    {field:'mve',id:'0032',min:'2.9',max:'7.4',name:'分钟通气量',val:'-',unit:'L/min'},

    {field:'MVspont',id:'0032',min:'2.9',max:'7.4',name:'自主分钟通气量',val:'-',unit:'L/min'},
    {field:'ftot',id:'0032',min:'2.9',max:'7.4',name:'总呼吸频率',val:'-',unit:'L/min'},
    {field:'fspn',id:'0032',min:'2.9',max:'7.4',name:'自主呼吸频率',val:'-',unit:'L/min'},
    {field:'rinsp',id:'0032',min:'2.9',max:'7.4',name:'吸气阻力',val:'-',unit:'L/min'},
    {field:'cdyn',id:'0014',name:'动态顺应性',val:'-',unit:'mL/cmH<sub>2</sub>O'}, 
]);
const monitor2 = ref([
    {field:'vti',id:'0005',name:'吸气潮气量',val:'-',unit:'mL'},
    {field:'vte',id:'0006',name:'呼气潮气量',val:'-',unit:'mL',},
    {field:'vti1',id:'0005',name:'自主吸气潮气量',val:'-',unit:'mL'},
    {field:'vtespn',id:'0006',name:'自主呼气潮气量',val:'-',unit:'mL',},
    {field:'mve',id:'0032',min:'2.9',max:'7.4',name:'分钟通气量',val:'-',unit:'L/min'},
    {field:'MVspont',id:'0032',min:'2.9',max:'7.4',name:'自主分钟通气量',val:'-',unit:'L/min'},
    {field:'tinspConf',id:'1003',name:'吸气时间',val:'-',unit:'s',nameColor:'#D3D3D3',color:'#D3D3D3',unitColor:'#8D8D8D'},
    {field:'tenspConf',id:'1003',name:'呼气时间',val:'-',unit:'s',nameColor:'#D3D3D3',color:'#D3D3D3',unitColor:'#8D8D8D'},
    {field:'inspExpRatio',id:'1007',name:'吸呼比',val:'-',unit:'-',nameColor:'#CDCDCD',color:'#CDCDCD',unitColor:'#8D8D8D'},
    {field:'vtePerIbw',id:'0032',min:'2.9',max:'7.4',name:'VT/IBW',val:'-',unit:'L/min'},
    {field:'rcinsp',id:'0032',min:'2.9',max:'7.4',name:'吸气时间常数',val:'-',unit:'L/min'},
    {field:'rcexp',id:'0032',min:'2.9',max:'7.4',name:'呼气时间常数',val:'-',unit:'L/min'},
    {field:'PIF',id:'0032',min:'2.9',max:'7.4',name:'吸气峰流速',val:'-',unit:'L/min'},
    {field:'PEF',id:'0032',min:'2.9',max:'7.4',name:'呼气峰流速',val:'-',unit:'L/min'},     
    {field:'Vleak',id:'0032',min:'2.9',max:'7.4',name:'漏气量',val:'-',unit:'L/min'},
    {field:'%leak',id:'0032',min:'2.9',max:'7.4',name:'漏气量%',val:'-',unit:'L/min'},
    {field:'P0.1',id:'0032',min:'2.9',max:'7.4',name:'气道闭合压',val:'-',unit:'L/min'},
]);
//基本信息
const basicInfo = ref([
        {field:'height',name:'身高',val:'-'},
        {field:'ibw',name:'理想体重',val:'-'},
        {field:'tubeSizeConf',name:'插管型号',val:'-'},
        {field:'atcConf',name:'自动插管补偿',val:'-'},
      ])
onMounted(()=>{
  setParameters.value = $setParameters(ventMode.value);
  initTable();
})

const initTable = async()=>{
   if(document.getElementsByClassName('null_dom')[0]){
        document.getElementsByClassName('null_dom')[0].remove();
    }
    let hDom = document.getElementsByClassName('multiParameters')[0].children[1].children;
    let dom = document.createElement('div');
    let h = hDom[0]?.offsetHeight + hDom[1]?.offsetHeight + hDom[2]?.offsetHeight*2;
    dom.style.height = h+18+'px';
    dom.className = "null_dom";
    document.getElementsByClassName('multiParameters')[0].children[1].appendChild(dom);
    setScrollToArr();
    document.getElementsByClassName('multiParameters')[0].children[1].onscroll = ((e)=>{
        currentscrollTop.value = e.target.scrollTop
    })
}

const setScrollToArr = ()=>{
    scrollToArr.value = [0];
    let setTop= document.getElementsByClassName('multiParameters')[0].children[1].children;
    let set1 = setTop[1].offsetTop - (document.getElementsByClassName('multiParameters')[0].children[1].offsetTop);
    scrollToArr.value.push(set1);
    let set2 = setTop[3].offsetTop - (document.getElementsByClassName('multiParameters')[0].children[1].offsetTop+1);
    scrollToArr.value.push(set2);
}

const scrollTo = (index)=>{
    document.getElementsByClassName('multiParameters')[0].children[1].scrollTo(0,scrollToArr.value[index]);
    currentscrollTop.value = scrollToArr.value[index];
    // if(index==2) trendloading.value = true;
}

 //获取设置与监测参数数据
const getCensusData = (data:any) => {
    ventMode.value = data.ventilationMode;
    setParameters.value = $setParameters(data.ventilationModeCategory);
    //当通气模式是PSV时，Δ吸气压力显示为Δ支持压力
    if(ventMode.value=='P-SIMV'||ventMode.value=='CPAP/PSV'){
    monitor.value[4].name='Δ支持压力'
    }else{
    monitor.value[4].name='Δ吸气压力'
    }
    for(let item of monitor.value){
    if(data[item.field]!=undefined){
        item.val = data[item.field];
    }else{
        item.val = "-";
    }
    }
    for(let basicInfos of basicInfo.value){
    if(data[basicInfos.field]!=undefined){
        basicInfos.val = data[basicInfos.field];
    }else{
        basicInfos.val = "-";
    }
    }
    if(setParameters.value){
    ventModeName.value = ventMode.value;
    for(let setParametersitem of setParameters.value){  
        if(data[setParametersitem.field]!=undefined){
        setParametersitem.val = data[setParametersitem.field];
        }else{
        setParametersitem.val = '-';
        }
    if(setParametersitem.field=='inspExpRatioConf'&&data[setParametersitem.field]==undefined){
        setParametersitem.name = '吸气时间'
        setParametersitem.val =data.tinspConf;
        }
        if(setParametersitem.field=='pauseTimeConf'&&data[setParametersitem.field]!=undefined||
        setParametersitem.field=='expTriggerConf'&&data[setParametersitem.field]!=undefined){
        setParametersitem.val =data[setParametersitem.field]+'%';
        }
    }
    }else{
        this.ventModeName = '-';
        this.ventMode = 'P-A/C'
    }
    for(let monitor1item of monitor.value){
        if(data[monitor1item.field]!=undefined){
        monitor1item.val = data[monitor1item.field];
        }else{
        monitor1item.val = '-';
        }
    }

    for(let monitor2item of monitor.value){
        if(data[monitor2item.field]!=undefined){
        monitor2item.val = data[monitor2item.field];
        }else{
        monitor2item.val = '-';
        }
        //分钟漏气量（MVleak）=吸气分钟通气量（MVi）-呼气分钟通气量（MVe）
        var mvi='',leak='',Vleak=''
        if(!data.mvi){
        if(data.mvleak&&data.mve){
            mvi=Number(data.mvleak)+Number(data.mve)//算出mvi
            leak =(Number(data.mvleak)/mvi*100).toFixed(1)//漏气量%（%leak）=分钟漏气量（MVleak）/分钟吸气潮气量（MVi）
            if(data.vtConf){
            Vleak = ((leak/100)*Number(data.vtConf)).toFixed(1)//漏气量（Vleak）=漏气量%（%leak）× 潮气量设置（VT）
            }
        }
        }
        if(monitor2item.field=='Vleak'){
        monitor2item.val =Vleak?Vleak:'-';
        }
        if(monitor2item.field=='%leak'){
        monitor2item.val =leak?leak+'%':'-';
        }
    }

    for(let monitor3item of monitor.value){
        if(data[monitor3item.field]!=undefined && monitor3item.field!='fspn%'){
        monitor3item.val = data[monitor3item.field];
        switch (monitor3item.field) {
        case 'fio2':
            if(monitor3item.val<40){
                monitor3item.color = '#FF0000';
            }else{
                monitor3item.color = '#333333'; 
            }
            break;
        case 'peep':
            if(monitor3item.val<8){
                monitor3item.color = '#FF0000';
            }else{
                monitor3item.color = '#333333'; 
            }
        break;
            case 'mve':
            if(monitor3item.val>=3.5 && monitor3item.val<=10.5){
            monitor3item.color = '#FF0000';
            }else{
                monitor3item.color = '#333333'; 
            }
        break;
            case 'deltaPInspConf':
            if(monitor3item.val<10){
                monitor3item.color = '#FF0000';
            }else{
                monitor3item.color = '#333333'; 
            }
        break;
            case 'rsbi':
            if(data.fspn=='0'&&data.vtespn=='0'){
                monitor3item.val='-'
            }else{
                if(monitor3item.val>=10 && monitor3item.val<=100){
                monitor3item.color = '#FF0000';
                }else{
                monitor3item.color = '#333333'; 
                }
            }
        break;
        }
        }else{
        monitor3item.val = "-";
        monitor3item.color = '#333333'; 
        }
        if(monitor.value[9].val!='-' && monitor.value[9].val !=0 && monitor.value[10].val!='-'){
        monitor.value[11].val = Math.round((monitor.value[10].val / monitor.value[9].val).toFixed(2) * 100) + '%';
        if( monitor.value[11].val>=75 &&  monitor.value[11].val<=100){
            monitor.value[11].color = '#FF0000';
        }else{
            monitor.value[11].color = '#333333'; 
        }
        }else{
        monitor.value[11].val = '-';
        monitor.value[11].color = '#333333'; 
        }
    }
}
defineExpose({
    getCensusData
})
</script>

<style lang="scss" scoped>
@mixin scrollBarStyle() {
    &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
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
.realtime_analys_census {
  width: calc(100%);
  height: 100%;
  background: #eeeeee;
  .analys_census_top {
    height: 40px;
    width: 100%;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    display: flex;
    box-sizing: border-box;
    padding-left: 8px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    border-left: 1px solid #DDDDDD;
    &>div:nth-child(1){
      width: 64.1px;
      height: 32px;
      line-height: 32px;
      margin-left: 5px;
      background-color: #DDDDDD;
      text-align: center;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-top: 9px;
      user-select: none;
    }
    &>div:nth-child(2){
       margin-right: 8px;
       line-height: 40px;
    }
  }
  .analys_census_down {
    // height: calc(100% - 40px);
    height: calc(100% - 30px);
    width: 100%;
    display: flex;
  
  }
}
  .iconfonts{
        font-family: "iconfont" !important;
            font-size: 16px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
        }
  .infotitle{
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    font-size: 12px;
    height: 29px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    border-bottom: 1px solid #DDDDDD;
    border-left: 1px solid #DDDDDD;
    line-height: 29px;
  }
  .userbasicInfo{
    &>.table{
      max-height: 58px;
      overflow-y: scroll;
      background-color: #ffffff;
      @include scrollBarStyle;
      &>.item{
        display: flex;
        float: left;
        width: 50%;
        &>div{
          box-shadow: inset -1px -1px 0 0 #DDDDDD;
          background: #FFFFFF;
          text-align: right;
          line-height: 29px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
        }
        &>div:nth-child(1){
            padding-right: 10px;
            width: 65%;
        }
        &>div:nth-child(2){
            text-align: center;
            width: 35%;
        }
      }
    }
  }
  .usersetParameters{
       &>.table{
      max-height: 116px;
      overflow-y: scroll;
          background-color: #ffffff;
           @include scrollBarStyle;
          &>.items{
            display: flex;
            float: left;
            width: 100%;
            &>div{
          box-shadow: inset -1px -1px 0 0 #DDDDDD;
          background: #FFFFFF;
          text-align: right;
          line-height: 29px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
        }
        &>div:nth-child(1){
            padding-right: 10px;
            width: 32%;
        }
        &>div:nth-child(2){
            text-align: center;
            width: 68%;
        }
          }
      &>.item{
        display: flex;
        float: left;
        width: 50%;
        &>div{
          box-shadow: inset -1px -1px 0 0 #DDDDDD;
          background: #FFFFFF;
          text-align: right;
          line-height: 29px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
        }
        &>div:nth-child(1){
            padding-right: 10px;
            width: 65%;
        }
        &>div:nth-child(2){
            text-align: center;
            width: 35%;
        }
      }
    }
  }
  .C_5149DB{
    color: #5149DB;
  }  
  .multiParameters{
    height: calc(100% - 264px);
    &>.infotitle{
    //   &>span:nth-child(1){
    //   color: #5149DB;
    // }
    &>span:nth-child(2),span:nth-child(4){
      color: #ccc;
    }
    &>span{
      cursor: pointer;
      user-select: none;
    }
    }
    &>div:nth-child(2){
      overflow-y: scroll;
      height: calc(100% - 9px);
      @include scrollBarStyle;
    &>.table{
      // max-height: 58px;
      // overflow-y: scroll;
     overflow: hidden;
      margin-bottom: 6px;
      background-color: #ffffff;
      &>.item{
        display: flex;
        float: left;
        width: 50%;
        &>div{
          box-shadow: inset -1px -1px 0 0 #DDDDDD;
          background: #FFFFFF;
          text-align: right;
          line-height: 29px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
        }
        &>div:nth-child(1){
            padding-right: 10px;
            width: 65%;
        }
        &>div:nth-child(2){
            text-align: center;
            width: 35%;
        }
      }
    }}
  }
</style>