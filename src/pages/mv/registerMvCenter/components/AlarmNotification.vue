<template>
    <div
        :class="{'svm_monitor_center_notification_wrap':true,
        'svm_monitor_center_alarmLevel1': info['alarmLevel']=='1',
        'svm_monitor_center_alarmLevel2': info['alarmLevel']=='2',
        'svm_monitor_center_alarmLevel3': info['alarmLevel']=='3'}"
        v-show="isShow"
        ref="notify"
    >
        <div class="svm_monitor_center_notification_content_wrap">
            <div class="svm_monitor_center_notification_content" @click="handleClick">
                <div class="top">
                    <div class="l">
                        <div>{{fillBedDisplay(info['bedNo'])}}</div>
                    </div>
                    <div class="r">
                       <div> <div>{{fillDisplay(info['departmentName'])}}</div>
                        <div>{{fillDisplay(info['hosName'])}}</div></div>
                    </div>
                </div>
                <div class="message">
                    {{fillDisplay(info['message'])}}
                </div>
                <div class="svm_monitor_center_notification_detail">
                    <div>报警时间：{{fillDisplay(info['date'])}}</div>
                    <div>
                        <span class="hertAndLungIcon" v-show="info['ecgProcessState']">
                        <i class="iconfont icon_monitor_default" :style="{color:info['ecgProcessState']=='1000'?'rgb(53, 207, 87)':'rgb(168, 168, 168)'}"/>
                        </span>
                        <span class="hertAndLungIcon" v-show="info['mvProcessState']">
                        <i class="iconfont icon_ventilator_default" :style="{color:info['mvProcessState']=='1000'?'rgb(53, 207, 87)':'rgb(168, 168, 168)'}"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted ,watch} from 'vue';
import {fillDisplay,fillBedDisplay} from '@/utils/tool'
const visible = ref<boolean>(false);
const isShow = ref<boolean>(false);
const info = ref({
     recordId: undefined
});
const duration = ref<Number>(10000);
let timer:any = null;
const callback = ref(null);
const closeCallback = ref<any>(null);
const mountPoint = ref<any>(null);
const notify = ref<any>(null);
onMounted(()=>{
    startTimer();
})
watch(visible, (newVal, oldVal) => {
  if(newVal){
    isShow.value = true;
    setTimeout(() => {
        (notify.value as HTMLDivElement).style.opacity = 1 + "";
        (notify.value as HTMLDivElement).style.top = "45%";
    }, 100);
  }else{
    (notify.value as HTMLDivElement).style.opacity = 0 + "";
    (notify.value as HTMLDivElement).style.top = "0%";
    setTimeout(() => {
        isShow.value = false;
    }, 500);
  }
})
watch(isShow,(newAal) => {
    if (!newAal) {
        destoryElement();
    }
})


const destoryElement = ()=>{
    if(mountPoint.value){
        document.body.removeChild(mountPoint.value);
    }
}

