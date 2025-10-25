<script setup lang="ts">
import { useNodesStore } from '../stores/nodes.store';
import { computed } from 'vue';


const props = defineProps<{
    id: string,
}>();

const nodesStore = useNodesStore();
const node = nodesStore.getNodeById(props.id);
const isSelected = computed(() => {
    return node ? node.id === nodesStore.selectedNodeId : false;
});
</script>

<template>
    <div class="container">

        <div class="node" :class="{ 'node__selected': isSelected, }">

            <div class="content">
                node
            </div>

        </div>

        <div class="inputs">
            <div class="input"></div>
        </div>
        <div class="outputs">
            <div class="output"></div>
        </div>

        <div v-if="node?.label" class="label">
            {{ node?.label }}
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
}

.node {
    background: #ffffff;
    border: 2px solid #AAA;
    border-radius: 20px;
    padding: 12px;
    width: 80px;
    height: 80px;
    position: relative;
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.node:hover {
    border-color: #409eff;
    /* box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); */
    /* transform: translateY(-1px); */
}

.label {
    /* position: absolute;
    bottom: 0px; */
    /* border-bottom: 1px solid #ebeef5; */
    /* padding-bottom: 8px;
    margin-bottom: 8px; */
}


.content {
    padding: 4px;
    font-size: 14px;
    color: #606266;
    line-height: 1.4;
    min-height: 20px;
}


.node.node__selected {
    border-color: #999;
    /* border-width: 10px; */
    z-index: 100;
}
</style>