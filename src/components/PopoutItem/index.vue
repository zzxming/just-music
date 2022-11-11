<template>
    <div 
        :class="`pop_item ${botBorder ? 'border-bot' : ''} ${topBorder ? 'border-top' : ''}`" 
        @click="clickItem" 
        @mouseenter="() => {
            if (!isSmallScreen) {
                show = true
            }
        }" 
        @mouseleave="() => {
            if (!isSmallScreen) {
                show = false
            }
        }"
    >
        <slot></slot>
        <Popout ref="pop" v-if="slot.second" :show="show" :position="position" :limitPosition="false" @close="show = false">
            <slot name="second"></slot>
        </Popout>
    </div>
</template>

<style lang="less" scoped>
.pop {
    &_item {
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
        line-height: 34px;
        padding: 0 10px;
        background-color: var(--el-color-white);
        font-size: 14px;
        cursor: default;
        &:hover {
            background-color: var(--el-color-info-light-8);
        }
        .borderVertical {
            box-sizing: border-box;
            display: block;
            width: 100%;
            height: 1px;
            background-color: var(--el-color-info-light-7);
        }
        &.border-bot {
            &::after {
                content: '';
                .borderVertical()
            }
        }
        &.border-top {
            &::before {
                content: '';
                .borderVertical()
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { PopoutPosition } from '@/components/Popout/index.vue';
import { useIsSmallScreen } from '@/hooks';

const { botBorder } = defineProps({
    botBorder: {
        type: Boolean,
        default: false
    },
    topBorder: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const isSmallScreen = useIsSmallScreen();

const pop = ref<{pop: HTMLDivElement}>();
const slot = useSlots();

const show = ref(false);
// 必须要传字符串,单位是px, 否则第一次计算会有错误
const position = ref<PopoutPosition>({
    left: '200px',
    top: '0px'
});


// 因为无法在 Popout 组件里面获取对应元素的 left, 无法限制计算
watch(show, () => {
    if (!show.value) {
        position.value = {
            left: '200px',
            top: '0px'
        }
        return;
    }
    nextTick(() => {
        if (pop.value) {
            const { width, height, x, y } = pop.value.pop.getBoundingClientRect();
            // 保证页面不能 x 轴滚动, 使用 body 的宽度判断, window.innerWidth 会包括滚动条宽度, 有误差
            const { clientWidth: totalWidth,  } = document.body;
            // 使用视口高度进行判断
            const { innerHeight: totalHeight, scrollY } = window;
            let tempPosition = { 
                left: parseFloat(position.value.left as string),
                top: parseFloat(position.value.top as string),
            }
            // 加上一点误差, 使二级弹出框能重合
            if (x + width > totalWidth) {
                tempPosition.left = -width + 20;
            }
            if (y + height + scrollY > totalHeight) {
                tempPosition.top = -height + 35;
            }
            position.value = { 
                left: `${tempPosition.left}px`,
                top: `${tempPosition.top}px`,
            }
        }
    })
})

function clickItem(e: MouseEvent) {
    emit('click', e);
    // 小屏且有子节点点击时显示子节点
    if (slot.second && isSmallScreen.value) {
        show.value = !show.value;
        // 如果子节点开启则要停止冒泡, 否则会导致子节点直接关闭
        show.value && e.stopPropagation();
    }
}


</script>
