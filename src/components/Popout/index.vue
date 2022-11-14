<template>
    <div class="pop" v-show="show" ref="pop" :style="{...popoutPosition, position: isSmallScreen ? 'fixed' : 'absolute'}">
        <slot class="pop_item"></slot>
    </div>
</template>

<style lang="less" scoped>
.pop {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: absolute;
    width: 240px;
    max-height: 60vh;
    padding: 10px 0;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    background-color: var(--el-color-white);
    // elementplus 的 drawer 的 z-index 是 2004
    // PlaylistDrawer 的 z-index 2001
    z-index: 2003;
    &::-webkit-scrollbar {
        width: 6px;
        border-radius: 6px;
        overflow: hidden;
        background-color: var(--el-bg-color-page);
    }
    &::-webkit-scrollbar-button {
        display: none;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: var(--el-color-info-light-3);
    }
}
@media screen and (max-width: 550px) {
    .pop {
        width: 100%;
        background-color: var(--el-text-color-primary);
        overflow: auto;
    }
} 

</style>

<script lang="ts" setup>
import { useIsSmallScreen } from '@/hooks';


export interface PopoutPosition {
    top: number | string
    left: number | string
    bottom?: number | string
    right?: number | string
}
const props = withDefaults(
    defineProps<{
        show: boolean
        position: PopoutPosition,
        limitPosition?: boolean
    }>(), {
        limitPosition: true
    }
);
const emit = defineEmits<{
    (event: 'close'): void
}>();

const isSmallScreen = useIsSmallScreen();

const { show, position, limitPosition } = toRefs(props);
const pop = ref<HTMLDivElement>();
const popoutPosition = ref<PopoutPosition>(props.position);

defineExpose({
    pop
});
/** 点击其他地方关闭 popout */
watch(() => props.show, (val) => {
    if (val) {
        document.addEventListener('click', closePopout);
    }
    else {
        document.removeEventListener('click', closePopout);
    }
});
/** 防止 popout 超时视口 */
watch(() => props.position, (val) => {
    if (isSmallScreen.value) {
        popoutPosition.value = {
            left: 0,
            top: 'auto',
            bottom: '10px'
        }
        return;
    }
    if (!limitPosition.value){
        popoutPosition.value = { ...val }
        return;
    }
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
        
        // console.log(clientHeight, clientWidth)
        // console.log(totalWidth, totalHeight, scrollY)
        let tempPosition = {...position.value}
        if (typeof tempPosition.left !== 'number') {
            tempPosition.left = parseFloat(tempPosition.left);
            if (isNaN(tempPosition.left)) return;
        }
        if (typeof tempPosition.top !== 'number') {
            tempPosition.top = parseFloat(tempPosition.top);
            if (isNaN(tempPosition.top)) return;
        }

        tempPosition.left += 10;
        tempPosition.top += 20;
        // 超出视口跳转回来
        if (tempPosition.left + clientWidth > totalWidth) {
            tempPosition.right = `${totalWidth - tempPosition.left + 20}px`;
            tempPosition.left = 'auto';
        }
        if (tempPosition.top + clientHeight > scrollY + totalHeight) {
            tempPosition.top = `${tempPosition.top - clientHeight - 20}px`;
        }
        // console.log(props.tempPosition)
        // console.log(tempPosition)
        // 保证最后是字符串 px 
        if (!isNaN(Number(tempPosition.top))) tempPosition.top = `${tempPosition.top}px`;
        if (!isNaN(Number(tempPosition.left))) tempPosition.left = `${tempPosition.left}px`;
        popoutPosition.value = tempPosition;
    })
}, { deep: true, immediate: true });



/** 关闭弹窗 */
function closePopout() {
    emit('close');
}

</script>

