<script setup lang="ts">
import Viewport from '../components/Viewport.vue';
import PropertyPanel from '../components/PropertyPanel.vue';
import NodesPanel from '../components/NodesPanel.vue';
import Toolbar from '../components/Toolbar.vue';
import { useNodesStore } from '../stores/nodes.store';
import Panels from '@/components/Panels.vue';
import Workflows from '@/components/Workflows.vue';

const nodesStore = useNodesStore();
</script>

<template>
  <main>
    <Workflows />

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
