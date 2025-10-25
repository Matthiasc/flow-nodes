<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { useNodeTypesStore } from './stores/nodeTypes.store';
import { useNodesStore } from './stores/nodes.store';
// const nodesStore = useNodesStore();
const nodeTypesStore = useNodeTypesStore();
const allLoaded = computed(() => nodeTypesStore.isLoaded);

// Load data on app initialization
nodeTypesStore.loadTypes();

</script>

<template>
  <div v-if="!allLoaded">Loading...</div>

  <div v-else>
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped></style>
