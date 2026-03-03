<template>
    <div class="analys_grid">
    <div class="grid_history">
      <el-table
        ref="historyTb"
        id="historyTable"
        :data="historyData"
        style="width: 100%"
        height="100%"
        :size="'small'"
        v-loading="isAlarmTableLoading"
        :row-style="rowStyle"
        :row-class-name="tableRowClassNameHistory"
        border
        :native-scrollbar="false"
      >
        <el-table-column
          prop="alarmTime"
          label="报警时间"
          :min-width="toPx(140)"
          :width="toPx(140)"
        ></el-table-column>
        <el-table-column
          prop="alarmTypeAttr"
          label="报警类型"
          :min-width="toPx(140)"
          :width="toPx(140)"
          :show-overflow-tooltip="true"
        >
          <template #header="scope">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    报警类型<i class="icon iconfont icon_unfold"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                        <el-radio-group v-model="chorseAlarmType">
                          <el-dropdown-item style="padding:0px 6px;line-height:26px" command="属性0"><el-radio label="0">全部</el-radio></el-dropdown-item>
                          <el-dropdown-item style="padding:0px 6px;line-height:26px" command="属性1"><el-radio label="1">设备报警</el-radio></el-dropdown-item>
                          <el-dropdown-item style="padding:0px 6px;line-height:26px" command="属性2"><el-radio label="2">算法报警</el-radio></el-dropdown-item>
                        </el-radio-group>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template #default="scope">{{scope.row.alarmTypeAttr}}</template>
        </el-table-column>
         <el-table-column
          prop="alarmContent"
          label="报警内容"
          :show-overflow-tooltip="true"
          :min-width="toPx(80)"
        ></el-table-column>
       <el-table-column
          prop="actionName"
          label="操作"
          :min-width="toPx(85)"
          :width="toPx(85)"
        >
          <template #default="scope">
            <span @click="handleAlarmTableDbClick(scope.row)">定位</span>
      </template>
        </el-table-column> 
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive, onMounted ,nextTick} from 'vue';
import { getHandledAlarmApi } from '@/api/mv/mechanicalDataReview';
import { number } from 'echarts';
import { toPx } from '@/utils/tool'
interface IHistoryData {
    alarmTime?: string;
    alarmTypeAttr?: string;
    alarmContent?: string;
    actionName?: string;
    alarmId?: string;
}
const historyData = ref<[IHistoryData]>();
const isAlarmTableLoading = ref<boolean>(false);
const tableRowIndex = ref<number>(-1);
const tableRowClassNameHistory = ({ row, rowIndex}:{row:IHistoryData,rowIndex:number}) => {
    if (rowIndex === tableRowIndex.value) {
    return 'highlight-row'
    }
    return ''
}
const chorseAlarmType = ref('0');
const requestData = ref({
  limit:50,
  page:1
});
const recordId = ref<string>('');
const historyTb = ref<any>(null);
const scrollCallback = ()=>{
    const el = (document.querySelector('.el-scrollbar__wrap') as any);
      if (
        el?.clientHeight +
        el?.scrollTop >=
        el?.scrollHeight - 15 &&
        isScollLoading.value&&el?.scrollTop!= 0
      ) {
        isScollLoading.value = false;
        loadingMore('down');
      }
}
const loadingMore = (type:string) => {
    if(type == 'down'&&historyData.value?.length>0){
         requestData.value.page++;
        if(total.value< requestData.value.page){
          return;
        }
        getHandled(undefined,type,recordId.value,historyData.value[historyData.value.length-1].alarmId);
      }else if(type == 'up'&&historyData.value.length>0){
        getHandled(undefined,type,recordId.value,historyData.value[0].alarmId);
      }
}
const emit = defineEmits(['handleAlarmTableDbClick']);
//处理历史报警列表双击
const handleAlarmTableDbClick =  (row:IHistoryData)=> {
    // chorseAlarmSegmentId.value = row.alarmId;
    emit('handleAlarmTableDbClick',row);
}
onMounted(()=>{
  const scrollEl = historyTb.value?.$el.querySelector('.el-scrollbar__wrap');
  scrollEl?.addEventListener('scroll', scrollCallback);
})
const handleCommand = (command: string) => {
    if(command == '属性0' ){
        if(chorseAlarmType.value!='0'){
        requestData.value = {
            limit:50,
            page:1
        }
        chorseAlarmType.value = '0';
        getHandled(undefined,undefined,recordId.value,undefined);
        }
    } else if( command === '属性1') {
        if(chorseAlarmType.value!='1'){
        requestData.value = {
            limit:50,
            page:1
        }
        chorseAlarmType.value = '1';
        getHandled(undefined,undefined,recordId.value,undefined);
        }
    } else if (command === '属性2') {
        if(chorseAlarmType.value!='2'){
        requestData.value = {
            limit:50,
            page:1
        }   
        chorseAlarmType.value = '2';
        getHandled(undefined,undefined,recordId.value,undefined);
        }
    }
}
const isScollLoading = ref<boolean>(true);
const total = ref<number>(0);
 //报警列表获取
