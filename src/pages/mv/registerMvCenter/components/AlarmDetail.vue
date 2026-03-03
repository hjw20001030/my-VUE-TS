<template>
  <div ref="notify" class="alarmDiv" v-if="visible" @click="handleClick">
    <span :class="{'icon2':info['alarmLevel']=='M',
        'icon3':info['alarmLevel']=='L'
    }">!</span>
    <div class="alarminfo" v-textScrollLeft>
      <div>
        [{{ formatDate(new Date(info["alarmEndDate"]), "hh:mm") }}]
        {{ info["departmentName"] }} {{ info["areaName"] }}
        {{ fillBedDisplay(info["bedNo"]) }}
      </div>
    </div>
    <div
      class="alarmText"
      :class="{
        'svm_monitor_center_alarmLevel1': info['alarmLevel']=='H',
        'svm_monitor_center_alarmLevel2': info['alarmLevel']=='M',
        'svm_monitor_center_alarmLevel3': info['alarmLevel']=='L'
    }"
      v-textScrollLeft
    >
      <div>{{ info["alarmMessage"] }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted ,onUnmounted,watch,nextTick} from 'vue';
import {fillBedDisplay,formatDate} from '@/utils/tool'
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

const vTextScrollLeft = {
  mounted: (el: any, binding:any, vnode:any) =>{
    let parentWidth = el.offsetWidth;
    let childWidth = el.children[0].offsetWidth;
    if (parentWidth < childWidth) {
      let strDom = el.children[0].cloneNode();
      strDom.innerText = el.children[0].innerText;
      vnode.el.appendChild(strDom);
      let delta = childWidth - parentWidth + 10;
      let time = Math.round(delta / 20);
      for (let index = 0; index < el.children.length; index++) {
        const element = el.children[index];
        element.style.marginRight = "20px";
        let s = childWidth + 20;
        element.animate(
          [
            {
              transform: "translateX(-" + 0 + "px)",
            },
            {
              transform: "translateX(-" + s + "px)",
            },
          ],
          {
            duration: time * 1000 + 3000,
            easing: "linear",
            iterations: Infinity,
          }
        );
      }
    } else {
      el.children[0].style.width = "auto";
    }
  }
}

watch(visible, (newVal, oldVal) => {
  if(newVal){
    isShow.value = true;
    nextTick(()=>{
       (notify.value as HTMLDivElement).style.opacity = 1 + "";
    })
  }else{
    setTimeout(() => {
        isShow.value = false;
    }, 500);
  }
})

const open = (data:any) => {
  if(visible.value){
      isShow.value = false;
      visible.value = false;
  }
  nextTick(()=>{
    isShow.value= true;
    visible.value = true;
    startTimer();
    info.value= data.info;
    callback.value = data.callback;
  })
}
const startTimer = () =>{
  if (duration.value > 0) {
    clearInterval(timer);
    (timer as any) = setTimeout(() => {
      if (isShow.value) {
        close();
      }
    }, duration.value);
  }
}
const close = ()=>{
  visible.value = false;
}
const clearTimer = ()=> {
  clearTimeout(timer as any);
}
const handleClick = () => {
  let recordId: any = info.value["recordId"];
  if (recordId) {
    if (callback.value) {
      (callback.value as any)(recordId);
    }
  }
}
defineExpose({
  open
})
</script>
<style lang="scss" scoped>
.alarmDiv {
  display: flex;
  width: 526px !important;
  height: 50px;
  transition: 1.5s;
  margin-left: 0px !important;
  align-items: center;
  // float: right;
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 12px;
  opacity: 0;
  color: #ffffff;
  > span:nth-child(1) {
    padding: 0 2px;
    height: 16px;
    width: 18px;
    line-height: 16px;
    border-radius: 3px;
    color: #FFFFFF;
    text-align: center;
    background: #ff4747;
    cursor: pointer;
  }
  .alarminfo {
    width: 200px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 12px;
    color: #dddddd;
    height: 30px;
    overflow: hidden;
    margin-left: 10px;
    line-height: 30px;
    cursor: pointer;
    display: flex;
    > div {
      white-space: nowrap; /* 防止文字换行 */
      width: fit-content;
    }
  }
  .alarmText {
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 12px;
    color: #dddddd;
    width: 308px;
    height: 30px;
    padding: 0 9px;
    line-height: 30px;
    box-sizing: border-box;
    background-image: linear-gradient(270deg, #e6deff33 0%, #ffffff00 100%);
    overflow: hidden;
    cursor: pointer;
    display: flex;
    > div {
      white-space: nowrap; /* 防止文字换行 */
      width: fit-content;
    }
  }
  .svm_monitor_center_alarmLevel1 {
    background-image: linear-gradient(
      90deg,
      #f9595000 1%,
      #fc4f4b80 99%
    ) !important;
  }
  .svm_monitor_center_alarmLevel2 {
    background-image: linear-gradient(
      90deg,
      #f6f00100 1%,
      #f6f00180 97%
    ) !important;
  }
  .svm_monitor_center_alarmLevel3 {
    background-image: linear-gradient(
      90deg,
      #3cd8da00 1%,
      #3cd8da80 99%
    ) !important;
  }
  .icon3{
    background: #29BABC !important;
  }
  .icon2{
    background: #F6F001 !important;
    }
}
</style>
