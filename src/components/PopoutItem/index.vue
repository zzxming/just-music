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
@media screen and (max-width: 550px) {
    .pop {
        &_item {
            color: #fff;
            font-size: 20px;
            line-height: 48px;
            &:hover {
                background-color: var(--el-overlay-color-light);
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
// ?????????????????????,?????????px, ?????????????????????????????????
const position = ref<PopoutPosition>({
    left: '200px',
    top: '0px'
});


// ??????????????? Popout ????????????????????????????????? left, ??????????????????
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
            // ?????????????????? x ?????????, ?????? body ???????????????, window.innerWidth ????????????????????????, ?????????
            const { clientWidth: totalWidth,  } = document.body;
            // ??????????????????????????????
            const { innerHeight: totalHeight, scrollY } = window;
            let tempPosition = { 
                left: parseFloat(position.value.left as string),
                top: parseFloat(position.value.top as string),
            }
            // ??????????????????, ???????????????????????????
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
    // ?????????????????????????????????????????????
    if (slot.second && isSmallScreen.value) {
        show.value = !show.value;
        // ???????????????????????????????????????, ????????????????????????????????????
        show.value && e.stopPropagation();
    }
}


</script>
