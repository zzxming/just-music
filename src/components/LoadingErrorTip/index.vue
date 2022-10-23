<template>
    <div v-show="isError" class="error" :style="style">
        网络错误, 点击<span class="error_retry" @click="requestFunc">重试</span>
    </div>
</template>

<style lang="less" scoped>
.error {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 40px 0;
    &_retry {
        color: var(--el-color-primary);
        cursor: pointer;
        &:hover {
            color: var(--el-color-primary-dark-2);
        }
    }
}
</style>


<script lang="ts" setup>
import { StyleValue } from 'vue'


const { isError, requestFunc, style } = defineProps<{
    isError: boolean
    style?: StyleValue
    requestFunc: (...args: any) => any
}>()
</script>