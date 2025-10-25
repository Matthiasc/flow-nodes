<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import { useNodesStore } from '../stores/nodes.store';

const props = defineProps({
  selectedNode: {
    type: Object,
    default: null,
  },
});

const nodesStore = useNodesStore();
const localNode = ref({});

// Watch for changes in the selectedNode and update the local node copy
watch(
  () => props.selectedNode,
  (newNode) => {
    localNode.value = newNode ? { ...newNode } : {};
  },
  { immediate: true }
);

function saveNodeProperties(event: Event) {
  event.preventDefault(); // Prevent default form submission behavior
  if (!props.selectedNode) return;
  nodesStore.updateNode(props.selectedNode.id, localNode.value);
}
</script>

<template>
  <div class="property-panel">
    <div class="panel-header">
      <h3>Node Properties</h3>
    </div>
    <div class="panel-content">
      <form v-if="props.selectedNode" @submit="saveNodeProperties" class="node-properties">
        <div v-for="(value, key) in localNode" :key="key" class="property-group">
          <label :for="`node-${key}`">{{ key }}</label>
          <input :id="`node-${key}`" v-model="localNode[key]" type="text" class="property-input" required />
        </div>
        <button type="submit" class="save-btn">Save</button>
      </form>
      <div v-else class="empty-state">
        <p>Select a node to edit its properties</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.property-panel {
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 300px;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.property-group {
  margin-bottom: 16px;
}

.property-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

.property-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 12px;
}

.save-btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover {
  background: #337ab7;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 32px 16px;
}
</style>