<template>
    <div v-show="fullScreenMaskState" class="mask" @click="maskClick"></div>
</template>

<style lang="less" scoped>
.mask {
    position: fixed;
    inset: 0;
    z-index: 2001;
    background-color: var(--el-mask-color-extra-light);
}
</style>


<script lang="ts" setup>
import { useComponentStateStore } from '@/store';

const componentStateStore = useComponentStateStore();
const { fullScreenMaskState } = storeToRefs(componentStateStore);
const { changFullScreenMaskState } = componentStateStore;


function maskClick() {
    changFullScreenMaskState(false)
}
</script>
