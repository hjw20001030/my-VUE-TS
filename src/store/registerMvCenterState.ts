import { defineStore } from 'pinia'
import { ref } from 'vue'

export const sueMvCenterState = defineStore('sueMvCenterState ', ()=>{
    const records = ref<any>([]);
    return {
        records
    }
})