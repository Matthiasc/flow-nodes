import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useConfigStore } from './settings.store'



export interface NodeData {
    id: string
    label: string
    type: string
    x: number
    y: number
}

export const useNodesStore = defineStore('nodes', () => {
    const config = useConfigStore();

    const nodes = ref<NodeData[]>([])
    const nextNodeId = ref(1)
    const selectedNodeId = ref<string | null>(null)

    const nodeCount = computed(() => nodes.value.length)

    function addNode(type: string, x: number = 100, y: number = 100,) {
        const newNode: NodeData = {
            id: nextNodeId.value.toString(),
            type,
            label: "label node",
            x,
            y,
        }
        nodes.value.push(newNode)
        nextNodeId.value++
        return newNode
    }

    function removeNode(nodeId: string) {
        const index = nodes.value.findIndex(node => node.id === nodeId)
        if (index !== -1) {
            nodes.value.splice(index, 1)
        }
    }

    function updateNodePosition(nodeId: string, x: number, y: number) {
        const node = nodes.value.find(node => node.id === nodeId)
        if (!node) return;
        node.x = x < 0 ? 0 : x
        node.y = y < 0 ? 0 : y
    }



    function updateNode(nodeId: string, updatedProperties: Partial<NodeData>) {
        const node = nodes.value.find(node => node.id === nodeId)
        if (node) {
            Object.assign(node, updatedProperties)
        }
    }

    function getNodeById(nodeId: string) {
        return nodes.value.find(node => node.id === nodeId)
    }

    function clearNodes() {
        nodes.value = []
        nextNodeId.value = 1
    }

    function snapNodeToGrid(nodeId: string) {
        const node = nodes.value.find(node => node.id === nodeId)
        if (!node) return;
        node.x = Math.round(node.x / config.gridSize) * config.gridSize
        node.y = Math.round(node.y / config.gridSize) * config.gridSize

    }

    function selectNode(nodeId: string) {
        const node = nodes.value.find(node => node.id === nodeId)
        if (!node) return;
        selectedNodeId.value = nodeId
    }

    function deSelectNode() {
        selectedNodeId.value = null
    }

    return {
        nodes,
        selectedNodeId,
        nodeCount,
        selectNode,
        deSelectNode,
        addNode,
        removeNode,
        updateNodePosition,
        // updateNodeTitle,
        updateNode,
        getNodeById,
        clearNodes,
        snapNodeToGrid
    }
})