<script setup lang="ts">
const props = withDefaults(defineProps<{
    title?: string
}>(), {
    title: 'Node'
})
</script>

<template>
    <div class="node">
        <div class="node-header">
            <h3>{{ title }}</h3>
        </div>
        <div class="node-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.node {
    background: #ffffff;
    border: 2px solid #dcdfe6;
    border-radius: 8px;
    padding: 12px;
    min-width: 180px;
    max-width: 250px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    user-select: none;
    /* transition: all 0.2s ease; */
    position: relative;
}

.node:hover {
    border-color: #409eff;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    /* transform: translateY(-1px); */
}

.node-header {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 8px;
    margin-bottom: 8px;
}

.node-header h3 {
    margin: 0;
    font-size: 16px;
    color: #303133;
    font-weight: 600;
}

.node-content {
    padding: 4px;
    font-size: 14px;
    color: #606266;
    line-height: 1.4;
    min-height: 20px;
}

.node-content p {
    margin: 0;
}
</style>