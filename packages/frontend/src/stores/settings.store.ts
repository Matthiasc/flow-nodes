import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useConfigStore = defineStore('config', () => {
    const gridSize = ref(20);


    return {
        gridSize
    }
})