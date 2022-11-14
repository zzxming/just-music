<template>
    <div class="player">
        <div class="player_header">
            <div class="player_header_top">
                <BackRoute class="player_header_back" />
                <div class="player_header_mid">
                    <div class="player_header_title">
                        <span class="player_header_title-text" v-textRoll>{{ audioInfo.title }}</span>
                    </div>
                    <div class="player_header_singer">
                        <span class="player_header_singer-text" v-textRoll>
                            <template v-for="(singer, index) in audioInfo.singers">
                                <span class="botcontrol_info_singer-name">{{singer.name}}</span>
                                {{ index === audioInfo.singers.length - 1 ? '' : ' / ' }}
                            </template>
                        </span>
                    </div>
                </div>
                <el-icon class="player_control_btn option" @click.stop="showPopbox"><IconAntDesignMoreOutlined /></el-icon>
            </div>
            
            <!-- ios  点音量进度、图标都没用 -->
            <div class="player_volume">
                <div class="player_volume_icon" @click="mutedAudio">
                    <el-icon class="botcontrol_btn-icon volume" v-show="audioVolume !== 0"><IconCusVolume /></el-icon>
                    <el-icon class="botcontrol_btn-icon mute" v-show="audioVolume === 0"><IconCusVolumeMute /></el-icon>
                </div>
                <ProgressControlBar class="player_volume_bar" :isTime="false" progressColor="var(--el-color-primary-light-5)" />
            </div>
        </div>


        <div class="player_content">
            <div class="player_cover">
                <img v-lazy="mediaSrc(audioInfo.cover)" :key="audioInfo.cover" />
            </div>
        </div>
        
        <div class="player_bottom">
            <div class="player_time">
                <div class="player_time_cur">{{audioCurrentTimeStr}}</div>
                <div class="player_time_bar">
                    <ProgressControlBar :isTime="true" />
                </div>
                <div class="player_time_duration">{{audioDurationStr}}</div>
            </div>
            <div class="player_control">
                <AudioPlayType class="player_control_btn mode" />
                <el-icon class="player_control_btn back" @click="playPre"><IconCusSkipback /></el-icon>
                <div class="player_control_btn play" @click="playAudio">
                    <el-icon v-show="!audioLoading && audioIsPaused"><IconCusPlay /></el-icon>
                    <el-icon v-show="!audioLoading && !audioIsPaused"><IconCusPause /></el-icon>
                    <el-icon class="player_control_btn load" v-show="audioLoading"><IconEpLoading /></el-icon>
                </div>
                <el-icon class="player_control_btn forward" @click="() => playNext(false)"><IconCusSkipforward /></el-icon>
                <el-icon class="player_control_btn list" @click="() => changePlayinglistState(true)"><IconEpExpand /></el-icon>
            </div>
        </div>
    </div>
    
</template>

<style lang="less" scoped>
.player {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, var(--el-color-primary-light-9) 0%, var(--el-color-danger-light-9) 50%, var(--el-text-color-placeholder) 100%);
    &_header {
        margin-top: 20px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        &_top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
        &_back {
            background-color: transparent;
            width: 40px;
            height: 40px;
            font-size: 40px;
            border: none;
            outline: none;
            &:hover,
            &:active,
            &:focus {
                color: var(--el-text-color-primary);
            }
        }
        &_mid {
            width: 70%;
            overflow: hidden;
        }
        &_title {
            display: inline-block;
            width: 100%;
            font-size: 20px;
            text-align: center;
            white-space: nowrap;
        }
        &_singer {
            display: inline-block;
            width: 100%;
            font-size: 14px;
            color: var(--el-color-info);
            text-align: center;
            white-space: nowrap;
        }
    }
    &_volume {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 80%;
        height: 12px;
        margin: 20px 0;
        &_icon {
            margin-right: 10px;
            font-size: 20px;
            cursor: pointer;
        }
        &_bar {
            width: 100%;
        }
    }
    &_content {
        display: flex;
        flex-direction: column;
        width: 60%;
        overflow: hidden;
    }
    &_cover {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        width: 100%;
        height: 100%;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    &_time {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80%;
        margin: 20px 0 10px;
        &_bar {
            flex: 1;
            height: 12px;
            margin: 0 16px;
        }
    }
    &_bottom {
        margin-bottom: 20px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    &_control {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        &_btn {
            font-size: 40px;
            margin: 0 10px;
            fill: var(--el-text-color-regular);
            color: var(--el-text-color-regular);
            cursor: pointer;
            &:hover {
                color: var(--el-text-color-primary);
                fill: var(--el-text-color-primary);
            }
            &.play {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                font-size: 60px;
            }
            &.load {
                font-size: 60px;
                animation: rotate360 linear 2s infinite;
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

@media screen and (max-width: 550px) {
    .player {
        &_content {
            width: 80vw;
        }
    }
}
</style>

<script lang="ts" setup>
import { usePlayerStore, useAudioContorlStore, useComponentStateStore, usePopoutStore } from '@/store';
import { mediaSrc } from '@/assets/api';

const playerStore = usePlayerStore();
const { audio, audioInfo } = storeToRefs(playerStore);
const audioControlStroe = useAudioContorlStore();
const { audioIsPaused, audioLoading, audioCurrentTimeStr, audioDurationStr, audioVolume } = storeToRefs(audioControlStroe);
const { playAudio, playNext, playPre } = audioControlStroe;
const componentStateStore = useComponentStateStore();
const { changePlayerControlState, changeShowHeaderState, changePlayinglistState } = componentStateStore;
const popoutStore = usePopoutStore();
const { setPopoutState } = popoutStore;

const audioMuteVolume = ref(audioVolume.value);

onDeactivated(() => {
    changePlayerControlState(true);
    changeShowHeaderState(true);
});
onActivated(() => {
    changePlayerControlState(false);
    changeShowHeaderState(false);
});

/** 展开操作弹框 */
function showPopbox(event: MouseEvent) {
    // console.log(event)
    event.preventDefault();
    
    setPopoutState({
        popoutVisible: true,
        popoutPosition: {
            left: event.pageX,
            top: event.pageY,
        },
        popoutHoldData: audioInfo.value,
        popoutIsMusic: true,
        popoutCanDelete: false
    })
}
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

