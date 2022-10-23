<template>
    <div :class="`input ${focusInput ? 'is-focus' : ''}`">
        <span class="input_icon" @click="submitInput">
            <el-icon><Search /></el-icon>
        </span>
        <el-input class="input_input" 
            v-model="input" 
            :placeholder="placeholder" 
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
}
.input :deep(.el-input__wrapper.is-focus) {
    box-shadow: none;
}

</style>

<script lang="ts" setup>
import { ref, watch, toRefs } from 'vue';


const props = defineProps({
    placeholder: {
        type: String,
        required: false,
        default: '',
        validator(value) {
            return typeof value === 'string';
        }
    },
    // input 初始值
    inputTxt: {
        type: String,
        required: false,
        default: () => '',
        validator(value) {
            return typeof value=== 'string';
        }
    }
});
const emit = defineEmits<{
    (event: 'submit', input: string): void
}>();

const { inputTxt, placeholder } = toRefs(props);
const input = ref(inputTxt.value);
const focusInput = ref(false);

/** 通过 props 传递 input 初始值更新 */
watch(inputTxt, (val) => {
    // console.log(inputTxt.value)
    input.value = val;
}, {
    deep: true
});

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
    console.log('submit input', input.value)
    emit('submit', input.value);
}

</script>

