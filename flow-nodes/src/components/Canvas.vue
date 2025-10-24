<script setup lang="ts">
import { ref } from 'vue'
import { useNodesStore } from '../stores/nodes'
import Node from './Node.vue'

const nodesStore = useNodesStore()
const canvasRef = ref<HTMLElement>()

function handleCanvasClick(event: MouseEvent) {
  // Only add node if clicking directly on canvas (not on a node)
//   if (event.target === canvasRef.value) {
//     const rect = canvasRef.value!.getBoundingClientRect()
//     const x = event.clientX - rect.left
//     const y = event.clientY - rect.top
//     nodesStore.addNode(x, y)
//   }
}

function handleNodeMouseDown(node: any, event: MouseEvent) {
  let isDragging = false
  
  // Get canvas bounds first
  const rect = canvasRef.value!.getBoundingClientRect()
  
  // Calculate the offset from mouse to node's top-left corner
  const startX = event.clientX - rect.left - node.x
  const startY = event.clientY - rect.top - node.y
  
  
  const handleMouseMove = (e: MouseEvent) => {
    isDragging = true
    
    // Calculate new position by subtracting the initial offset
    const newX = e.clientX - rect.left - startX
    const newY = e.clientY - rect.top - startY
    
    nodesStore.updateNodePosition(node.id, newX, newY)
  }
  
  const handleMouseUp = () => {
    if (!isDragging) {
      // This was a click, not a drag
    //   return;
    }
    nodesStore.snapNodeToGrid(node.id);
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<template>
  <div class="canvas-container">
    <div class="canvas-toolbar">
      <button @click="nodesStore.addNode()" class="add-node-btn">
        Add Node
      </button>
      <button @click="nodesStore.clearNodes()" class="clear-nodes-btn">
        Clear All
      </button>
      <span class="node-count">Nodes: {{ nodesStore.nodeCount }}</span>
    </div>
    
    <div 
      ref="canvasRef"
      class="canvas" 
      @click="handleCanvasClick"
    >
      <Node
        v-for="node in nodesStore.nodes"
        :key="node.id"
        :title="node.title"
        :style="{
          position: 'absolute',
          left: node.x + 'px',
          top: node.y + 'px',
          cursor: 'move'
        }"
        @mousedown="(event: MouseEvent) => handleNodeMouseDown(node, event)"
      >
        <div class="node-actions">
          <button 
            @click.stop="nodesStore.removeNode(node.id)"
            class="remove-btn"
            title="Remove node"
          >
            ×
          </button>
        </div>
        <p>{{ node.content || 'Click to edit content...' }}</p>
      </Node>
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.canvas-toolbar {
  padding: 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 12px;
  align-items: center;
}

.add-node-btn, .clear-nodes-btn {
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