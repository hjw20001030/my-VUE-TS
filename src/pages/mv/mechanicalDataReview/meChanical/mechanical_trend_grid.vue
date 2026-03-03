<template>
  <div class="analys_trend_grid">
    <div class="grid_trend">
      <el-table
        :data="trendGridData"
        style="width:100%"
        height="100%"
        :size="'small'"
        border
        id="trendGrid"
      >
        <el-table-column prop="time" label="时间" :width="toPx(100)"></el-table-column>
        <template v-for="item in columnData">
          <el-table-column :prop="item.code" :label="item.name" :width="item.code=='fspont'?toPx(65,'px'):toPx(59,'px')"  :key="item.code" v-if="item.isShow">
         </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref,nextTick } from 'vue'
import { toPx } from '@/utils/tool'
const trendGridData = ref([]);
const columnData = ref([{name:'FiO2',code:'fio2',isShow:true},{name:'Ppeak',code:'ppeak',isShow:true},{name:'Pmean',code:'pmean',isShow:true},{name:'PEEP',code:'peep',isShow:true},{name:'MVi',code:'mvi',isShow:true},{name:'MVe',code:'mve',isShow:true},{name:'VTi',code:'vti',isShow:true},{name:'VTe',code:'vte',isShow:true},{name:'RSB',code:'rsbi',isShow:true},{name:'%fspont',code:'fspont',isShow:true},{name:'ftot',code:'ftot',isShow:true},{name:'fspn',code:'fspn',isShow:true},{name:'Cdyn',code:'cdyn',isShow:true},{name:'Cstat',code:'cstat',isShow:true}]);
const selfData = ref([]);
const duration = ref(32);
const isScollLoading = ref<boolean>(true);

const setGridData = (data:object,startTime:string,durations:string) => {
    selfData.value = [];
    duration.value = durations;
    if(!data||!startTime||!duration.value) return;
    dealDataGrid(data,startTime,120);
}
const dealDataGrid = async (data:object,timeLine:string | number,duration:string | number) =>{
    trendGridData.value = [];
    timeLine = new Date(timeLine).getTime()-1000;
    await nextTick();
     for(let i=0;i<duration;i++){
        let obj={};
        let startDate = new Date(timeLine);
        startDate = new Date(startDate.getTime()+1000);
        let hors = startDate.getHours()<10?'0'+startDate.getHours():startDate.getHours();
        let mis = startDate.getMinutes()<10?'0'+startDate.getMinutes():startDate.getMinutes();
        let seds = startDate.getSeconds()<10?'0'+startDate.getSeconds():startDate.getSeconds();
        obj.time = hors+':'+mis+':'+seds;
        for(let key of columnData.value){
            let listSelf = `${key.code}List`;
            let listAvg = `${key.code}Avg`;
            if(data[listSelf]){
            if(data[listAvg] == -11 || (data[listSelf].length==0)){
                key.isShow = false;
            }else{
                key.isShow = true;
            }
            if(data[listSelf].length!=0){
                obj[key.code] = data[listSelf][i] == -11 ? '-':data[listSelf][i];
            }
            }
            else{
            key.isShow = false;
            }
        }
        trendGridData.value.push(obj);
        timeLine = timeLine + 1000;
    }
}
defineExpose({
  setGridData
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
:deep(.el-scrollbar__wrap){
  @include scrollBarStyle;
}
.analys_trend_grid {
  height: 100%;
  width: 100%;
  :deep(.el-table__body-wrapper .el-table__body tr:nth-child(4n)) {
    background-color: #fff;
  }
  :deep(.el-table--enable-row-hover .el-table__body tr:hover) {
      background-color: #e8eef5;
  }
  :deep(.el-table) {
    font-family: PingFangSC-Regular, PingFang SC;
    color: #333333;
  }
  :deep(.el-table th) {
    height: 30px !important;
    line-height: 30px;
  }
  :deep(.el-table td) {
    padding: 0px !important;
    height: 30px !important;
  }
  :deep(.el-table__row) {
    height: 30px !important;
  }
  :deep(.el-table th > .cell) {
    font-size: 12px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    padding: 0;
    padding-left: 10px;
  }
  .grid_trend {
    height: 100%;
    width: 100%;
  }
  .grid_trend_more{
    height: calc(100% - 25px);
    width: 100%;
  }
  .block{
    height: 25px;
    line-height: 25px;
  }
}
</style>