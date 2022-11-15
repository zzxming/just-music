<template>
    <div v-show="fullScreenMaskState" class="mask" @click="maskClick"></div>
</template>

<style lang="less" scoped>
.mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2000;
    background-color: var(--el-mask-color-extra-light);
}
</style>

<!-- 安卓模拟器无法显示此mask -->

<script lang="ts" setup>
import { useComponentStateStore } from '@/store';

const componentStateStore = useComponentStateStore();
const { fullScreenMaskState } = storeToRefs(componentStateStore);
const { changFullScreenMaskState } = componentStateStore;


function maskClick() {
    changFullScreenMaskState(false)
}
</script>
