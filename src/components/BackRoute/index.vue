<template>
    <el-button plain class="back" @click="goBack">
        <el-icon><IconEpArrowLeft /></el-icon>
    </el-button>
</template>


<style lang="less" scoped>
.back {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<script lang="ts" setup>
import { useComponentStateStore } from '@/store';

const componentStateStore = useComponentStateStore();
const { goBack } = componentStateStore;


</script>


