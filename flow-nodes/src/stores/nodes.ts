import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface NodeData {
    id: string
    title: string
    x: number
    y: number
    content?: string
}

export const useNodesStore = defineStore('nodes', () => {
    const nodes = ref<NodeData[]>([])
    const nextNodeId = ref(1)

    const nodeCount = computed(() => nodes.value.length)

    function addNode(x: number = 100, y: number = 100, title: string = 'New Node') {
        const newNode: NodeData = {
            id: `node-${nextNodeId.value}`,
            title,
            x,
            y,
            content: ''
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


    function updateNodeTitle(nodeId: string, title: string) {
        const node = nodes.value.find(node => node.id === nodeId)
        if (node) {
            node.title = title
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
        node.x = Math.round(node.x / 20) * 20
        node.y = Math.round(node.y / 20) * 20

    }

    return {
        nodes,
        nodeCount,
        addNode,
        removeNode,
        updateNodePosition,
        updateNodeTitle,
        getNodeById,
        clearNodes,
        snapNodeToGrid
    }
})