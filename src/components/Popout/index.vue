<template>
    <div class="pop" v-show="show" ref="pop" :style="popoutPosition">
        <slot class="pop_item"></slot>
    </div>
</template>

<style lang="less" scoped>
.pop {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: absolute;
    width: 240px;
    padding: 20px 0;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-color-white);
    z-index: 11;
}

</style>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';


export interface PopoutPosition {
    top: number | string
    left: number | string
    bottom?: number | string
    right?: number | string
}
const props = defineProps<{
    show: boolean
    position: PopoutPosition
}>();
const emit = defineEmits<{
    (event: 'close'): void
}>();

const pop = ref<HTMLDivElement>();


watch(() => props.show, () => {
    if (props.show) {
        document.addEventListener('click', closePopout);
    }
    else {
        document.removeEventListener('click', closePopout);
    }
});
watch(() => props.position, (val) => {
    // 使用 nextTick 获取 pop 的宽度和高度
    nextTick(() => {
        if (!pop.value) {
            return;
        }
        const { clientWidth, clientHeight } = pop.value;
        // 保证页面不能 x 轴滚动, 使用 body 的宽度判断, window.innerWidth 会包括滚动条宽度, 有误差
        const { clientWidth: totalWidth,  } = document.body;
        // 使用视口高度进行判断
        const { innerHeight: totalHeight, scrollY } = window;
        let position: PopoutPosition = {
            ...val
        }
        
        if (typeof position.left !== 'number') {
            position.left = Number(position.left.split('px')[0]);
            if (isNaN(position.left)) return;
        }
        if (typeof position.top !== 'number') {
            position.top = Number(position.top.split('px')[0]);
            if (isNaN(position.top)) return;
        }
        position.left += 10;
        position.top += 20;
        // 超出视口跳转回来
        if (position.left + clientWidth > totalWidth) {
            position.right = `${totalWidth - position.left + 20}px`;
            position.left = 'auto';
        }
        if (position.top + clientHeight > scrollY + totalHeight) {
            position.top = `${position.top - clientHeight - 20}px`;
        }
        // console.log(position)
        // 保证最后是字符串 px 
        if (!isNaN(Number(position.top))) position.top = `${position.top}px`;
        if (!isNaN(Number(position.left))) position.left = `${position.left}px`;
        popoutPosition.value = position;
    })
}, { deep: true });

const popoutPosition = ref<PopoutPosition>({
    left: 0,
    top: 0
});
/** 关闭弹窗 */
function closePopout() {
    emit('close');
}

</script>

