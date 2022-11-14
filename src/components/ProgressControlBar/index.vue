<template>
    <div ref="progressBar" :class="`control_bar ${horizental ? `horizental` : `vertical`}`" @click="seekBar">
        <div class="control_bar_bg" v-if="isTime" :style="{[horizental ? 'width' : 'height']: `${audioBuffered}%`}"></div>
        <div class="control_bar_progress" :style="{[horizental ? 'width' : 'height']: `${progress}%`, backgroundColor: progressColor}">
            <div class="control_bar_dot" ref="dot" @mousedown="dragDot" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
                <el-icon v-if="props.isTime" v-show="audioLoading"><IconEpLoading /></el-icon>
            </div>
        </div>
    </div>
</template>

<style lang="less" setup>

.control_bar {
    .progressBar(@color) {
        border-radius: 6px;
        background-color: @color;
    }
    &.horizental {
        cursor: pointer;
        position: relative;
        height: 100%;
        .progressBar(var(--el-color-info-light-8));
        z-index: 1;
        .control_bar_progress {
            position: absolute;
            top: 0;
            left: 0;
            .progressBar(var(--el-color-danger-light-5));
            height: 100%;
            z-index: 3;
            
        }
        .control_bar_bg {
            .progressBar(var(--el-color-info-light-5));
            width: 0%;
            height: 100%;
            z-index: 2;
        }
        .control_bar_dot {
            box-sizing: border-box;
            display: flex;
            position: absolute;
            top: -4px;
            right: -10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid var(--el-color-info);
            background-color: var(--el-color-info-light-9);
            z-index: 4;
            cursor: pointer;
            i {
                animation: rotate360 linear 2s infinite;
            }
            &:hover {
                border: 2px solid var(--el-color-info-dark-2);
            }
        }
        
    }
    &.vertical {
        position: relative;    
        width: 8px;
        height: 100px;
        margin: 10px 0;
        .progressBar(var(--el-color-info-light-8));
        transform: rotateZ(180deg);
        cursor: pointer;
        .control_bar_progress {
            position: relative;
            width: 100%;
            height: 0%;
            .progressBar(var(--el-color-danger-light-5));
        }
        .control_bar_dot {
            box-sizing: border-box;
            position: absolute;
            bottom: -8px;
            right: -4px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid var(--el-color-info);
            background-color: var(--el-color-info-light-9);
            z-index: 4;
            &:hover {
                border: 2px solid var(--el-color-info-dark-2);
            }
        }
    }
}
@keyframes rotate360 {
    0% {
        transform: rotateZ(0deg);
    }
    50% {
        transform: rotateZ(180deg);
    }
    100% {
        transform: rotateZ(360deg);
    }
}
</style>

<script lang="ts" setup>
import { usePlayerStore, useAudioContorlStore } from '@/store';
import { isMobile } from 'is-mobile';

const props = withDefaults(defineProps<{
    isTime?: boolean
    horizental?: boolean
    progressColor?: string
}>(), {
    isTime: true,
    horizental: true,
    progressColor: 'var(--el-color-danger-light-5)'
});
const playerStore = usePlayerStore();
const { audio, audioInfo } = storeToRefs(playerStore);
const audioControlStroe = useAudioContorlStore();
const { audioLoading, audioVolume, audioCurrentTimeStr, audioBuffered } = storeToRefs(audioControlStroe);

const touchStartPosition = ref<DOMRect>();

const mobile = ref(isMobile());

const progressBar = ref<HTMLDivElement>();
const dot = ref<HTMLDivElement>();

const backProgress = ref(0);
const progress = ref(props.isTime ? 0 : 70);


watch(audioVolume, (val) => {
    if (!props.isTime) {
        progress.value = Number(val * 100);
    }
}, { immediate: true })
watch(audioCurrentTimeStr, () => {
    if (props.isTime && audio.value) {
        progress.value = Number(((audio.value.currentTime / (audio.value.duration)) * 100).toFixed(2));
    }
}, { immediate: true })
watch(progress, val => {
    // 进度条与音量同时改变
    if (!props.isTime && audio.value) {
        audio.value.volume = val / 100;
    }
})
watch(audioInfo, () => {
    if (props.isTime) {
        progress.value = 0;
    }
})


