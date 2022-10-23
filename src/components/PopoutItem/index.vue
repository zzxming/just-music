<template>
    <div :class="`pop_item ${botBorder ? 'border-bot' : ''}`">
        <slot></slot>
    </div>
</template>

<style lang="less" scoped>
.pop {
    &_item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        font-size: 14px;
        cursor: default;
        &:hover {
            background-color: var(--el-color-info-light-8);
        }
        &.border-bot {
            border-bottom: 1px solid var(--el-color-info-light-8);
        }
    }
}
</style>

<script lang="ts" setup>

const { botBorder } = defineProps({
    botBorder: {
        type: Boolean,
        default: false
    }
});

</script>
