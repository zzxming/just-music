<template>
    <el-button plain class="back" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
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
import { useRouteHistory } from '@/hooks';

const { goBack } = useRouteHistory();



</script>


