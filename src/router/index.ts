import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import {defineAsyncComponent} from 'vue';


const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component:defineAsyncComponent(() => import('@/pages/login/login.vue'))
    },
    {
        path: '/mechanicalDataReview',
        name: 'mechanicalDataReview',
        meta: {
            title: 'mv数据回顾',
        },
        component: defineAsyncComponent(() => import('@/pages/mv/mechanicalDataReview/main.vue'))
    },
    {
        path: '/registerMvCenter',
        name: 'registerMvCenter',
        meta: {
            title: 'mv中央监护大屏',
        },
        component: defineAsyncComponent(() => import('@/pages/mv/registerMvCenter/main.vue'))
    },
    {
        path: '/mvIndexDetail',
        name: 'mvIndexDetail',
        meta: {
            title: 'mv中央监护大屏-详情页',
        },
        component: defineAsyncComponent(() => import('@/pages/mv/registerMvCenter/indexDetail.vue'))
    },
    {
        path: '/',
        name: '/',
        meta: {
            title: '登录',
        },
      component: defineAsyncComponent(() => import('@/pages/mv/registerMvCenter/main.vue'))
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;