// path 属性是 chrome 独有的, composedPath 是官方标准
/** 点击音频进度条跳转 */
function seekBar(e: MouseEvent) {
    // console.log(e.composedPath())
    // 点到加载的dot, 判断offsetX会有问题
    if (e.composedPath().includes(dot.value as EventTarget)) {
        return;
    }
    if (props.horizental) {
        seekHorizental(e);
    }
    else {
        seekVertical(e);
    }
}
/** 点击进度条调整当前播放进度 */
function seekHorizental(e: MouseEvent) {
    if (progressBar.value && audio.value) {
        let clickX = e.offsetX;
        let totalWidth = progressBar.value.offsetWidth;
        let pre = Math.round(clickX / totalWidth * 100);
        if (props.isTime) {
            audio.value.currentTime = pre / 100 * (audioInfo.value.duration / 1000);
        }
        else {
            audio.value.volume = pre / 100;
        }
    }
}
/** 点击音量条调整音量 */
function seekVertical(e: MouseEvent) {
    // console.log(e)
    if ((e.target as HTMLElement).children.length < 1) return;
    if (progressBar.value && audio.value) {
        let clickY = e.offsetY;
        let totalHeight = progressBar.value.offsetHeight;
        let pre = Math.round(clickY / totalHeight * 100);
        if (props.isTime) {
            audio.value.currentTime = pre / 100 * (audioInfo.value.duration / 1000);
        }
        else {
            audio.value.volume = pre / 100;
        }
    }
}
/** 拖拽 */
function dragDot(e: MouseEvent | TouchEvent) {
    // console.log(e)
    if (!progressBar.value) return;
    let positionInfo: DOMRect = progressBar.value.getBoundingClientRect();

    mobile.value = isMobile();

    let eventHandle = computedMove.bind(undefined, positionInfo);
    let removeEventHandle = () => {
        document.removeEventListener('mousemove', eventHandle);
        document.removeEventListener('mouseup', removeEventHandle);
        if (audio.value) {
            if (props.isTime) {
                audio.value.currentTime = audio.value.duration * (progress.value / 100);
            }
        }
    }
    document.addEventListener('mousemove', eventHandle);
    document.addEventListener('mouseup', removeEventHandle);
}
/** 移动端拖拽开始 */
function touchStart(e: TouchEvent) {
    if (!progressBar.value) return;
    touchStartPosition.value = progressBar.value.getBoundingClientRect();
    mobile.value = isMobile();
}
/** 移动端拖拽中 */
function touchMove(e: TouchEvent) {
    if (!touchStartPosition.value) return;
    computedMove(touchStartPosition.value, e);
}
/** 移动端拖拽结束 */
function touchEnd(e: TouchEvent) {
    if (audio.value) {
        if (props.isTime) {
            audio.value.currentTime = audio.value.duration * (progress.value / 100);
        }
    }
}
/** 计算移动百分比 */
function computedMove({ x, width, y, height }: DOMRect, e: MouseEvent | TouchEvent) {
    let moveX: number, moveY: number;

    if (mobile.value) {
        moveX = (e as TouchEvent).targetTouches[0].clientX;
        moveY = (e as TouchEvent).targetTouches[0].clientY;
    }
    else {
        moveX = (e as MouseEvent).clientX;
        moveY = (e as MouseEvent).clientY;
    }
    if (props.horizental) {
        let maxX = x + width;
        if (moveX < x) {
            progress.value = 0;
            return;
        }
        if (moveX > maxX) {
            progress.value = 100;
            return;
        }

        let nowX = moveX - x;
        progress.value = Math.floor(nowX / width * 10000) / 100;
    }
    else {
        let maxY = y + height;
        if (moveY < y) {
            progress.value = 100;
            audio.value && (audio.value.volume = 1);
            return;
        }
        if (moveY > maxY) {
            progress.value = 0;
            audio.value && (audio.value.volume = 0);
            return;
        }

        let nowY = moveY - y;
        if(audio.value) {
            let pre = Number((1 - nowY / height).toFixed(2));
            progress.value = pre * 100;
        }
    }
}


</script>

