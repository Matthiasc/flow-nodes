import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useConfigStore } from './settings.store'



export interface NodeType {
    id: string,
    description?: string,
    name: string,
}

export const useNodesStore = defineStore('nodes', () => {
    const config = useConfigStore();

    const nodeTypes = ref<NodeType[]>([])

    async function loadTypes() {
        // Simulate an API call to fetch node types
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                nodeTypes.value = [
                    { id: 'test-node', description: 'test node', name: 'test node' },
                    { id: 'test-node-2', description: 'test node 2', name: 'test node 2' },
                ]
                resolve()
            }, 1000)
        })
    }

    return {
        loadTypes
    }
})