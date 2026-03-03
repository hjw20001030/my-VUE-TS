import { defineStore } from 'pinia'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
interface UserState {
    token: string
    refreshToken: string,
    userInfo: object
}
export const useUserState = defineStore('userState ', {
    state: ():UserState => ({
        token: '',
        refreshToken: '',
        userInfo: {}
    }),
    actions: {
       clearAuthTokens() {
            this.$reset()
            localStorage.clear();
            sessionStorage.clear();
       },
       async logout(cleanupCallback?: () => void) {
            try {
                // 仅处理业务逻辑，不包含路由跳转
                this.clearAuthTokens()
                cleanupCallback?.()
            } catch (error) {
                console.error('注销异常:', error)
                throw error
            }
        }
    },
    persist: {
        key: 'userState',
        serializer: {
            serialize: JSON.stringify,
            deserialize: JSON.parse
        }
    } as PersistenceOptions
})


