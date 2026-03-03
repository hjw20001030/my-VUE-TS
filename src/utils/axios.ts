import axios, { AxiosInstance } from 'axios';
import { useUserState } from '@/store/userState';
import { useRouter } from 'vue-router';
const toLogin = () =>{
    const userState = useUserState();
    const router = useRouter()
    userState.logout(() => {
        router.push({ name: '/Login' })
    });
}
type RequestConfig<T = any> = {
    url: string
    method?: 'get' | 'post' | 'put' | 'delete'
    data?: T
    params?: T
    headers?: Record<string, string>
}
const Tip = (msg: string) => {
    ElMessage({
        showClose: true,
        message: msg,
        type: "warning"
    })
}
class Http {
    private instance: AxiosInstance;
    constructor() {
        this.instance = axios.create();
        this.setupInterceptors();
    }

    private setupInterceptors() {
        // 请求拦截
        this.instance.interceptors.request.use((config: any) => {
            const userState = useUserState();
            if(userState.token){
                if(config.url.includes('?')){
                    config.url = config.url + '&accessToken='+userState.token;
                }else{
                    config.url = config.url + '?accessToken='+userState.token;
                }
                if(!config.url.includes('/oauth2/')){
                    config.url = '/gateway/api' + config.url;
                }
            }
            return config
        })

        // 响应拦截
        this.instance.interceptors.response.use(
            (response) =>
                response.status === 200 ? Promise.resolve(response) : Promise.reject(response),
            (error) => {
                const { response } = error;
                if (response) {
                    this.errorHandle(response.status, response.data.message);
                    return Promise.reject(response);
                } else {
                    if (!window.navigator.onLine) {
                    } else {
                        return Promise.reject(error);
                    }
                }
            }
        )
    }
    /** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
    public errorHandle(status: number, other: object) {
        // 状态码判断
        switch (status) {
            // 401: 未登录状态，跳转登录页
            case 401:
                toLogin();
                break;
            // 403 token过期
            // 清除token并跳转登录页
            case 403:
                Tip('登录过期，请重新登录');
                setTimeout(() => {
                   toLogin();
                }, 1000);
                break;
            // 404请求不存在
            case 404:
                Tip('请求的资源不存在');
                break;
            case 500:
                Tip('服务器报错～');
                console.log(other);
                break;
            default:
                console.log(other);
        }
    }

    public async request<T>(config: RequestConfig): Promise<T> {
        const { url, method = 'get', data, params, headers } = config
        const response = await this.instance.request<T>({
            url,
            method,
            data,
            params,
            headers
        })
        return response.data;
    }

    public get<T>(url: string, params?: any): Promise<T> {
        return this.request({ url, method: 'get', params })
    }

    public post<T>(url: string, data?: any): Promise<T> {
        return this.request({ url, method: 'post', data })
    }

    public put<T>(url: string, data?: any): Promise<T> {
        return this.request({ url, method: 'put', data })
    }

    public delete<T>(url: string, params?: any): Promise<T> {
        return this.request({ url, method: 'delete', params })
    }
}

export const http = new Http();
