import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '@/assets/font/iconfont.css';
import "@/assets/editor/editor.css";
import 'amfe-flexible'
import './utils/flexible'
// 创建vue实例
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(router);
app.use(pinia)
app.use(ElementPlus, {
  locale: zhCn,
})
// 挂载实例
app.mount('#app')
