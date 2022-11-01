<template>
    <div ref="progressBar" :class="`control_bar ${isTime ? `time` : `volume`}`" @click="seekBar">
        <div class="control_bar_bg" v-if="isTime" :style="{[isTime ? 'width' : 'height']: `${backProgress}%`}"></div>
        <div class="control_bar_progress" :style="{[isTime ? 'width' : 'height']: `${progress}%`}">
            <div class="control_bar_dot" @mousedown="dragDot">
                <el-icon v-show="props.loading"><Loading /></el-icon>
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
    &.time {
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
            &::before {
                content: '';
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
                &:hover {
                    border: 2px solid var(--el-color-info-dark-2);
                }
            }
        }
        .control_bar_bg {
            .progressBar(var(--el-color-info-light-3));
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
    &.volume {
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
import { ref, watch } from 'vue';
import { usePlayerStore } from '@/store/player';
import { storeToRefs } from 'pinia';

const props = withDefaults(defineProps<{
    loading: boolean
    isTime: boolean
}>(), {
    loading: false,
    isTime: true
});
const playerStore = usePlayerStore();
const { audio, audioInfo } = storeToRefs(playerStore);

const progressBar = ref<HTMLDivElement>();

const backProgress = ref(0);
const progress = ref(props.isTime ? 0 : 70);

watch(() => props.isTime, () => {
    if (props.isTime && audio.value) {
        audio.value.addEventListener('timeupdate', function() {
            progress.value = Number(((this.currentTime / this.duration) * 100).toFixed(2));
        })
    }
}, { immediate: true })
/** 初始值 */
watch(audio, (val) => {
    if (val) {
        if (!props.isTime) {
            progress.value = 70;
            val.volume = progress.value / 100;
        }
        else {
            progress.value = 0;
        }
    }
});


// path 属性是 chrome 独有的, composedPath 是官方标准
/** 点击音频进度条跳转 */
function seekBar(e: MouseEvent) {
    // console.log(e.composedPath())
    // 点到加载的dot, 判断offsetX会有问题
    if (e.composedPath().length > 11) {
        return;
    }
    if (props.isTime) {
        seekTime(e);
    }
    else {
        seekVolume(e);
    }
}
/** 点击进度条调整当前播放进度 */
function seekTime(e: MouseEvent) {
    if (progressBar.value && audio.value) {
        let clickX = e.offsetX;
        let totalWidth = progressBar.value.offsetWidth;
        let pre = Math.round(clickX / totalWidth * 100);
        progress.value = pre;
        audio.value.currentTime = pre / 100 * (audioInfo.value.duration / 1000);
    }
}
/** 点击音量条调整音量 */
function seekVolume(e: MouseEvent) {
    // console.log(e)
    if ((e.target as HTMLElement).children.length < 1) return;
    if (progressBar.value && audio.value) {
        let clickY = e.offsetY;
        let totalHeight = progressBar.value.offsetHeight;
        let pre = Math.round(clickY / totalHeight * 100);
        progress.value = pre;
        audio.value.volume = pre / 100;
    }
}
/** 拖拽 */
function dragDot(e: MouseEvent) {
    // console.log(e)
    if (!progressBar.value) return;
    let positionInfo: DOMRect = progressBar.value.getBoundingClientRect();
    
    let eventHandle = computedMove.bind(undefined, positionInfo);
    let removeEventHandle = () => {
        document.removeEventListener('mousemove', eventHandle);
        document.removeEventListener('mouseup', removeEventHandle);
        if (audio.value) {
            if (props.isTime) audio.value.currentTime = audio.value.duration * (progress.value / 100);
        }
    }
    document.addEventListener('mousemove', eventHandle);
    document.addEventListener('mouseup', removeEventHandle);

    
    function computedMove({ x, width, y, height }: DOMRect, e: MouseEvent) {
        let { clientX: moveX, clientY: moveY } = e;
        if (props.isTime) {
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
                console.log(1 - nowY /height)
                let pre = Number((1 - nowY / height).toFixed(2));
                progress.value = pre * 100;
                audio.value.volume = pre;
            }
        }
    }

}
</script>

