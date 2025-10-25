import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { getNodeTypes, type NodeType } from '../services/api'

export const useNodeTypesStore = defineStore('nodesTypes', () => {
    const nodeTypes = ref<NodeType[]>([])
    const isLoaded = ref(false)

    async function init() {
        if (isLoaded.value) return

        const data = await getNodeTypes()
        nodeTypes.value = data
        isLoaded.value = true;
    }

    return {
        nodeTypes: readonly(nodeTypes),
        isLoaded: readonly(isLoaded),
        loadTypes: init
    }
})