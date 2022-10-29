
<template>
    <div v-if="audio" v-show="showPlayerControl" class="botcontrol">
        <div class="botcontrol_left">
            <el-icon class="botcontrol_btn-icon skipback" @click="playPre"><Skipback /></el-icon>
            <div class="botcontrol_btn_play" @click="playAudio">
                <el-icon class="botcontrol_btn-icon play" v-show="audioIsPaused"><Play /></el-icon>
                <el-icon class="botcontrol_btn-icon pause" v-show="!audioIsPaused"><Pause /></el-icon>
            </div>
            <el-icon class="botcontrol_btn-icon skipforward" @click="() => playNext(false)"><Skipforward /></el-icon>
        </div>
        <div class="botcontrol_info">
            <div class="botcontrol_info_cover">
                <img class="botcontrol_info_cover-img" :src="audioInfo.cover === '' ? musicImg : audioInfo.cover" @error.once="onErrorImg" />
            </div>
            <div class="botcontrol_info_mid">
                <div class="botcontrol_info_title">
                    <span class="botcontrol_info_song" :title="audioInfo.title">{{audioInfo.title}}</span>
                    <span class="botcontrol_info_singer" :title="audioInfo.singers.map(s => s.name).join(' / ')">
                        <template v-for="(singer, index) in audioInfo.singers">
                            <span class="botcontrol_info_singer-name">{{singer.name}}</span>
                            {{ index === audioInfo.singers.length - 1 ? '' : ' / ' }}
                        </template>
                    </span>
                </div>
                <div class="botcontrol_info_bar-time">
                    <div ref="audioTimeBar" class="botcontrol_time_bar" @click="seekAudio">
                        <div class="botcontrol_time_bar_bg" :style="{width: `${bufferedWidth}%`}"></div>
                        <div class="botcontrol_time_bar_progress" :style="{width: `${currentdWidth}%`}">
                            <div class="botcontrol_time_bar_dot">
                                <el-icon v-show="audioLoading"><Loading /></el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="botcontrol_info_time">
                <span class="botcontrol_info_time-current">{{audioCurrentTimeStr}}</span>
                <span class="botcontrol_info_time-duration"> / {{audioDuration}}</span>
            </div>
        </div>
        <div class="botcontrol_right">
            <AudioPlayType class="botcontrol_btn-icon" />
            <div class="botcontrol_btn_play" @click="playAudio">
                <el-icon class="botcontrol_btn-icon play" v-show="audio.paused"><Play /></el-icon>
                <el-icon class="botcontrol_btn-icon pause" v-show="!audio.paused"><Pause /></el-icon>    
            </div>
            <div class="botcontrol_btn_volume">
                <el-icon class="botcontrol_btn-icon volume" v-show="audio.volume !== 0" @click="mutedAudio"><Volume /></el-icon>
                <el-icon class="botcontrol_btn-icon mute" v-show="audio.volume === 0" @click="mutedAudio"><Volume_mute /></el-icon>
                <div class="botcontrol_volume_bar">
                    <div ref="audioVolumeBar" class="botcontrol_volume_bar_inner" @click="seekVolume">
                        <div class="botcontrol_volume_bar_progress" :style="{height: `${volumeHeight}%`}"></div>
                    </div>
                </div>
            </div>
            <el-icon class="botcontrol_btn-icon list" @click="activatePlayinglistState"><Expand /></el-icon>
        </div>
    </div>
    <Playinglist :active="activePlayinglist" @close="deactivatePlayinglistState" />
</template>

