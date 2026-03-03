<template>
  <div class="login flex">
    <div class="login_l pr">
        <div class="smo-login-logo pa">
            <img src="@/assets/img/smo_login_logo.png">
        </div>
    </div>
    <div class="login_r pr" >
        <div class="logo">
          <img src="@/assets/img/smo_login_icon.png">
          <p class="title">重症数据云平台</p>
        </div>
        <el-form
          id="form"
          :model="userdata"
          :rules="userRule"
            ref="ruleFormRef"
          class="smo-login-ce3"
          label-width="auto"
        >
        <p class="mb_10">
          <span :class="{color_0B4095:checked}">账号登录</span>
        </p>
        <el-form-item prop="account">
          <el-input class="svm_login_input" id="account"  name="username" v-model="userdata.account" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="svm_login_input" id="password"  name="password" v-model="userdata.password" placeholder="密码"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="border: none;" @click="loginEvent(ruleFormRef)">登&nbsp;&nbsp;录</el-button>
          <input type="hidden" name="frameLogin" value="true"/>
        </el-form-item>
        <p class="mt10 ta_r">
          <span class="color_0B4095" @click="checkedForgotPwd">忘记密码</span>
        </p>
      </el-form>

     <div class="btn pa" >
        <p>© 2017-{{new Date().getFullYear()}} 科技公司 版权所有</p>
        <p class="mt_10">联系我们：com</p>
        <div class="flex flex_ac mt_10">
            <a target="_blank" href="https://www.XXX">隐私政策</a> <span>｜</span> <a target="_blank" href="https://www.xxx.com/about">关于我们</a>
        </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { authorize,accessToken,loginParams } from '@/api/login'
import { useUserState} from '@/store/userState'
interface RuleForm {
  account: string
  password: string
  mailCode: string
}
const userdata = reactive<RuleForm>({
  // account: 'MTg2MjEwNTA3NTY=',
  // password: 'MTIzNDU2QGhw',
  account:'MjIyMDAxMDEwMDM=',
  password:'U3ZtQDIwMjNeJio=',
  mailCode: ''
})
const checked = ref<boolean>(true);
const ruleFormRef = ref<FormInstance>()
const userRule = reactive<FormRules<RuleForm>>({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  mailCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})
const loginEvent = async (formEl :FormInstance | undefined) =>{
     if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
          var requestData = JSON.parse(JSON.stringify(loginParams));
          requestData["username"] = userdata.account;
          requestData["password"] =  userdata.password;
          authorize(requestData).then((res:any) => {
            getAccessToken(res.res_code);
          }).catch((err) => {
            feedBackUrlCallBack(err)
          })
        } else {
        console.log('error submit!', fields)
        }
    })
    
}
const userState = useUserState();
const getAccessToken = (code:any) => {
  var requestData = JSON.parse(JSON.stringify(loginParams));
  requestData["code"] = code;
  accessToken(requestData).then((res:any) => {
    console.log(res)
    if (res.access_token) {
      userState.token = res.access_token;
      userState.refreshToken = res.refresh_token;
      location.href = '/registerMvCenter';
    }
  }).catch((err) => {
     ElMessage({ message: err.msg, duration: 1000,type: "error" });
  })
}
 const feedBackUrlCallBack = (result:any) =>{
        if (result.code == "INVALID_AUTHENTICATIONHANDLER") {
          var res = JSON.parse(JSON.stringify(result.message));
          if (res[0].id == 'INVALID_CAPTCHA') {
            ElMessage({showClose: true, message: "验证码错误", type: "error"});
          } else if (res[0].id == "INVALID_USERNAMEPASSWORD_MISMATCH") {
            ElMessage({showClose: true, message: "用户名密码错误", type: "error"});
          } else if (res[0].id == "INTERNAL_ERROR") {
            ElMessage({showClose: true, message: "用户名密码错误", type: "error"});
          }
        } else if (result.code == "INVALID_MATCH_TICKET") {
          location.reload();
        } else if (result.code != "SUCCESS") {
          ElMessage({showClose: true, message: "系统内部异常", type: "error",duration: 3000});
        }
  }
</script>

<style scoped lang="scss">
.login {
    width: 100%;
    height: 100%;
    // background-color: #fff;
    background-image: url('@/assets/img/smo_login_bg_hall.png');
    background-origin: content-box;
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    .login_r{
        height: calc(100% - 120px);
        width: calc(812px - 99px);
        background: #FDFDFD;
        padding-top: 120px;
        padding-left: 99px;
        .logo{
            .title{
                font-family: PingFangSC-S0pxibold;
                font-weight: 600;
                font-size: 32px;
                color: #333333;
                letter-spacing: 0;
                user-select: none;
            }
        }
        .smo-login-ce3{
            margin-top: 80px;
            width: 360px;
            >p{
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 14px;
                letter-spacing: 0;
                cursor: pointer;
            }
            .color_0B4095{
                color: #1C4991;
            }
            .el-form-item {
                width: 100%;
                height: 56px;
                background: #EBEFF5;
                border-radius: 2px;
                margin-bottom: 20px;
                :deep(.el-form-item__content) {
                    .el-input{
                        width: 100%;
                        height: 100%;
                        background: #EBEFF5;
                        border-radius: 2px;
                        .el-input__wrapper{
                            padding: 0px;
                            .el-input__inner{
                                width: calc(100% - 16px);
                                height: 100%;
                                background: #EBEFF5;
                                border-radius: 2px;
                                padding-left: 16px;
                                font-weight: 400;
                                font-size: 14px;
                                color: #333333;
                            }
                        }
                        
                    }
                    .el-button{
                        width: 100%;
                        height: 100%;
                        background: #1C4991;
                        border-radius: 2px;
                        font-weight: 500;
                        font-size: 16px;
                        color: #FFFFFF;
                    }
                    .el-form-item__error{
                        font-size: 12px;
                    }
                }
            }
        }
        .btn{
            bottom: 64px;
            p{
                font-family: PingFangSC-Regular;
                font-weight: 400;
                font-size: 12px;
                color: #333333;
            }
          div{
                a{
                    font-weight: 400;
                    font-size: 12px;
                    color: #0B4095;
                }
                span{
                      font-size: 12px;
                }
          }
        }
    }
    .login_l{
        height: 100%;
        width: calc(100% - 812px);
        .smo-login-logo{
            top: 80px;
            left: 80px;
        }
    }
}
</style>
