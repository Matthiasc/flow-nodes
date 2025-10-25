<script setup lang="ts">
import { useWorkflowStore } from '@/stores/workflow.store';

const workflowStore = useWorkflowStore();

</script>

<template>
    <div class="workflows">
        <ul>
            <li v-for="workflow in workflowStore.workflows" :key="workflow.id">
                <RouterLink :to="`/workflow/${workflow.id}`">{{ workflow.name }}</RouterLink>
            </li>
        </ul>
    </div>
</template>

<style scoped>
ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

li {
    list-style: none;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
}
</style>