const close = ()=> {
    visible.value = false;
    if(closeCallback.value){
        closeCallback.value();
    }
}
const clearTimer = () =>{
    clearTimeout(timer as any);
}
const startTimer = () => {
    if (duration.value > 0) {
        (timer as any) = setTimeout(() => {
            if (isShow.value) {
                close();
            }
        }, duration.value as any);
    }
}
const handleClick = () => {
    let recordId: any = info["recordId"];
    if (recordId) {
        if (callback.value) {
            (callback.value as any)(recordId);
        }
    }
}
defineExpose({
    visible,
    mountPoint,
    info,
    duration,
    close,
    closeCallback,
    callback
})
</script>
<style lang="scss" scoped>
.svm_monitor_center_notification_wrap {
    position: absolute;
    width: calc(calc(100% / 3) - 4px);
    height: calc(calc(100% / 3) - 4px);
    border: 4px solid #FFFFFF;
    z-index: 9999;
    background-color: #242d36;
    border-radius: 16px;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 100%;
    transform: translateY(-50%);
    transition: top 0.2s, opacity 0.2s;
    opacity: 0;
    box-sizing: border-box;

    & > p {
        position: relative;
        font-size: 20px;
        color: white;
        text-align: center;
        padding: 28px 0 18px 0;
        margin: 0;
    }

    .svm_monitor_center_notification_close {
        position: absolute;
        right: 30px;
        top: 25px;
        font-size: 23px;
        cursor: pointer;
    }

    .svm_monitor_center_notification_content_wrap {
        height: 100%;
        border-radius: 16px;
    }

    .svm_monitor_center_notification_content {
        cursor: pointer;
        height: 100%;
        background-color: #15191F;
        border-radius: 16px;
        .b_cF61702{
            background: #F61702;
        }
        .message{
            padding-left: 24px;
            padding-right: 32px;
            height: 47%;
            font-family: PingFangSC-SNaNpxibold;
            font-weight: 600;
            font-size: 28px;
            color: #ffffffe6;
            overflow:hidden; 
            display: -webkit-box;
            -webkit-line-clamp: 5;
            text-overflow:ellipsis; 
            -webkit-box-orient: vertical;
            line-height: 130%;
        }
        .top{
            padding: 15px 32px 19px 19px;
            display: flex;
            justify-content: space-between;
            height: calc(39% - 15px - 19px);
            .l{
                height: calc(100% - 40px);
                width: fit-content;
                font-family: PingFangSC-SNaNpxibold;
                font-weight: 600;
                font-size: 64px;
                color: #FFFFFF;
                padding: 20px;
                display: flex;
                align-items: center;
                background-color: #3F4356;
                border-radius: 16px;
                max-width: 400px;
                >div{
                    white-space: nowrap; /* 不换行 */
                    // overflow: hidden; /* 超出内容隐藏 */
                    text-overflow: ellipsis; /* 显示省略号 */
                }
            }
            .r{
                height: 100%;
                max-width: 290px;
                div{
                    font-family: PingFangSC-SNaNpxibold;
                    font-weight: 600;
                    font-size: 20px;
                    color: #7F8793;
                    text-align: right;
                    position: relative;
                    top: 50%;
                    transform: translateY(-33%);
                    >div:last-child{
                        margin-top: 10px;
                        white-space: nowrap; /* 不换行 */
                        overflow: hidden; /* 超出内容隐藏 */
                        text-overflow: ellipsis; /* 显示省略号 */
                    }
                }
            }
        }
    }

    .svm_monitor_center_notification_detail {
        padding: 5px 32px 0px 24px;
       height: calc(100% - 47% - 39%);
       display: flex;
       justify-content: space-between;
       >div:first-child{
        font-family: PingFangSC-SNaNpxibold;
        font-weight: 600;
        font-size: 20px;
        color: #7F8793;
       }
       .hertAndLungIcon{
            display: inline-block;
            margin-left:12px;
            // @extend %flex-common-center;
            &>i{
                font-size: 20px;
            }
        }
    }
}
.svm_monitor_center_alarmLevel1{
        border-color: #F61702;
        animation: alarmLevel1AlarmAnimation 0.25s infinite;
        .svm_monitor_center_notification_content{
            .top{
                .l{
                    background: #F61702 !important;
                }
            }
        }
    }
    @keyframes alarmLevel1AlarmAnimation {
        0% {
            border-color: #3A414B;
        }
        50% {
            border-color: #F61702;
        }
        100% {
            border-color: #3A414B;
        }
    }
    .svm_monitor_center_alarmLevel2{
        border-color: #F6B902;
        animation: alarmLevel2AlarmAnimation 0.5s infinite;
        .svm_monitor_center_notification_content{
            .top{
                .l{
                    background: #F6B902 !important;
                }
            }
        }
    }
    @keyframes alarmLevel2AlarmAnimation {
        0% {
            border-color: #3A414B;
        }
        50% {
            border-color: #F6B902;
        }
        100% {
            border-color: #3A414B;
        }
    }
    .svm_monitor_center_alarmLevel3{
        border-color: #3CD8DA;
        animation: alarmLevel3AlarmAnimation 1s infinite;
        .svm_monitor_center_notification_content{
            .top{
                .l{
                    background: #3CD8DA !important;
                }
            }
        }
    }
    @keyframes alarmLevel3AlarmAnimation {
        0% {
            border-color: #3A414B;
        }
        50% {
            border-color: #3CD8DA;
        }
        100% {
            border-color: #3A414B;
        }
    }

</style>