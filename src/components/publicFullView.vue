<template>
  <div id="fullView" :class="{blackTheme:blackTheme}">
    <div class="fullView_top">
      <div class="fullView_top_left" @click="previousPage">
        <span
          :class="{ disabled: previousPageDisabled }"
          class="iconfonts icon-previous"
        ></span>
      </div>
      <div class="fullView_top_center" ref="fullView_top_centerRef">
        <div
          class="fullView_top_center_time"
          :style="{ left: v.left + 'px' }"
          v-for="v in dateListAry"
          :key="v.left"
        >
          <div class="fullView_top_center_time_text">{{ v.date }}</div>
          <div class="fullView_top_center_time_tbas"></div>
        </div>
      </div>
      <div class="fullView_top_right" @click="nextStepPage">
        <span
          :class="{ disabled: nextStepPageDisabled }"
          class="iconfonts icon-next"
        ></span>
      </div>
    </div>
    <div class="fullView_btn" :style="{ height: toPx(20) + 'px' }">
      <div
        class="fullView_btn_left"
        ref="fullView_btn_leftRefs"
        @click="previous"
      >
        <span class="iconfonts arrow_left"></span>
      </div>
      <div
        class="fullView_btn_center"
        :style="{ height: toPx(20) + 'px', background: trendBackgroundColor }"
        ref="fullViewDomRef"
      ></div>
      <div class="fullView_btn_right" @click="nextStep">
        <span class="iconfonts arrow_right"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate,toPx } from "@/utils/tool";
