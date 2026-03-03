<template>
    <div class="enlarge" @click.stop="close">
        <img class="enlarge_img" :src="src" alt="">
        <p class="pre_img iconfont icon-previous" @click="next('pre')"></p>
        <p class="next_img iconfont icon-next" @click="next('next')"></p>
    </div>
</template>
<script>
export default {
    props: ["detailsDataImg", "currentId"],
    data() {
        return {
            src: '',
            index: this.currentId,
        }
    },
    mounted() {
        this.src = this.detailsDataImg[this.currentId]['imageUrl']
    },
    methods: {
        next(msg){
            if(msg == "pre"){
                if(this.index == 0){
                    this.index = 0;
                    this.$message.warning('已经是第一张啦');
                }else {
                    this.index--;
                }
            }else if(msg == "next"){
                if(this.index == this.detailsDataImg.length-1){
                    this.index = this.detailsDataImg.length-1;
                    this.$message.warning('已经是最后一张啦');
                }else {
                    this.index++;
                }
            }
            this.src = this.detailsDataImg[this.index]['imageUrl'];
        },
        close(e) {
            if(e.target.className == "enlarge" || e.target.className == "enlarge_img"){
                this.$emit('close',false);
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .enlarge{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        position: fixed;
        z-index: 2;
        left: 0;
        top: 0;
        .enlarge_img{
            width: auto;
            height: 90%;
            position: absolute;
            // z-index: 3;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
        .pre_img,
        .next_img{
            width: 50px;
            height: 50px;
            line-height: 50px;
            position: absolute;
            top: 50%;
            text-align: center;
            font-size: 18px;
            color: #fff;
            cursor: pointer;
            background-color: rgba(116, 110, 110, 0.3);
        }
        .pre_img{
            left: 50px;
            transform: translate(-50%,-50%);
            &:hover{
                background-color: rgba(116, 110, 110, 0.7);
            }
        }
        .next_img{
            right: 0px;
            transform: translate(-50%,-50%);
            &:hover{
                background-color: rgba(116, 110, 110, 0.7);
            }
        }
    }
</style>