const getHandled = async (successCallback?:Function, type?:string, id?:string, alarmId?:string) => {
      recordId.value = id;
      isAlarmTableLoading.value = true;
      let params:any = {
        ...requestData.value,
      }
      if(chorseAlarmType.value !="0"){
        params['alarmSource'] = chorseAlarmType.value;
      }
      let data = await getHandledAlarmApi(id,params);
      isAlarmTableLoading.value = false;
      if(data && data.result){
        total.value = data.result.total;
        if (
            data.result &&
            data.result.records &&
            data.result.records.length > 0
        ){
            // for (let [index,alarm] of data.result.records.entries()) {
            //     if(alarm.alarmId == currentAlarmSegmentId){
            //       nextTick(()=>{
            //         tableScrollMove(index);
            //       })
            //     }
            //   }
              if (type == 'down') {
                total.value += data.result.total;
                historyData.value = historyData.value.concat(data.result.records);
              } else if(type == 'up') {
                historyData.value = [...data.result.records,...historyData.value];
                total.value += data.result.total;
              }else{
                historyData.value = data.result.records;
                total.value = data.result.total;
              }
              isScollLoading.value = true;
            }else if(data.result &&data.result.records &&data.result.records.length == 0 && type==undefined){
              historyData.value = data.result.records;
              total.value = data.result.total;
            }
        }else{
        ElMessage({ message: data.msg, type: "error", duration: 1000 });
      }
    }
 const rowStyle = ({ row }: { row: any }) => {
   if (row.alarmDurationType == 2) {
          return {
            color: '#333333',
            "background-color": "#FFEAE8",
          };
      }
    }
defineExpose({
    getHandled
})
</script>

<style lang="scss" scoped >
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
.analys_grid {
    height: 100% !important;
    :deep(.el-dropdown-menu) {
    background-color: #293c8e;
    border: 1px solid #1b41ef;
    color: white;
    .el-dropdown-menu__item {
        padding: 0px 5px;
        color: white;
        &:hover, &:focus {
        background-color: rgb(25, 37, 88);
        color: white;
        }
        el-radio {
        color: white !important;
        .el-radio__label {
            color: white;
        }
        }
    }
    }
    :deep(.el-divider__text, .el-link) {
    font-size: 12px!important;
    }
    :deep(.mySelfclassStyle) {
    position: relative;
    &>div{
        position: fixed;
    }
    }
    :deep(.mySelfclassStyle:hover>div) {
        width: 100px;
        height: 100px;
        background-color: #ccc;
    }
    :deep(tr.highlight-row td) {
    background-color: #e7e9fd;
    //color: #06aea6;
    }
    :deep(.el-scrollbar__wrap) {    
        overflow-x: hidden;
        overflow-y: auto;
        @include scrollBarStyle;
    }
    :deep(.el-table__body-wrapper .el-table__body tr:nth-child(4n)) {
        background-color: #ffffff;
    }
    :deep(.el-table--enable-row-hover .el-table__body tr:hover) {
        background-color: #e8eef5;
    }
    height: 100%;
    width: 100%;
    display: flex;
    :deep(.el-table) {
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333333;
    }
    :deep(.el-table th) {
        height: 30px !important;
        padding: 0px !important;
    }
    :deep(.el-table td) {
        padding: 0px !important;
        height: 30px !important;
        .cell{
            font-size: 12px;
            >span{
                color: #0081FB;
                cursor: pointer;
            }
        }
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
        padding-left: 7px;
    }
    :deep(.el-table .cell) {
        padding-left: 5px;
        padding-right: 5px;
    }
    :deep(.el-table--border td:first-child .cell,
    .el-table--border th:first-child .cell) {
        padding-left: 6px;
        padding-right: 0px;
    }
    :deep(.el-table--border th:first-child) {
        background-color: #fff;
    }
    :deep(.el-table__row>td:nth-child(1)){
        // background-color: #f7f7f7;
    }
    :deep(.has-gutter.el-table__cell){
        background: #eeeeee !important;
        border-right: 1px solid #ddd;
    }

    .grid_history {
        height: 100%;
        // width: calc(100% - 600px);
        width: calc(100%);
        .icon_collect_lighted{
        color: #f7b33c;
        }
    }
}
</style>