import * as echarts from 'echarts';
let timer = null;
const throle = (cd, time = 500) => {
  if (timer) return;
  timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
  }, time);

  return cd();
};
export default {
  props: {
    //趋势背景颜色
    trendBackgroundColor: {
      type: String,
      default: () => {
        return "#ffffff";
      }
    },
    //监护开始时间
    monitorStartDate: {
      type: String,
      default: () => {
        return "";
      }
    },
    //监护结束时间 - （如果监护中 为当前时间）
    monitorEndDate: {
      type: String,
      default: () => {
        return "";
      }
    },
    //坡形片段开始时间-（请求数据时间）
    waveStartDate: {
      type:[String , Date],
      default: () => {
        return "";
      }
    },
    //黑色主题
    blackTheme:{
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      option: {
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0%",
          top: "0%",
          containLabel: false
        },
        xAxis: [
          {
            type: "time",
            boundaryGap: false,
            show: false
          }
        ],
        yAxis: [
          {
            type: "value",
            show: false,
            max: 200,
            min: 0
          }
        ],
        series: [
          {
            name: "Line 1",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.5,
              color: "#52C41A"
            },
            emphasis: {
              focus: "series"
            },
            data: []
          }
        ]
      },
      echarts: {},
      //时间刻度数据
      dateList: [],
      //趋势数据
      waveData: {},
      //趋势配置
      waveDataConfig: {
        HR: {
          max: 200,
          min: 0,
          color: "#52C41A"
        }
      },
      //加载趋势的名称 与waveDataConfig 做匹配
      waveTitle: [],
      //时间轴最后刻度的时间
      lastTime: 0,
      //一个刻度的宽
      oneTickW: 0,
      ////一分钟的宽
      oneFW: 0,
      //当前页码
      currentPage: 0,
      //总页数-最大页数
      maxPage: 0,
      //当前页开始时间
      startTimeTrend: 0,
      //绘制报警的canvas实例
      canvas: null,
      //报警 上下文
      ctx: null,
      //报警队列
      alarmAry: [],
      //绘制蓝色光标的canvas实例
      cursor_canvas: null,
      //蓝色光标 上下文
      cursor_ctx: null,
      //当前鼠标悬停的报警dom
      currentCanvas: null,
      //当前鼠标悬停的报警dom 上下文
      currentCtx: null,
      //当前鼠标悬停的报警
      currentAlarm: null,
      //动态绘制 事件
      animationDrawTime: 0,
      //延迟清楚
      clearTimeoutTime: 0,
      //报警div 的宽
      alarmDomW: 2,
    };
  },
  mounted() {
    this.initEchart();
    this.setOption();
  },
  computed: {
    previousPageDisabled() {
      if (this.currentPage <= 0) {
        this.currentPage = 0;
      }
      return this.currentPage == 0;
    },
    nextStepPageDisabled() {
      if (this.maxPage != 0 && this.currentPage >= parseInt(this.maxPage)) {
        this.currentPage = parseInt(this.maxPage);
      }
      return this.currentPage == parseInt(this.maxPage);
    },
    dateListAry() {
      return this.dateList.filter(item => item.isShow);
    }
  },
  methods: {
    toPx,
    //设置时间轴趋势配置
    setWaveDataConfig(waveDataConfig) {
      if (!waveDataConfig) throw new Error("趋势配置参数null");
      this.waveTitle = [];
      for (const key in waveDataConfig) {
        this.waveTitle.push(key);
      }
      this.waveDataConfig = waveDataConfig;
      this.setDateList();
    },
    initData(setdata, setWaveDataConfig) {
      if (setdata) {
        for (let i = 0; i < this.dataAllArr.length; i++) {
          const values = this.dataAllArr[i];
          if (setdata[values]) {
            this[values] = setdata[values];
          }
        }
      }
      if (setWaveDataConfig) this.setWaveDataConfig(setWaveDataConfig);
    },
    //隐藏不是当前页的时间刻度
    hideTime(isAllShow) {
      let startPx = this.$refs.fullViewDomRef.offsetWidth * this.currentPage;
      let endPx = startPx + this.$refs.fullViewDomRef.offsetWidth;
      for (let index = 0; index < this.dateList.length; index++) {
        const element = this.dateList[index];
        if (isAllShow) {
          element.isShow = !0;
        } else if (element.left < startPx || element.left > endPx) {
          element.isShow = !1;
        } else {
          element.isShow = !0;
        }
      }
    },
    //计算当前页
    computeCurrentPage(time) {
      if (this.nextStepPageDisabled && this.previousPageDisabled) return;
      let date =
        new Date(time).getTime() - new Date(this.monitorStartDate).getTime();
      let min = date / 1000 / 60;
      this.currentPage = parseInt(
        (this.oneFW * min) / this.$refs.fullViewDomRef.offsetWidth
      );
      this.setDateAndAlarm();
    },
    //前一页 时间刻度
    previousPage() {
      throle(() => {
        if (this.previousPageDisabled) return;
        this.currentPage--;
        this.setDateAndAlarm();
      });
    },
    //后一页 时间刻度
    nextStepPage() {
      throle(() => {
        if (this.nextStepPageDisabled) return;
        this.currentPage++;
        this.setDateAndAlarm();
      });
    },
    //刷新 时间轴 趋势图 和报警
    setDateAndAlarm() {
      this.hideTime(true);
      setTimeout(() => {
        this.$refs.fullView_top_centerRef.style.marginLeft =
          "-" + this.currentPage * this.$refs.fullViewDomRef.offsetWidth + "px";
        this.setStertTimeAndEndTime();
        this.$emit("getAlarmData", this.startTimeTrend, data => {
          if (Array.isArray(data)) {
            this.drawAlarm(data);
          } else throw new Error("报警类型错误，参数应为数组！");
        });
        this.getData();
        setTimeout(() => {
          this.hideTime();
        }, 2000);
      }, 100);
    },
    //向前 两分钟
    previous() {
      this.$emit("previousStep");
    },
    //向后 两分钟
    nextStep() {
      this.$emit("nextStep");
    },
    //添加事件
    addEvent(alarmStartDate) {
      let _this = this;
      let date =
        new Date(alarmStartDate).getTime() -
        new Date(this.startTimeTrend).getTime();
      let min = date / 1000 / 60;
      const x = this.oneFW * min;
      this.alarmAry.push({
        left: parseInt(x),
        alarmTime: alarmStartDate
      });
      this.drawLine(x, 2, "rgba(255,0,0,0.20)", this.ctx);
    },
    sss(data) {
      var daaa = [];
      for (let index = 0; index < 1000; index++) {
        daaa.push({
          alarmStartDate: formatDate(
            new Date(
              new Date(data[0].alarmStartDate).getTime() + index * 600000
            ),
            "yyyy/MM/dd hh:mm:ss"
          )
        });
      }
      return daaa;
    },
    //绘制报警
    drawAlarm(data) {
      // data = this.sss(data);
      this.clear("canvas", "ctx");
      if (!data.length > 0) return;
      this.alarmAry = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.secondAlarms && element.secondAlarms.length > 0) {
          for (let item of element.secondAlarms) {
            this.addEvent(item.alarmStartDate);
          }
        } else {
          this.addEvent(element.alarmStartDate);
        }
      }
    },
    //清理
    clear(canvas, ctx) {
      if (this[ctx] != null && this[canvas] != null)
        this[ctx].clearRect(
          0,
          0,
          this[canvas].offsetWidth,
          this[canvas].offsetHeight
        );
    },
    //增加动画效果绘制
    animationDraw(x) {
      clearInterval(this.animationDrawTime);
      this.alarmDomW = 2;
      this.animationDrawTime = setInterval(() => {
        // this.clear('currentCanvas','currentCtx');
        this.alarmDomW += 0.1;
        if (this.alarmDomW >= 4) {
          this.alarmDomW = 4;
          clearInterval(this.animationDrawTime);
        }
        this.drawLine(x, this.alarmDomW, "rgba(255,0,0,0.50)", this.currentCtx);
      }, 100);
    },
    //当前时间位置 蓝色光标
    currentPosition() {
      let newDate = this.waveStartDate;
      if (!this.waveStartDate) {
        newDate = this.monitorEndDate;
      }
      let date =
        new Date(newDate).getTime() - new Date(this.startTimeTrend).getTime();
      let min = date / 1000 / 60;
      this.clear("cursor_canvas", "cursor_ctx");
      if (this.oneFW * min > this.$refs.fullViewDomRef.offsetWidth) return;
      let width = parseInt(this.oneFW * 5);
      if (width > 5) {
        width = 5;
      } else if (width < 1) {
        width = 1;
      }
      if (this.cursor_ctx == null && this.cursor_canvas == null) {
        this.initCanvas("cursor_canvas", "cursor_ctx", "dblclick", event => {
          if (this.currentAlarm)
            this.$emit("dblclickMaskDom", this.currentAlarm.alarmTime);
          else this.dblclickMaskDom(event);
        });
        this.initCanvas("cursor_canvas", "", "mousemove", event => {
          let item = this.selectAlarm(event);
          if (item) {
            clearTimeout(this.clearTimeoutTime);
            if (this.currentCanvas == null && this.currentCtx == null) {
              this.initCanvas("currentCanvas", "currentCtx");
              this.currentCanvas.style.pointerEvents = "none";
            }
            if (JSON.stringify(item) != JSON.stringify(this.currentAlarm)) {
              this.currentAlarm = item;
              this.clear("currentCanvas", "currentCtx");
              let date =
                new Date(this.currentAlarm.alarmTime).getTime() -
                new Date(this.startTimeTrend).getTime();
              let min = date / 1000 / 60;
              const x = this.oneFW * min;
              this.animationDraw(x);
            }
          } else {
            this.clearTimeoutTime = setTimeout(() => {
              clearInterval(this.animationDrawTime);
              this.clear("currentCanvas", "currentCtx");
              this.alarmDomW = 2;
              this.currentAlarm = "";
            }, 100);
          }
        });
        this.initCanvas("cursor_canvas", "", "mouseleave", event => {
          clearInterval(this.animationDrawTime);
          this.clear("currentCanvas", "currentCtx");
        });
      }
      this.drawLine(this.oneFW * min, width, "#3453FF", this.cursor_ctx);
    },
    //查询报警节点
    selectAlarm(event) {
      let returnData = "";
      for (const item of this.alarmAry) {
        if (item.left <= event.offsetX && item.left + 2 >= event.offsetX) {
          returnData = item;
          break;
        }
      }
      return returnData;
    },
    //生成时间刻度
    setDateList() {
      let newTime = this.monitorEndDate,
        startDate = this.monitorStartDate;
      this.startTimeTrend = this.monitorStartDate;
      let date = new Date(newTime).getTime() - new Date(startDate).getTime();
      let offsetWidth = this.$refs.fullViewDomRef.offsetWidth;
      //相隔的小时数
      var hours = date / (3600 * 1000);
      //10分钟一个点的刻度数量
      let Scale = hours * 60;
      //一个刻度多宽
      let width1s = offsetWidth / Scale;
      this.oneFW = width1s;
      //一个刻度的宽
      this.oneTickW = 10 / (width1s * 10);
      let startDatenew = new Date(startDate);
      this.dateList = [];
      if (hours <= 24) {
        //1小时一个刻度共多少刻度
        let Scales = hours;
        let pan = formatDate(
          new Date(startDatenew.getTime() + parseInt(Scales) * 60 * 60 * 1000),
          "hh"
        );
        let sta = formatDate(new Date(newTime), "hh");
        if (!(pan == sta)) {
          Scales = Math.ceil(Scales);
        }
        if (Scales > 12) {
          for (let index = 1; index <= Scales; index++) {
            startDatenew = new Date(
              startDatenew.getTime() + 1 * 60 * 60 * 1000
            );
            let time =
              formatDate(new Date(startDatenew), "yyyy-MM-dd hh") + ":00:00";
            let datesss =
              (new Date(time).getTime() - new Date(startDate).getTime()) /
              1000 /
              60;
            if (index == parseInt(Scales)) {
              this.lastTime = formatDate(
                new Date(startDatenew),
                "yyyy/MM/dd hh:mm:ss"
              );
            }
            if (formatDate(new Date(time), "hh") + ":00" == "00:00") {
              this.dateList.push({
                left: datesss * width1s,
                date: formatDate(new Date(startDatenew), "MM-dd"),
                isShow: true,
                id: new Date().getTime() + "h"
              });
              continue;
            }
            this.dateList.push({
              left: datesss * width1s,
              date: formatDate(new Date(time), "hh") + ":00",
              isShow: true,
              id: new Date().getTime() + "h"
            });
          }
        } else {
          let w1s = offsetWidth / (12 * 60);
          this.oneFW = w1s;
          //一个刻度的宽
          this.oneTickW = 10 / (w1s * 10);
          for (let index = 1; index <= 12; index++) {
            startDatenew = new Date(
              startDatenew.getTime() + 1 * 60 * 60 * 1000
            );
            let time =
              formatDate(new Date(startDatenew), "yyyy-MM-dd hh") + ":00:00";
            let datesss =
              (new Date(time).getTime() - new Date(startDate).getTime()) /
              1000 /
              60;
            let date = formatDate(new Date(startDatenew), "hh") + ":00";
            if (index == 1) {
              let px = datesss > 1 ? datesss : 1;
              if (formatDate(new Date(time), "hh") + ":00" == "00:00") {
                date = formatDate(new Date(startDatenew), "MM-dd");
                this.dateList.push({
                  left: px * w1s,
                  date: date,
                  isShow: true,
                  id: new Date().getTime() + "h"
                });
              } else {
                this.dateList.push({
                  left: px * w1s,
                  date: date,
                  isShow: true,
                  id: new Date().getTime() + "h"
                });
              }
              continue;
            }
            if (formatDate(new Date(time), "hh") + ":00" == "00:00") {
              this.dateList.push({
                left: datesss * w1s,
                date: formatDate(new Date(startDatenew), "MM-dd"),
                isShow: true,
                id: new Date().getTime() + "h"
              });
              continue;
            }
            this.dateList.push({
              left: datesss * w1s,
              date: date,
              isShow: true,
              id: new Date().getTime() + "h"
            });
            if (index == 12) {
              this.lastTime = formatDate(
                new Date(startDatenew),
                "yyyy/MM/dd hh:mm:ss"
              );
            }
          }
        }
      } else {
        if (hours > 7 * 24) {
          this.maxPage = hours / (7 * 24);
          let newTim = startDatenew;
          width1s = (offsetWidth * this.maxPage) / Scale;
          this.oneFW = width1s;
          //一个刻度的宽
          this.oneTickW = 10 / (width1s * 10);
          this.sevenHours(newTim, hours, width1s, newTime);
          this.setStertTimeAndEndTime();
          this.initCanvas("canvas", "ctx");
          this.computeCurrentPage(this.waveStartDate);
          return;
        } else this.sevenHours(startDate, hours, width1s, newTime);
      }
      this.initCanvas("canvas", "ctx");
      this.$emit("getAlarmData", this.startTimeTrend, data => {
        if (Array.isArray(data)) {
          this.drawAlarm(data);
        } else throw new Error("报警类型错误，参数应为数组！");
      });
      this.getData();
    },
    //设置开始时间和结束时间
    setStertTimeAndEndTime() {
      let startTime = "";
      if (this.previousPageDisabled) {
        startTime = this.monitorStartDate;
      } else {
        let time = new Date(
          new Date(this.monitorStartDate).getTime() +
            this.currentPage * (7 * 24) * 60 * 60 * 1000
        );
        startTime = formatDate(new Date(time), "yyyy/MM/dd hh:mm:ss");
      }
      this.startTimeTrend = startTime;
      this.lastTime = formatDate(
        new Date(new Date(startTime).getTime() + 1 * (7 * 24) * 60 * 60 * 1000),
        "yyyy/MM/dd hh:mm:ss"
      );
    },
    sevenHours(startDate, hours, width1s, newTime) {
      let startDatenew = new Date(startDate);
      //12小时一个刻度共多少刻度
      let Scales = parseInt(hours / 12);
      let endsta = formatDate(
        new Date(startDatenew.getTime() + Scales * 12 * 60 * 60 * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
      let newtime = formatDate(new Date(endsta), "yyyy-MM-dd") + " 12:00:00";
      if (new Date(endsta).getHours() < 12)
        newtime = formatDate(new Date(endsta), "yyyy-MM-dd") + " 00:00:00";
      let newhours =
        (new Date(newtime).getTime() - new Date(startDate).getTime()) /
        1000 /
        60 /
        60;
      if (hours - newhours > 12) {
        Scales = Math.ceil(hours / 12);
      }
      for (let index = 1; index <= Scales; index++) {
        const element = index;
        startDatenew = new Date(startDatenew.getTime() + 12 * 60 * 60 * 1000);
        if (new Date(startDatenew).getHours() < 12) {
          let time =
            formatDate(new Date(startDatenew), "yyyy-MM-dd") + " 00:00:00";
          let datesss =
            (new Date(time).getTime() - new Date(startDate).getTime()) /
            1000 /
            60;
          this.dateList.push({
            left: datesss * width1s,
            date: formatDate(new Date(startDatenew), "MM-dd"),
            isShow: true
          });
        } else {
          let time =
            formatDate(new Date(startDatenew), "yyyy-MM-dd") + " 12:00:00";
          let datesss =
            (new Date(time).getTime() - new Date(startDate).getTime()) /
            1000 /
            60;
          this.dateList.push({
            left: datesss * width1s,
            date: "12:00",
            isShow: true
          });
        }
        if (element == Scales) {
          this.lastTime = newTime;
        }
      }
    },
    initEchart() {
      const chart = echarts.getInstanceByDom(this.$refs.fullViewDomRef);
      if (chart) chart.dispose(); // 销毁旧实例
      this.echarts = echarts.init(this.$refs.fullViewDomRef);
    },
    //双击时间轴
    dblclickMaskDom(event) {
      let clcikPx = event.offsetX * this.oneTickW * 60 * 1000;
      let currentTime = formatDate(
        new Date(new Date(this.startTimeTrend).getTime() + clcikPx),
        "yyyy/MM/dd hh:mm:ss"
      );
      this.$emit("dblclickMaskDom", currentTime);
    },
    //创建dom
    initCanvas(canvasStr, ctxStr, name, callback) {
      if (canvasStr && ctxStr) {
        let canvas = document.createElement("canvas");
        canvas.className = canvasStr;
        canvas.style.width = this.$refs.fullViewDomRef.offsetWidth + "px";
        canvas.style.heigh = this.$refs.fullViewDomRef.offsetHeight + "px";
        let ctx = canvas.getContext("2d");
        const ratio = window.devicePixelRatio;
        if (ratio) {
          canvas.setAttribute(
            "width",
            this.$refs.fullViewDomRef.offsetWidth * ratio + ""
          );
          canvas.setAttribute(
            "height",
            this.$refs.fullViewDomRef.offsetHeight * ratio + ""
          );
          ctx.scale(ratio, ratio);
        }
        canvas.style.position = "absolute";
        canvas.style.left = 0 + "";
        canvas.style.top = 0 + "";
        canvas.style.cursor = "pointer";
        this.$refs.fullViewDomRef.appendChild(canvas);
        this[canvasStr] = canvas;
        this[ctxStr] = ctx;
      }
      if (name && callback) {
        this[canvasStr].addEventListener(name, callback);
      }
    },
    //绘制线段
    drawLine(x, lineWidth, lineColor, ctx) {
      ctx.beginPath();
      if (lineColor !== undefined) {
        ctx.strokeStyle = lineColor;
      }
      if (lineWidth !== undefined) {
        ctx.lineWidth = lineWidth;
      }
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.$refs.fullViewDomRef.offsetHeight);
      ctx.stroke();
    },
    setOption() {
      this.echarts.setOption(this.option, true);
    },
    setSeries(name) {
      const item = this.waveTitle.filter(m => m == name)[0];
      if (!item) {
        throw new Error("加载趋势名无匹配！");
      }
      if (this.waveData[item] == undefined) {
        this.option.series[0].data = [];
        throw new Error("加载趋势数据无匹配！");
      }
      var objString = JSON.stringify(this.waveData[item]);
      var obj2 = JSON.parse(objString);
      this.option.series[0].data = obj2 || [];
      this.option.series[0].areaStyle.color = this.waveDataConfig[item].color;
      this.option.yAxis[0].max = this.waveDataConfig[item].max;
      this.option.yAxis[0].min = this.waveDataConfig[item].min;
      this.option.series[0].data.unshift({
        name: this.startTimeTrend,
        value: [this.startTimeTrend, ""]
      });
      this.option.series[0].data.push({
        name: this.lastTime,
        value: [this.lastTime, ""]
      });
      this.setOption();
    },
    //全览图切换
    selectChange(name) {
      this.setSeries(name);
    },
    //获取数据
    getData() {
      this.$emit("getTrendData", this.startTimeTrend, data => {
        this.option.series[0].data = [];
        // this.initEchart();
        this.waveData = data;
      });
    },
  }
};
</script>

