<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store';
import { useNodesStore } from '../stores/nodes.store';

const nodesStore = useNodesStore();
const uiStore = useUiStore();

</script>

<template>
  <div class="canvas-toolbar">
    <button @click="nodesStore.addNode('hello')" class="add-node-btn">
      Add Node
    </button>
    <button @click="nodesStore.clearNodes()" class="clear-nodes-btn">
      Clear All
    </button>

    <button @click="uiStore.togglePanels()" class="clear-nodes-btn">
      Toggle Panels
    </button>
    <span class="node-count">Nodes: {{ nodesStore.nodeCount }}</span>
  </div>
</template>

<style scoped>
.canvas-toolbar {
  padding: 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 12px;
  align-items: center;
}

.add-node-btn,
.clear-nodes-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-node-btn {
  background: #409eff;
  color: white;
}

.add-node-btn:hover {
  background: #337ab7;
}

.clear-nodes-btn {
  background: #f56c6c;
  color: white;
}

.clear-nodes-btn:hover {
  background: #d9534f;
}

.node-count {
  margin-left: auto;
  font-size: 14px;
  color: #666;
}
</style>