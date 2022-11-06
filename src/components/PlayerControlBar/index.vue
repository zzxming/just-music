
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
                    <ProgressControlBar :isTime="true" :loading="audioLoading" />
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
                <el-icon class="botcontrol_btn-icon play" v-show="audio.paused"><IconCusPlay /></el-icon>
                <el-icon class="botcontrol_btn-icon pause" v-show="!audio.paused"><IconCusPause /></el-icon>    
            </div>
            <div class="botcontrol_btn_volume" @mouseenter="volumeShow = true" @mouseleave="volumeShow = false">
                <el-icon class="botcontrol_btn-icon volume" v-show="audio.volume !== 0" @click="mutedAudio"><IconCusVolume /></el-icon>
                <el-icon class="botcontrol_btn-icon mute" v-show="audio.volume === 0" @click="mutedAudio"><IconCusVolumeMute /></el-icon>
                <div class="botcontrol_volume_bar">
                    <div class="botcontrol_volume_text">{{ Math.floor(audioVolume * 100) }}</div>
                    <ProgressControlBar v-show="volumeShow" :isTime="false" :loading="false" />
                </div>
            </div>
            <el-icon class="botcontrol_btn-icon list" @click="activatePlayinglistState"><IconEpExpand /></el-icon>
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
        }
    }
}
@media screen and (max-width: 480px) {
    .botcontrol {
        width: 100vw;
        &_info {
            &_bar-time {
                display: none;
            }
            &_title {
                display: block;
            }
            &_singer {
                font-size: 12px;
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { usePlayerStore } from '@/store/player';
import { usePlaylistStore } from '@/store/playinglist';
import { formatAudioTime } from '@/utils';
import { PlayMode } from '@/interface';
import { jointQuery, mediaSrc } from '@/assets/api';


const router = useRouter();
const playerStore = usePlayerStore();
const playlistStore = usePlaylistStore();
const { audio, audioSrc, showPlayerControl, audioInfo, curPlayMode } = storeToRefs(playerStore);
const { setAudioInfo, resetAudioInfo } = playerStore;
const { playinglist } = storeToRefs(playlistStore);
const { findPreMusic, findNextMusic } = playlistStore;



const audioDuration = computed<string>(() => formatAudioTime(audioInfo.value.duration / 1000));
const audioCurrentTimeStr = ref('00:00');
const audioIsPaused = ref(true);
const audioLoading = ref(false);
const audioVolume = ref(0.7);
const audioMuteVolume = ref(0.7);
const activePlayinglist = ref(false);
const volumeShow = ref(false);


/** 初始值 */
watch(audio, (val) => {
    unbindAudioEvent();
    if (val) {
        bindAudioEvent();
    }
});
watch(audioInfo, () => {
    if (audioInfo.value.id) {
        audioLoading.value = true;
    }
});


function bindAudioEvent() {
    let audioDom = audio.value;
    if (audioDom) {
        audioDom.volume = audioVolume.value;
        // 加载过程中点暂停播放是没用的
        audioDom.addEventListener('timeupdate', updateAudioCurrentTime);
        audioDom.addEventListener('seeking', updateAudioCurrentTime);

        audioDom.addEventListener('loadeddata', function() {
            // console.log('loadeddata')
            // 加载完成就播放
            this.play()
        })
        audioDom.addEventListener('emptied', function() {
            // console.log('emptied', !audioSrc.value)
            if (!!audioSrc.value) {
                audioLoading.value = true;
            }
        })
        audioDom.addEventListener('canplay', function() {
            // console.log('canplay')
            audioLoading.value = false;
        })
        audioDom.addEventListener('waiting', function() {
            // console.log('waiting')
            audioLoading.value = true;
        })
        audioDom.addEventListener('playing', function() {
            // console.log('playing')
            audioLoading.value = false;
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('pause', function() {
            // console.log('pause')
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('play', function() {
            // console.log('play')
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('ended', function() {
            // console.log('end')
            playNext();
        })
        audioDom.addEventListener('volumechange', function() {
            if (audio.value) {
                audioVolume.value = audio.value.volume;
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
/** 静音或解除静音 */
function mutedAudio() {
    if (audio.value) {
        if (audio.value.volume !== 0) {
            audioMuteVolume.value = audio.value.volume;
            console.log(audio.value.volume)
            audio.value.volume = 0;
        }
        else {
            console.log(audioMuteVolume.value)
            audio.value.volume = audioMuteVolume.value;
        }
    }
}
/** 更新当前播放时间 */
function updateAudioCurrentTime() {
    if (audio.value) {
        let currentTime = audio.value.currentTime
        audioCurrentTimeStr.value = formatAudioTime(currentTime);
    }
}
/** 音频播放与暂停 */
function playAudio() {
    let audioDom = audio.value;
    if (audioDom && audioInfo.value.id) {
        if (audioDom.paused) {
            // 当播放路径为空且播放列表有歌曲时, 播放第一首
            if (!audioSrc.value && playinglist.value.length > 0) {
                setAudioInfo(playinglist.value[0]);
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
/** 显示播放列表 */
function activatePlayinglistState() {
    activePlayinglist.value = true;
}
/** 关闭播放列表 */
function deactivatePlayinglistState() {
    activePlayinglist.value = false;
}
</script>

