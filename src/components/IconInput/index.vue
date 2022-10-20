<template>
    <div :class="`input ${focusInput ? 'is-focus' : ''}`">
        <span class="input_icon" @click="submitInput">
            <el-icon><Search /></el-icon>
        </span>
        <el-input class="input_input" v-model="input" :placeholder="placeholder" 
            @focus="focus"
            @blur="blur"
            @keydown.enter="submitInput"
        />
    </div>
</template>


<style lang="less" scoped>
.input {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 11px;
    width: 100%;
    flex-grow: 1;
    background-color: var(--el-input-bg-color,var(--el-fill-color-blank));
    border-radius: var(--el-input-border-radius,var(--el-border-radius-base));
    transition: var(--el-transition-box-shadow);
    box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
    &.is-focus {
        box-shadow: 0 0 2px var(--el-color-danger) inset;
    }
    &_icon {
        display: inline-flex;
        &:hover {
            color: var(--el-color-info);
        }
    }
}
:deep(.el-input__wrapper) {
    width: 100%;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
}
:deep(.el-input__wrapper:hover) {
    box-shadow: none;
    // box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}
.input :deep(.el-input__wrapper.is-focus) {
    box-shadow: none;
    // box-shadow: 0 0 2px var(--el-color-danger) inset;
}

</style>

<script lang="ts" setup>
import { ref } from 'vue';


const { placeholder } = defineProps({
    placeholder: {
        default: ''
    }
});
const emit = defineEmits<{
    (event: 'submit', input: string): void
}>();

const input = ref('');
const focusInput = ref(false);
/** input获得焦点 */
function focus() {
    focusInput.value = true;
}
/** input失去焦点 */
function blur() {
    focusInput.value = false;
}
/** input提交 */
function submitInput() {
    emit('submit', input.value);
}

</script>

