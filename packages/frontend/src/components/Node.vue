<script setup lang="ts">
import { useNodesStore } from '../stores/nodes.store';
import { computed } from 'vue';
import { defineEmits } from 'vue';

const props = defineProps<{
    id: string,
}>();

const emit = defineEmits<{
    (e: 'node-mousedown', node: any, event: MouseEvent): void;
}>();

const nodesStore = useNodesStore();
const node = nodesStore.getNodeById(props.id);
const isSelected = computed(() => {
    return node ? node.id === nodesStore.selectedNodeId : false;
});

function onNodeMouseDown(node: any, event: MouseEvent) {
    emit('node-mousedown', node, event);
}
</script>

<template>
    <div class="container">

        <div class="node" :class="{ 'node__selected': isSelected, }">

            <div class="graphic" @mousedown="(event: MouseEvent) => onNodeMouseDown(node, event)">
                node
            </div>

            <div class="inputs">
                <div class="input"></div>
            </div>
            <div class="outputs">
                <div class="output"></div>
                <div class="output"></div>
            </div>
        </div>

        <div v-if="node?.label" class="label">
            {{ node?.label }}
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;

    --connection-size: 12px;
}

.node {
    position: relative;
    width: 80px;
    height: 80px;

}

.graphic {

    background: #ffffff;
    border: 2px solid #AAA;
    border-radius: 20px;
    padding: 12px;
    width: 100%;
    height: 100%;
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
    text-align: center;
    color: #666;
    /* position: absolute;
    bottom: 0px; */
    /* border-bottom: 1px solid #ebeef5; */
    /* padding-bottom: 8px;
    margin-bottom: 8px; */
}

.outputs {
    position: absolute;
    right: 1px;
    top: 50%;
    display: flex;
    flex-direction: column;
    gap: calc(var(--connection-size) / 2);
    justify-content: center;
    align-items: center;
    transform: translate(50%, -50%);
    pointer-events: none;

}

.output {
    background-color: #666;
    border-radius: 999px;
    width: var(--connection-size);
    height: var(--connection-size);
    cursor: pointer;
    pointer-events: all;
}

.output:hover {
    background-color: #409eff;
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