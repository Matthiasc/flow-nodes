<script setup lang="ts">
import { useNodesStore } from '@/stores/nodes.store';
import { ref } from 'vue';
const nodes = useNodesStore();


const availableNodes = ref([
    { type: 'test-node', title: 'Test Node', description: 'test node description' },
    { type: 'another-node-type', title: 'Another Node Type', description: 'another node type description' },
]);


</script>

<template>
    <div class="nodes-panel">
        <h3>Available Nodes</h3>
        <ul>
            <li v-for="node in availableNodes" :key="node.type">
                <div>
                    <div>{{ node.title }}</div>
                    <div>{{ node.description }}</div>
                </div>
                <button @click="nodes.addNode(node.type)">Add</button>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.nodes-panel {
    padding: 16px;
    /* background: #f9f9f9; */
    border-right: 1px solid #ddd;
    height: 100%;
    overflow-y: auto;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.nodes-panel h3 {
    margin: 0 0 16px;
    font-size: 18px;
    color: #333;
}

li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 8px;
    background: #fff;
}

li button {
    padding: 4px 8px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

li button:hover {
    background: #337ab7;
}
</style>
