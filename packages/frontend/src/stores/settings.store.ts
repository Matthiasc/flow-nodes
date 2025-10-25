import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useSettingsStore = defineStore('settings', () => {
    const gridSize = ref(20);


    return {
        gridSize
    }
})