<style lang="less" scoped>
.textOverflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.botcontrol {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: var(--el-fill-color-blank);
    box-shadow: var(--el-box-shadow-dark);
    transition: bottom .3s linear;
    z-index: 10;
    &_left {
        display: flex;
        align-items: center;
    }
    &_right {
        display: flex;
        align-items: center;
        .botcontrol_btn_play {
            display: none;
            width: 30px;
            height: 30px;
            margin: 0 5px;
            .botcontrol_btn-icon {
                margin: 0;
            }
            .play,
            .pause {
                font-size: 30px;
            }
        }
    }
    &_btn {
        &_play {
            width: 60px;
            height: 50px;
        }
        &_volume {
            position: relative;
            width: 40px;
            height: 30px;
            &:hover {
                .botcontrol_volume_bar {
                    display: flex;
                }
            }
            // 使用伪元素让图标移动到音量条之间的缝隙填满,使hover可以移动过去
            &::after {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                top: -6px;
                width: 100%;
                height: 10px;
            }
        }
        &-icon {
            cursor: pointer;
            font-size: 30px;
            fill: var(--el-text-color-regular);
            margin: 0 5px;
            &:hover {
                fill: var(--el-text-color-primary);
            }
            &.play,
            &.pause {
                font-size: 50px;
            }
        }
    }
    .progressBar(@color) {
        border-radius: 6px;
        background-color: @color;
    }
    &_time {
        &_bar {
            cursor: pointer;
            position: relative;
            height: 100%;
            .progressBar(var(--el-color-info-light-8));
            z-index: 1;
            &_progress {
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
            &_bg {
                .progressBar(var(--el-color-info-light-3));
                width: 0%;
                height: 100%;
                z-index: 2;
            }
            &_dot {
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
    }
    &_info {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 70%;
        height: 100%;
        &_mid {
            display: flex;
            flex-direction: column;
            flex: 1;    
            max-width: 70%;
            margin: 0 20px;
        }
        &_cover {
            width: 60px;
            min-width: 60px;
            height: 60px;
            margin: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            border-radius: 8px;
            overflow: hidden;
            &-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
        &_title {
            .textOverflowEllipsis();
            height: 48px;
            display: grid;
            align-items: center;
            justify-content: flex-start;
            flex: 1 1 auto;
            grid-template-columns: auto 1fr;
            grid-template-areas: 'song singer';
        }
        &_song {
            .textOverflowEllipsis();
            grid-area: song;
            margin-right: 10px;
        }
        &_singer {
            .textOverflowEllipsis();
            grid-area: singer;
            color: var(--el-color-danger-light-5);
            &-name {
                &:hover {
                    color: var(--el-color-danger);
                }
            }
        }
        &_bar {
            &-time {
                .progressBar(transparent);
                height: 12px;
            }
        }
        &_time {
            min-width: 100px;
            font-size: 14px;
            color: var(--el-color-info);
            user-select: none;
            &-current {
                color: var(--el-text-color-primary);
            }
        }
    }
    &_volume {
        &_bar {
            display: none;
            align-items: center;
            justify-content: center;
            position: relative;
            bottom: 140px;
            width: 100%;
            height: 100px;
            .progressBar(var(--el-fill-color-blank));
            box-shadow: var(--el-box-shadow-light);
            z-index: 1;
            &_inner {
                position: relative;    
                width: 8px;
                height: 80%;
                .progressBar(var(--el-color-info-light-8));
                transform: rotateZ(180deg);
                cursor: pointer;
            }
            &_progress {
                position: relative;
                width: 100%;
                height: 0%;
                .progressBar(var(--el-color-danger-light-5));
                &::before {
                    content: '';
                    box-sizing: border-box;
                    display: flex;
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
@media screen and (max-width: 810px) {
    .botcontrol {
        justify-content: center;
        &_left {
            display: none;
        }
        &_right {
            .botcontrol_btn_play {
                display: block;
                font-size: 30px;
            }
        }
        &_info {
            margin-left: 14px;
            &_cover {
                width: 50px;
                height: 50px;
                min-width: 50px;
            }
            &_time {
                display: none;
            }
        }
        &_btn {
            &_volume {
                display: none;
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { usePlayerStore } from '@/store/player';
import { usePlaylistStore } from '@/store/playinglist';
import { formatAudioTime } from '@/utils';
import { PlayMode } from '@/interface';
import { defaultMusicImg } from '@/assets/api';
import Volume from '@/assets/iconfont/volume.vue';
import Pause from '@/assets/iconfont/pause.vue';
import Play from '@/assets/iconfont/play.vue';
import Skipback from '@/assets/iconfont/skipback.vue';
import Skipforward from '@/assets/iconfont/skipforward.vue';
import Volume_mute from '@/assets/iconfont/volume_mute.vue';
import AudioPlayType from '@/components/AudioPlayType/index.vue';
import Playinglist from '@/components/Playinglist/index.vue';

const musicImg = ref(defaultMusicImg);

const playerStore = usePlayerStore();
const playlistStore = usePlaylistStore();
const { audio, audioSrc, showPlayerControl, audioInfo, curPlayMode } = storeToRefs(playerStore);
const { setAudioInfo, resetAudioInfo } = playerStore;
const { playinglist } = playlistStore;
const { findPreMusic, findNextMusic } = playlistStore;

const audioTimeBar = ref<HTMLDivElement>();
const audioVolumeBar = ref<HTMLDivElement>();

const bufferedWidth = ref(0);
const currentdWidth = ref(0);
const volumeHeight = ref(0);

const audioDuration = computed<string>(() => formatAudioTime(audioInfo.value.duration / 1000));
const audioCurrentTimeStr = ref('00:00');
const audioIsPaused = ref(true);
const audioLoading = ref(false);
const audioVolume = ref(0.7);
const activePlayinglist = ref(false);

/** 初始值 */
watch(audio, (val) => {
    unbindAudioEvent();
    if (val) {
        volumeHeight.value = 70;
        currentdWidth.value = 0;
        val.volume = volumeHeight.value / 100;
        bindAudioEvent();
    }
});
watch(audioInfo, () => {
    if (audioInfo.value.id) {
        audioLoading.value = true;
    }
})



function bindAudioEvent() {
    let audioDom = audio.value;
    if (audioDom) {
        // 加载过程中点暂停播放是没用的
        audioDom.addEventListener('timeupdate', updateAudioCurrentTime);
        audioDom.addEventListener('seeking', updateAudioCurrentTime);
        audioDom.addEventListener('loadeddata', function() {
            console.log('loadeddata')
            this.play()
        })
        audioDom.addEventListener('emptied', function() {
            console.log('emptied', !audioSrc.value)
            if (!!audioSrc.value) {
                audioLoading.value = true;
            }
        })
        audioDom.addEventListener('durationchange', function() {
            console.log('durationchange', this.duration)
        })
        audioDom.addEventListener('canplay', function() {
            console.log('canplay')
            audioLoading.value = false;
        })
        audioDom.addEventListener('waiting', function() {
            console.log('waiting')
            audioLoading.value = true;
        })
        audioDom.addEventListener('playing', function() {
            console.log('playing')
            audioLoading.value = false;
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('pause', function() {
            console.log('pause')
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('play', function() {
            console.log('play')
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('ended', function() {
            console.log('end')
            playNext();
        })
        audioDom.addEventListener('volumechange', function() {
            if (audioVolumeBar.value && audio.value) {
                volumeHeight.value = audio.value.volume * 100;
            }
        });
    }
}
function unbindAudioEvent() {
    let audioDom = audio.value;
    if (audioDom) {
        audioDom.removeEventListener('timeupdate', updateAudioCurrentTime)
        audioDom.addEventListener('seeking', updateAudioCurrentTime);
    }
}
// path 属性是 chrome 独有的, composedPath 是官方标准
/** 点击音频进度条跳转 */
function seekAudio(e: MouseEvent) {
    // console.log(e)
    // 点到加载的dot, 判断offsetX会有问题
    if (e.composedPath().length > 11) {
        return;
    }
    if (audioTimeBar.value && audio.value) {
        let clickX = e.offsetX;
        let totalWidth = audioTimeBar.value.offsetWidth;
        let pre = Math.round(clickX / totalWidth * 100);
        currentdWidth.value = pre;
        audio.value.currentTime = pre / 100 * (audioInfo.value.duration / 1000);
        // console.log(clickX, totalWidth, Math.round(clickX / totalWidth * 100),audioInfo.value.duration)
    }
}
/** 点击音量条调整音量 */
function seekVolume(e: MouseEvent) {
    // console.log(e)
    if (audioVolumeBar.value && audio.value) {
        let clickY = e.offsetY;
        let totalHeight = audioVolumeBar.value.offsetHeight;
        let pre = Math.round(clickY / totalHeight * 100);
        // volumeHeight.value = pre;
        audio.value.volume = pre / 100;
        // console.log(clickY, totalHeight, pre / 100, audio.value.volume)
    }
}
/** 静音或解除静音 */
function mutedAudio() {
    if (audio.value) {
        if (audio.value.volume !== 0) {
            audioVolume.value = audio.value.volume;
            audio.value.volume = 0;
        }
        else {
            audio.value.volume = audioVolume.value;
        }
    }
}
/** 更新当前播放时间 */
function updateAudioCurrentTime() {
    if (audio.value && audioTimeBar.value) {
        let currentTime = audio.value.currentTime
        audioCurrentTimeStr.value = formatAudioTime(currentTime);

        let duration = audioInfo.value.duration / 1000;
        currentdWidth.value = Math.round(currentTime / duration * 100); 
    }
}
/** 音频播放与暂停 */
function playAudio() {
    let audioDom = audio.value;
    if (audioDom && audioInfo.value.id) {
        if (audioDom.paused) {
            // 当播放路径为空且播放列表有歌曲时, 播放第一首
            if (!audioSrc.value && playinglist.length > 0) {
                setAudioInfo(playinglist[0]);
            }
            audioDom.play();
        }
        else{
            audioDom.pause()
        }
    }
}
/** 播放上一首歌曲 */
function playPre() {
    let pre = findPreMusic();
    if (!pre) {
        resetAudioInfo();
        return;
    }
    setAudioInfo(pre);
}
/** 根据播放模式播放下一首歌曲 */
function playNext(isAuto: boolean = true) {
    let mode = curPlayMode.value;
    // 手动切换时自动循环歌单
    if (!isAuto) {
        if (mode === PlayMode.single || mode === PlayMode.sequential) {
            mode = PlayMode.loop;
        }
    }
    let next = findNextMusic(mode);
    if (!next) {
        resetAudioInfo();
        return;
    }
    if (next === audioInfo.value) {
        audio.value && audio.value.load();
    }
    setAudioInfo(next);
}
/** 图片加载失败 */
function onErrorImg(e: Event) {
    (e.target as HTMLImageElement).src = musicImg.value;
}
/** 显示播放列表 */
function activatePlayinglistState() {
    activePlayinglist.value = true;
}
/** 关闭播放列表 */
function deactivatePlayinglistState() {
    activePlayinglist.value = false;
}

</script>

