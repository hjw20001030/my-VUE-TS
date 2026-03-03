<template>
  <div class="analys_patient_msg">
    <div class="patient_msg_all">
      <div class="patient_msg_font">
        <div>
          <div><span>住院号:</span></div>
          <div><span>{{custInfoDetailData.certiNumber?custInfoDetailData.certiNumber:'-'}}</span></div>
        </div>
        <div>
          <div><span>责任医生:</span></div>
          <div><span>{{custInfoDetailData.dutyDoctor?custInfoDetailData.dutyDoctor:'-'}}</span></div>
        </div>
        <div>
          <div><span>责任护士:</span></div>
          <div><span>{{custInfoDetailData.dutyNurse?custInfoDetailData.dutyNurse:'-'}}</span></div>
        </div>
        <div>
          <div><span>诊断信息:</span></div>
          <div><span>{{custInfoDetailData.clinicalDiagnosis?custInfoDetailData.clinicalDiagnosis:'-'}}</span></div>
        </div>
        <div>
          <div><span>护理等级:</span></div>
          <div><span>{{custInfoDetailData.nursingLevel?custInfoDetailData.nursingLevel:'-'}}</span></div>
        </div>
        <div>
          <div><span>病情等级:</span></div>
          <div><span>{{custInfoDetailData.illnessCondition?custInfoDetailData.illnessCondition:'-'}}</span></div>
        </div>
        <div>
          <div><span>通气模式:</span></div>
          <div><span>{{ventilationMode?ventilationMode:'-'}}</span></div>
        </div>
        <div>
          <div><span>起搏模式:</span></div>
          <div><span>{{custInfoDetailData.pacingMode?custInfoDetailData.pacingMode:'-'}}</span></div>
        </div>
        <div>
          <div><span>设备号:</span></div>
          <div><span>{{custInfoDetailData.mvExtInstCode?custInfoDetailData.mvExtInstCode:'-'}}</span></div>
        </div>
        <div>
          <div><span>监护业务号:</span></div>
          <div><span>{{custInfoDetailData.mvServiceCode?custInfoDetailData.mvServiceCode:'-'}}</span></div>
        </div>
        <div>
          <div><span>监护状态:</span></div>
          <div><span>{{custInfoDetailData.mvProcessStateName?custInfoDetailData.mvProcessStateName:'-'}}</span></div>
        </div>
        <div>
          <div><span>监护开始时间:</span></div>
          <div><span>{{custInfoDetailData.monitorStartDate?custInfoDetailData.monitorStartDate:'-'}}</span></div>
        </div>
        <div>
          <div><span>监护结束时间:</span></div>
          <div><span>{{custInfoDetailData.monitorEndDate?custInfoDetailData.monitorEndDate:'-'}}</span></div>
        </div>
      </div>
      <div class="patient_msg_img">
        <div class="medical_images">病历图片</div>
        <div class="img_box" v-if="detailsDataImg.length > 0">
          <div
            class="atlas_imgs_box"
            v-for="(item, index) in detailsDataImg"
            :key="index"
          >
            <img :src="item.imageUrl" alt="病历图片" height="120px" width="120px"/>
            <img
              src="@/assets/img/icon_enlarge.png"
              class="icon_max"
              @click="nextEnlarge(index)"
              alt="病历图片"
            />
          </div>
        </div>
        <div class="atlas_imgs_boxs" v-if="detailsDataImg.length == '0'">
          <img src="@/assets/img/no_alarm.png" alt="暂无病历图片" />
          <div>暂无病历图片</div>
        </div>
        <enlarge
          :detailsDataImg="detailsDataImg"
          v-if="isShowEnlarge"
          :currentId="currentId"
          @close="close"
        ></enlarge>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import enlarge from "@/components/enlarge.vue";
import { onMounted, ref } from 'vue'

const props = defineProps({
  recordId: {
    default: String,
  },
  ventilationMode: {
    default: String,
  },
  custDto: {
    default: Object,
  },
})
const isShowEnlarge = ref(false)
const currentId = ref(0)
const detailsDataImg = ref([])
const custInfoDetailData = ref({});
onMounted(()=>{
  custInfoDetailData.value = props.custDto;
})

const emptyPatient = () => {
  custInfoDetailData.value = {};
  detailsDataImg.value = [];
}
// 图片预览
const nextEnlarge = (id: number) => {
  isShowEnlarge.value = true;
  currentId.value = id;
}
const close = (msg: boolean) => {
  isShowEnlarge.value = msg;
}
</script>
<style lang="scss" scoped>
@mixin scrollBarStyle() {
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
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
@mixin userNone(){
  -webkit-user-select: none; /*谷歌 /Chrome*/
  -moz-user-select: none; /*火狐/Firefox*/
  -ms-user-select: none; /*IE 10+*/
  user-select: none;
}
.analys_patient_msg {
  // @include userNone; //产品需要
  height: 100%;
  width: 100%;
  background-color: white;
  font-family: PingFangSC-Regular, PingFang SC;
  font-size: 12px;
  border-radius: 13px;
  .patient_msg_all {
    height: 100%;
    width: 100%;
    overflow: auto;
    @include scrollBarStyle;
    .patient_msg_font {
      height: auto;
      width: 100%;
      box-sizing: border-box;
      padding-top: 14px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      & > div {
        min-height: 30px;
        line-height: 30px;
        display: flex;
        & > div:nth-child(1) {
          text-align: right;
          width: 103px;
        }
        & > div:nth-child(2) {
          text-align: left;
          width: calc(100% - 103px);
          box-sizing: border-box;
          padding-left: 5px;
          padding-right: 15px;
          word-wrap: break-word;
        }
      }
    }
    .patient_msg_img {
      min-height: 180px;
      width: 100%;
      .medical_images {
        height: 30px;
        width: 100%;
        padding-left: 20px;
        box-sizing: border-box;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .img_box{
        min-height: 120px;
        overflow: auto;
        padding-left: 48px;
        .atlas_imgs_box{
          float: left;
          position: relative;
          margin-top: 3px;
          margin-right: 3px;
          .icon_max{
            background: transparent;
            position: absolute;
            left: 92px;
            top: 87px;
            width: 0px;
          }
        }
        .atlas_imgs_box:hover{
          .icon_max{
            width: 20px;
            height: 20px;
          }
        }
      }
      .atlas_imgs_boxs {
        height: calc(100% - 30px);
        text-align: center;
        font-size: 12px;
        >img{
          width: 120px;
          height: 120px;
        }
      }
    }
  }
}
</style>