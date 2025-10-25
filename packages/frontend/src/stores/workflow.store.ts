import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { createNewWorkflow, getWorkflows as gwf, getWorkFlowById, type WorkFlow, type WorkFlowDetail } from '../services/api'


export const useWorkflowStore = defineStore('workflow', () => {

    const workflows = ref<WorkFlow[]>([])
    const isLoaded = ref(false);
    const currentWorkFlow = ref<WorkFlowDetail | null>(null);


    function getWorkflows() {
        gwf().then((data) => {
            workflows.value = data;
            isLoaded.value = true;
        });
    }

    function setCurrentWorkFlow(id: string) {
        currentWorkFlow.value = null;
        return getWorkFlowById(id).then((data) => {
            currentWorkFlow.value = data;
            // return currentWorkFlow.value;
        });
    }

    function createWorkflow() {
        createNewWorkflow().then((workflow) => {
            workflows.value.push(workflow);
        });
    }


    return {
        workflows,
        getWorkflows,
        createWorkflow,
        setCurrentWorkFlow,
        currentWorkFlow,
        isLoaded,
    }
})