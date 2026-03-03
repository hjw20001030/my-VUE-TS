<template>
<div class="full-screen-container">
    <RouterView />
</div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted,onBeforeMount,nextTick} from 'vue'
import { useRouter } from 'vue-router';
import { useUserState} from '@/store/userState'
import {refreshToken,logOut,userInfo} from '@/api/login'
const router = useRouter();
const userState = useUserState();
onMounted(()=>{
  if (!userState.token) {
    router.push('/login');
    return;
  }
  nextTick(async()=>{
    const res = await refreshToken(userState.refreshToken) as any;
    if(res.access_token){
      userState.token = res.access_token;
      userState.refreshToken = res.refresh_token;
      const userInfoRes = await userInfo() as any;
      if(userInfoRes.result){
        userState.userInfo = userInfoRes.result;
      }
    }else{
      userState.token = '';
      userState.refreshToken = '';
      localStorage.clear();
      sessionStorage.clear();
      ElMessage.warning('登录过期，请重新登录');
      setTimeout(()=>{
        router.push('/login');
      },1000);
    }
  })
})


const logOutApi = (async()=>{
  await logOut().then(()=>{
    userState.clearAuthTokens();
    router.push('/login');
  }).catch(()=>{
    userState.clearAuthTokens();
    router.push('/login');
  })

})
</script>

<style>
html, body, #app, .full-screen-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
p { margin: 0 }
</style>
