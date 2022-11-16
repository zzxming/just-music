
<template>
    <div v-if="audio" v-show="showPlayerControl" class="botcontrol">
        <div class="botcontrol_left">
            <el-icon class="botcontrol_btn-icon skipback" @click="playPre"><IconCusSkipback /></el-icon>
            <div class="botcontrol_btn_play" @click="playAudio">
                <el-icon class="botcontrol_btn-icon play" v-show="audioIsPaused"><IconCusPlay /></el-icon>
                <el-icon class="botcontrol_btn-icon pause" v-show="!audioIsPaused"><IconCusPause /></el-icon>
            </div>
            <el-icon class="botcontrol_btn-icon skipforward" @click="() => playNext(false)"><IconCusSkipforward /></el-icon>
        </div>
        <div class="botcontrol_info">
            <div class="botcontrol_info_cover" @click="() => router.push(jointQuery('/song', {id: audioInfo.id, t: audioInfo.type}))">
                <img class="botcontrol_info_cover-img" v-lazy="mediaSrc(audioInfo.cover)" :key="audioInfo.cover" />
            </div>
            <div class="botcontrol_info_mid">
                <div class="botcontrol_info_title" @click="() => router.push('/player')">
                    <span class="botcontrol_info_song" :title="audioInfo.title">{{audioInfo.title}}</span>
                    <span class="botcontrol_info_singer" :title="audioInfo.singers.map(s => s.name).join(' / ')">
                        <template v-for="(singer, index) in audioInfo.singers">
                            <span class="botcontrol_info_singer-name">{{singer.name}}</span>
                            {{ index === audioInfo.singers.length - 1 ? '' : ' / ' }}
                        </template>
                    </span>
                </div>
                <div class="botcontrol_info_bar-time">
                    <ProgressControlBar :isTime="true" />
                </div>
            </div>
            <div class="botcontrol_info_time">
                <span class="botcontrol_info_time-current">{{audioCurrentTimeStr}}</span>
                <span class="botcontrol_info_time-duration"> / {{audioDurationStr}}</span>
            </div>
        </div>
        <div class="botcontrol_right">
            <AudioPlayType class="botcontrol_btn-icon type" />
            <div class="botcontrol_btn_play" @click="playAudio">
                <el-icon v-show="audioLoading" class="botcontrol_btn-icon load"><IconEpLoading /></el-icon>
                <el-icon class="botcontrol_btn-icon play" v-show="!audioLoading && audioIsPaused"><IconCusPlay /></el-icon>
                <el-icon class="botcontrol_btn-icon pause" v-show="!audioLoading && !audioIsPaused"><IconCusPause /></el-icon> 
            </div>
            <div class="botcontrol_btn_volume" @mouseenter="volumeShow = true" @mouseleave="volumeShow = false">
                <div @click="mutedAudio">
                    <el-icon class="botcontrol_btn-icon volume" v-show="audioVolume !== 0"><IconCusVolume /></el-icon>
                    <el-icon class="botcontrol_btn-icon mute" v-show="audioVolume === 0"><IconCusVolumeMute /></el-icon>
                </div>
                <div class="botcontrol_volume_bar">
                    <div class="botcontrol_volume_text">{{ Math.floor(audioVolume * 100) }}</div>
                    <ProgressControlBar v-show="volumeShow" :isTime="false" :horizental="false" />
                </div>
            </div>
            <el-icon class="botcontrol_btn-icon list" @click="() => changePlayinglistState(true)"><IconEpExpand /></el-icon>
        </div>
    </div>
</template>

<style lang="less" scoped>
.textOverflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.botcontrol {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    padding: 0 30px;
    background-color: var(--el-fill-color-blank);
    box-shadow: var(--el-box-shadow-dark);
    transition: bottom .3s linear;
    z-index: 9;
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
            color: var(--el-text-color-regular);
            margin: 0 5px;
            &:hover {
                color: var(--el-text-color-primary);
            }
            &.play,
            &.pause {
                font-size: 50px;
            }
            &.load {
                animation: rotate360 linear 2s infinite;
            }
        }
    }
    .progressBar(@color) {
        border-radius: 6px;
        background-color: @color;
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
            cursor: pointer;
            box-shadow: var(--el-box-shadow-light);
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
            user-select: none;
        }
        &_song {
            .textOverflowEllipsis();
            display: block;
            grid-area: song;
            margin-right: 10px;
        }
        &_singer {
            .textOverflowEllipsis();
            display: block;
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
        &_text {
            width: 100%;
            margin-top: 8px;
            text-align: center;
            user-select: none;
        }
        &_bar {
            display: none;
            align-items: center;
            justify-content: space-around;
            flex-direction: column;
            position: relative;
            bottom: 180px;
            width: 100%;
            height: 140px;
            .progressBar(var(--el-fill-color-blank));
            box-shadow: var(--el-box-shadow-light);
            z-index: 1;
        }
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
@media screen and (max-width: 550px) {
    .botcontrol {
        height: 60px;
        &_info {
            &_cover {
                transform: translateY(-10px);
            }
            &_title {
                display: block;
            }
            &_bar-time {
                display: none;
            }
        }
        &_btn {
            &-icon {
                &.type {
                    display: none;
                }
            }
        }
    }
}
@media screen and (max-width: 480px) {
    .botcontrol {
        width: 100vw;
        &_info {
            margin-left: 0;
            &_singer {
                font-size: 12px;
            }
        }
    }
}

@keyframes rotate360 {
    0% {
        transform: rotateZ(0deg);
    }
    100% {
        transform: rotateZ(360deg);
    }
}
</style>

<script lang="ts" setup>
import { usePlayerStore, useAudioContorlStore, useComponentStateStore } from '@/store';
import { jointQuery, mediaSrc } from '@/assets/api';


const router = useRouter();
const playerStore = usePlayerStore();
const { audio, audioInfo } = storeToRefs(playerStore);
const audioControlStore = useAudioContorlStore();
const { audioIsPaused, audioLoading, audioCurrentTimeStr, audioDurationStr, audioVolume } = storeToRefs(audioControlStore);
const { playNext, playPre, playAudio } = audioControlStore;
const componentStateStore = useComponentStateStore();
const { showPlayerControl } = storeToRefs(componentStateStore);
const { changePlayinglistState } = componentStateStore;


const audioMuteVolume = ref(0.7);
const volumeShow = ref(false);


/** 静音或解除静音 */
function mutedAudio() {
    if (audio.value) {
        if (audio.value.volume !== 0) {
            audioMuteVolume.value = audio.value.volume;
            audio.value.volume = 0;
        }
        else {
            audio.value.volume = audioMuteVolume.value;
        }
    }
}
</script>