<style lang="scss" scoped>
#fullView {
  .fullView_top {
    width: 100%;
    height: 20px;
    display: flex;
    border-bottom: 1px solid #dddddd;
    &_left,
    &_right {
      width: 31px;
      display: flex;
      align-items: center;
      cursor: pointer;
      z-index: 99;
    }
    &_right {
      width: 16px;
      background: #ffffff;
    }
    &_left {
      span {
        background: #ffffff;
        height: 20px;
        line-height: 20px;
      }
    }
    &_center {
      flex: 1;
      position: relative;
      overflow: hidden;
      transition: 2s;
      &_time {
        height: 20px;
        text-align: center;
        position: absolute;
        user-select: none;
        top: -0px;
        &_text {
          font-family: PingFangSC-Regular;
          font-weight: Regular;
          font-size: 10px;
          color: #333333;
          letter-spacing: 0;
          transform: translateX(-50%);
          height: 10px;
        }
        &_tbas {
          height: 6px;
          width: 1px;
          background: #000000;
          margin-top: 5px;
        }
      }
    }
  }
  .fullView_btn {
    width: 100%;
    display: flex;
    z-index: 99999999;
    &_left,
    &_right {
      width: 31px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    &_center {
      flex: 1;
      position: relative;
    }
  }
  .iconfonts {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
  }
}
.disabled {
  color: #cccccc;
  cursor: no-drop !important;
}
.blackTheme{
  .fullView_top{
    background: #33393D !important;
    border-bottom: 0px solid #33393D !important;
    .fullView_top_left{
      >span{
        background: #33393D !important;
        color: #DCDFE7 !important;
      }
    }
    .fullView_top_center_time{
      >div{
        color: #DCDFE7 !important;
      }
      .fullView_top_center_time_tbas{
        background: #DCDFE7 !important;
      }
    }
    .fullView_top_right{
      background: #33393D !important;
      color: #DCDFE7 !important;
    }
  }
  .fullView_btn{
    .fullView_btn_center{
      background: #13191E !important;
    }
    .fullView_btn_left,.fullView_btn_right{
      background: #33393D !important;
      >span{
        color: #DCDFE7 !important;
      }
    }
  }
}
</style>
