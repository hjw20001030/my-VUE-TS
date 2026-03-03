<template>
  <div class="myTest">
    <div class="left1" :class="{'opacity':left1}">
        <img src="@/assets/img/test/left1.png">
    </div>
    <div class="line" :class="{'opacity':left2}"></div>
     <div class="left2" :class="{'opacity':left2}">
        <img src="@/assets/img/test/left1.png">
    </div>
    <div class="line" :class="{'opacity':left3_1}"></div>
    <div class="left3" :class="{'opacity':left3_1}">
        <div class="left3_1" :class="{'opacity':left3_1}">
            <img src="@/assets/img/test/left3_1.png">
        </div>
          <div class="left3_2" :class="{'opacity':left3_2}">
            <img src="@/assets/img/test/left3_2.png">
        </div>
          <div class="left3_3" :class="{'opacity':left3_3}">
            <img src="@/assets/img/test/left3_3.png">
        </div>
    </div>
    <div class="line" :class="{'opacity':left4_1}"></div>
    <div class="left4" :class="{'opacity':left4_1}">
       <div class="left4_1" :class="{'opacity':left4_1}">
        <img src="@/assets/img/test/left4_text1.png">
        <!-- <img src="@/assets/img/test/left4_b.gif"> -->
       </div>
       <div class="left4_2" :class="{'opacity':left4_2}">
        <img src="@/assets/img/test/left4_text2.png">
        <!-- <img src="@/assets/img/test/left4_r.gif"> -->
       </div>
        <div class="left4_3" :class="{'opacity':left4_3}">
        <img src="@/assets/img/test/left4_3.png">
       </div>
       <div class="left4_4" :class="{'opacity':left4_4}">
        <div class="left4_4_1"> <img src="@/assets/img/test/left4_4_1.png"></div>
         <div class="left4_4_2"><img src="@/assets/img/test/left4_4_2.png"></div>
          <div class="left4_4_3"><img src="@/assets/img/test/left4_4_3.png"></div>
       </div>
        <div class="left4_5" :class="{'opacity':left4_5}">
        <img src="@/assets/img/test/left4_5.png">
       </div>
       <div class="left4_6" :class="{'opacity':left4_6}">
        <img src="@/assets/img/test/left4_6_1.png">
         <img src="@/assets/img/test/left4_6_2.png">
         <img src="@/assets/img/test/left4_6_3.png" :class="{'animation':left5}">
       </div>
    </div>
    <div class="line" :class="{'opacity':left5}"></div>
    <div class="left5" :class="{'opacity':left5}">
        <img src="@/assets/img/test/left5.png">
    </div>
  </div>
</template>

<script>
    const time = 1500;
export default {
    data() {
        return {
            left1: false,
            left2: false,
            left3_1: false,
            left3_2: false,
            left3_3: false,
            left4_1: false,
            left4_2: false,
            left4_3: false,
            left4_4: false,
            left4_5: false,
            left4_6: false,
            left5: false,
        }
    },
    mounted(){
        this.left1 = true;
        setTimeout(()=>{
            this.left2 = true;
            setTimeout(()=>{
                this.left3_1 = true;
                setTimeout(()=>{
                    this.left3_2 = true;
                    setTimeout(()=>{
                        this.left3_3 = true;
                        setTimeout(()=>{
                            this.left4_1 = true;
                                setTimeout(()=>{
                                    this.left4_2 = true;
                                    setTimeout(()=>{
                                        this.left4_3 = true;
                                        setTimeout(()=>{
                                            this.left4_4 = true;
                                            setTimeout(()=>{
                                                this.left4_5 = true;
                                                setTimeout(()=>{
                                                    this.left4_6 = true;
                                                     setTimeout(()=>{
                                                        this.left5 = true;
                                                     },time);
                                                },time);
                                            },time);
                                        },time);
                                    },time);
                                },time);
                        },time);
                    },time);
                },time);
            },time);
        },time);
    }
}
</script>

<style lang="scss" scoped>
.myTest{
    width: 3702px;
    height: 1373px;
      background-image: url('~@/assets/img/test/left4_all.gif');
        // background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        position: relative;
        left: 0;
        right: 0;
        top: 0;
    // border: 1px solid red;
    display: flex;
    .opacity{
        opacity: 1 !important;
        transition: opacity 5s ease;
    }
    .left4{
        width: calc(1266px - 29px - 16px);
        height: calc(1366px - 20px);
        padding-bottom: 20px;
        padding-left: 29px;
        padding-right: 16px;
        opacity: 0;
        .left4_6{
            width: 100%;
            position: relative;
            text-align: center;
            height: 646px;
            margin-top: 60px;
            opacity: 0;
            >img:nth-child(1){
                width: 1134px;
                height: 100%;
            }
            >img:nth-child(2){
                position: absolute;
                top: -33px;
                left: 50%;
                transform: translateX(-50%);
            }
            >img:nth-child(3){
                position: absolute;
                transform: translateX(-50%);
                top: 50%;
                left: 50%;
                transform: translate(-50%,-66%);
            }
        }
        .animation{
            animation: spin 2s linear infinite;
            margin-top: -170px;
            margin-left: -130px;
        }
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        .left4_3{
            margin-top: 137px;
            position: relative;
            text-align: center;
            opacity: 0;
            >img{
                width: 571px;
            }
            width: 100%;
            height: 130px;
            z-index: 3;
        }
        .left4_4{
            // margin-top: 107px;
            position: relative;
            width: 100%;
            height: 130px;
            justify-content: space-between;
            display: flex;
            align-items: center;
            z-index: 2;
            opacity: 0;
            .left4_4_1{
                width: 301px;
                height: 89px;
            }
            .left4_4_2{
                width: 571px;
                height: 100%;
            }
            .left4_4_3{
                width: 301px;
                height: 89px;
            }
        }
        .left4_5{
            opacity: 0;
             text-align: center;
            width: 100%;
            height: 130px;
             >img{
                width: 571px;
            }
        }
        .left4_1{
            height: 42px;
            opacity: 0;
            width: 767px;
            position: relative;
            >img:nth-child(1){
                margin-left: 18px;
            }
            >img:nth-child(2){
                width: 100%;
                height: 251px;
            }
        }
        .left4_2{
            margin-top: 42px;
            height: 42px;
            width: 545px;
            position: relative;
            opacity: 0;
            >img:nth-child(1){
                margin-left: 18px;
                margin-top: 22px;
            }
            >img:nth-child(2){
                width: 100%;
                height: 142px;
            }
        }
    }
    .left5{
          width: 390px;
        height: 1366px;
        margin-left: 25px;
        opacity: 0;
    }
    .left1{
        width: 390px;
        height: 1366px;
        margin-right: 25px;
        opacity: 0;
    }
    .line{
        width: 5px;
        height: 100%;
        background-color: #000;
        opacity: 0;
    }
    .left2{
        width: 390px;
        height: 1366px;
        margin-left: 25px;
        margin-right: 52px;
        opacity: 0;
    }
    .left3{
        width: calc(1155px - 25px - 23px);
        height: 1366px;
        padding-left: 25px;
        padding-right: 23px;
        opacity: 0;
        .left3_1{
            margin-top: 15px;
            width: 1107px;
            height: 346px;
            opacity: 0;
        }
         .left3_2{
            margin-top: 32px;
           width: 1064px;
           opacity: 0;
height: 638px;
text-align: center;
        }
         .left3_3{
            margin-top: 9px;
           width: 1097px;
           opacity: 0;
height: 313px;
        }
    }
}
</style>