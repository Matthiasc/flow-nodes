<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useNodeTypesStore } from './stores/nodeTypes.store';
import { useNodesStore } from './stores/nodes.store';
import { useWorkflowStore } from './stores/workflow.store';
// const nodesStore = useNodesStore();
const workflowStore = useWorkflowStore();
const nodeTypesStore = useNodeTypesStore();
const allLoaded = computed(() => nodeTypesStore.isLoaded && workflowStore.isLoaded);

// Load data on app initialization
nodeTypesStore.loadTypes();
workflowStore.getWorkflows();

</script>

<template>
  <div v-if="!allLoaded">Loading...</div>

  <div v-else>
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/workflow/444">Workflow</RouterLink>
        <!-- <RouterLink to="/about">About</RouterLink> -->
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped></style>
