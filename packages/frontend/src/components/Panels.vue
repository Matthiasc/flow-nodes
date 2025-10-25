<script lang="ts" setup>
import { useUiStore } from '@/stores/ui.store';

const uiStore = useUiStore();

</script>

<template>
    <div class="panels">
        <div class="panel panel_left" :class="{ panel__expanded: uiStore.panelLeftExpanded }">
            <slot name="left" />
        </div>

        <div class="main-wrapper">
            <slot name="main" />

            <div class="panel panel_bottom" :class="{ panel__expanded: uiStore.panelBottomExpanded }">
                <slot name="bottom" />
            </div>
        </div>

        <div class="panel panel_right" :class="{ panel__expanded: uiStore.panelRightExpanded }">
            <slot name="right" />
        </div>
    </div>
</template>

<style scoped>
.panels {
    --panel-sides: 300px;
    --panel-bottom: 300px;

    display: flex;
    flex-direction: row;
    height: 100%;
    /* width: 100%; */
}

.panel {
    position: relative;
    overflow: hidden;
    transition: margin 0.3s ease;

}

.panel_right {
    width: var(--panel-sides);
    border-left: 1px solid #e0e0e0;
    margin-right: calc(-1 * var(--panel-sides));
}

.panel_left {

    border-right: 1px solid #e0e0e0;
    width: var(--panel-sides);
    margin-left: calc(-1 * var(--panel-sides));
}

.panel_bottom {
    height: var(--panel-bottom);
    width: 100%;
    border-top: 1px solid #e0e0e0;
    margin-bottom: calc(-1 * var(--panel-sides));
    position: absolute;
    bottom: 0;
    left: 0;
    background: white;
}

.panel__expanded {
    margin: 0;
    /* width: 400px; */
}

.main-wrapper {
    flex: 1;
    position: relative;
}
</style>