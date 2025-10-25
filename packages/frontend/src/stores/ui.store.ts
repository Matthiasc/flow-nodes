import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type Panels = 'left' | 'right' | 'bottom' | 'all';


export const useUiStore = defineStore('ui', () => {

    const panelLeftExpanded = ref(true);
    const panelRightExpanded = ref(false);
    const panelBottomExpanded = ref(true);

    function collapsePanels(type: Panels | Panels[]) {
        if (!Array.isArray(type)) type = [type];

        if (type.includes('all') || type.includes('left')) {
            panelLeftExpanded.value = false;
        }
        if (type.includes('all') || type.includes('right')) {
            panelRightExpanded.value = false;
        }
        if (type.includes('all') || type.includes('bottom')) {
            panelBottomExpanded.value = false;
        }

    }

    function togglePanels() {
        const toggle = !panelLeftExpanded.value;
        panelLeftExpanded.value = toggle;
        panelRightExpanded.value = toggle;
        panelBottomExpanded.value = toggle;
    }

    return {
        collapsePanels,
        togglePanels,
        panelLeftExpanded,
        panelRightExpanded,
        panelBottomExpanded,
    }
})