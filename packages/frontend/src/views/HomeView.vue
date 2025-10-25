<script setup lang="ts">
import Viewport from '../components/Viewport.vue';
import PropertyPanel from '../components/PropertyPanel.vue';
import NodesPanel from '../components/NodesPanel.vue';
import Toolbar from '../components/Toolbar.vue';
import { useNodesStore } from '../stores/nodes.store';

const nodesStore = useNodesStore();
</script>

<template>
  <main>
    <Toolbar />
    <div class="pannels">
      <PropertyPanel :selectedNode="nodesStore.nodes.find(node => node.id === nodesStore.selectedNodeId)" />
      <Viewport />
      <NodesPanel />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
}

.pannels {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.viewport {
  flex: 1;
}
</style>
