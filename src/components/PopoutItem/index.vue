<template>
    <div class="pop_item" @click="(e) => emit('click', e)">
        <slot></slot>
    </div>
    <div v-if="botBorder" class="border-bot"></div>
</template>

<style lang="less" scoped>
.pop {
    &_item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        padding: 4px 10px;
        font-size: 14px;
        cursor: default;
        &:hover {
            background-color: var(--el-color-info-light-8);
        }
    }
}
.border-bot {
    width: 100%;
    height: 1px;
    background-color: var(--el-color-info-light-8);
}
</style>

<script lang="ts" setup>

const { botBorder } = defineProps({
    botBorder: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

</script>
