<template>
    <div ref="progressBar" :class="`control_bar ${horizental ? `horizental` : `vertical`} ${props.isTime && !canSeek ? 'disable' : ''}`" @click="seekBar">
        <div class="control_bar_bg" v-if="isTime" :style="{[horizental ? 'width' : 'height']: `${audioBuffered}%`}"></div>
        <div class="control_bar_progress" :style="{[horizental ? 'width' : 'height']: `${progress}%`, backgroundColor: progressColor}">
            <div class="control_bar_dot" ref="dot" 
                @mousedown="dragDot" 
                @touchstart="touchStart" 
                @touchmove="touchMove" 
                @touchend="touchEnd"
            >
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
    &.disable {
        cursor: not-allowed;
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
import { AudioInfoType } from '@/interface';
import { getAduioLoadMode, localStorageAudioLoadModeEvent } from '@/utils/localStorage';
import { isMobile } from 'is-mobile';
import { ElMessage } from 'element-plus';

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
const userAgent = navigator.userAgent.toLocaleLowerCase();
const isIPhone = userAgent.includes('iphone') && userAgent.includes('safari');

const progressBar = ref<HTMLDivElement>();
const dot = ref<HTMLDivElement>();

const progress = ref(props.isTime ? 0 : 70);
const progressLock = ref(false);    // 不自动改变时间进度条
const audioLoadMode = ref(getAduioLoadMode());

onMounted(() => {
    if (props.isTime) {
        window.addEventListener(localStorageAudioLoadModeEvent, () => {
            audioLoadMode.value = getAduioLoadMode();
        })
    }
})
watch(audioVolume, (val) => {
    if (!props.isTime) {
        progress.value = Number(val * 100);
    }
}, { immediate: true })
watch(audioCurrentTimeStr, () => {
    if (props.isTime && audio.value) {
        if (progressLock.value) return;
        progress.value = Number(((audio.value.currentTime / (audioInfo.value.duration / 1000)) * 100).toFixed(2));
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
const canSeek = computed(() => {
    if (audioInfo.value.type !== AudioInfoType.bili) return true;
    return (audioLoadMode.value === '0' && isIPhone)
})

// path 属性是 chrome 独有的, composedPath 是官方标准
/** 点击音频进度条跳转 */
function seekBar(e: MouseEvent) {
    // console.log(e.composedPath())
    // 点到加载的dot, 判断offsetX会有问题
    if (props.isTime && !canSeek.value) {
        ElMessage({
            type: 'warning',
            message: '快速加载模式下iPhone用户无法手动调整哔哩哔哩歌曲播放进度'
        })
        return;
    }
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
/** 点击横向进度条调整 */
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
/** 点击竖向音量条调整 */
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
function dragDot() {
    // console.log(e)
    if (props.isTime && !canSeek.value) return;
    if (!progressBar.value) return;
    progressLock.value = true;

    let positionInfo: DOMRect = progressBar.value.getBoundingClientRect();

    let eventHandle = computedMove.bind(undefined, positionInfo);
    let removeEventHandle = () => {
        document.removeEventListener('mousemove', eventHandle);
        document.removeEventListener('mouseup', removeEventHandle);
        if (audio.value) {
            if (props.isTime) {
                audio.value.currentTime = audioInfo.value.duration / 1000 * (progress.value / 100);
            }
            progressLock.value = false;
        }
    }
    document.addEventListener('mousemove', eventHandle);
    document.addEventListener('mouseup', removeEventHandle);
}
/** 移动端拖拽开始 */
function touchStart() {
    if (props.isTime && !canSeek.value) return;
    if (!progressBar.value) return;
    touchStartPosition.value = progressBar.value.getBoundingClientRect();
    progressLock.value = true;
}
/** 移动端拖拽中 */
function touchMove(e: TouchEvent) {
    if (props.isTime && !canSeek.value) return;
    if (!touchStartPosition.value) return;
    computedMove(touchStartPosition.value, e);
}
/** 移动端拖拽结束 */
function touchEnd() {
    if (props.isTime && !canSeek.value) return;
    if (audio.value) {
        if (props.isTime) {
            audio.value.currentTime = audioInfo.value.duration / 1000 * (progress.value / 100);
        }
        progressLock.value = false;
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

