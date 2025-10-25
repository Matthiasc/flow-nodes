<script setup lang="ts">
import { ref } from 'vue';
import { useNodesStore } from '../stores/nodes.store';
import Node from './Node.vue';

const nodesStore = useNodesStore();
const canvasRef = ref<HTMLElement>();

function handleCanvasClick(event: MouseEvent) {
  // Only add node if clicking directly on canvas (not on a node)
  if (event.target === canvasRef.value) {
    nodesStore.deSelectNode();
  }
}

function handleNodeMouseDown(node: any, event: MouseEvent) {
  nodesStore.selectNode(node.id);

  let isDragging = false;

  // Get canvas bounds first
  const rect = canvasRef.value!.getBoundingClientRect();

  // Calculate the offset from mouse to node's top-left corner
  const startX = event.clientX - rect.left - node.x;
  const startY = event.clientY - rect.top - node.y;

  const handleMouseMove = (e: MouseEvent) => {
    isDragging = true;

    // Calculate new position by subtracting the initial offset
    const newX = e.clientX - rect.left - startX;
    const newY = e.clientY - rect.top - startY;

    nodesStore.updateNodePosition(node.id, newX, newY);
  };

  const handleMouseUp = () => {
    if (!isDragging) {
      // This was a click, not a drag
      //   return;
    }
    nodesStore.snapNodeToGrid(node.id);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}
</script>

<template>
  <div class="viewport">
    <div ref="canvasRef" class="canvas" @click="handleCanvasClick">
      <Node v-for="node in nodesStore.nodes" :key="node.id" :id="node.id" :style="{
        position: 'absolute',
        left: node.x + 'px',
        top: node.y + 'px',
        cursor: 'move'
      }" @mousedown="(event: MouseEvent) => handleNodeMouseDown(node, event)" />
    </div>
  </div>
</template>

<style scoped>
.viewport {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.canvas {
  flex: 1;
  position: relative;
  background: #fafafa;
  background-image:
    radial-gradient(circle, #ccc 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 10px 10px;
  overflow: hidden;
  cursor: crosshair;
}

.node-actions {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
}

.remove-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: #f56c6c;
  color: white;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #d9534f;
}
</style>