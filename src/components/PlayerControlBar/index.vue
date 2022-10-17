
<template>
    <div v-if="audio" v-show="showPlayerControl" class="botcontrol">
        <div class="botcontrol_right">
            <el-icon class="botcontrol_btn-icon skipback"><Skipback /></el-icon>
            <div class="botcontrol_btn_play" @click="playAudio">
                <el-icon class="botcontrol_btn-icon play" v-show="audioIsPaused"><Play /></el-icon>
                <el-icon class="botcontrol_btn-icon pause" v-show="!audioIsPaused"><Pause /></el-icon>
            </div>
            <el-icon class="botcontrol_btn-icon skipforward"><Skipforward /></el-icon>
        </div>
        <div class="botcontrol_info">
            <div class="botcontrol_info_cover">
                <img class="botcontrol_info_cover-img" :src="realAudioInfo.cover" @error="onErrorImg" />
            </div>
            <div class="botcontrol_info_mid">
                <div class="botcontrol_info_title">
                    <span class="botcontrol_info_song">{{realAudioInfo.title}}</span>
                    <span class="botcontrol_info_singer">
                        <template v-for="(singer, index) in realAudioInfo.singers">
                            <span class="botcontrol_info_singer-name">{{singer.name}}</span>
                            {{ index === realAudioInfo.singers.length - 1 ? '' : ' / ' }}
                        </template>
                        <!-- <span class="botcontrol_info_singer-name">LCwwww</span> -->
                    </span>
                </div>
                <div class="botcontrol_info_bar-time">
                    <div class="botcontrol_info_bar">
                        <div class="botcontrol_info_bg"></div>
                        <div class="botcontrol_info_progress">
                            <div class="botcontrol_info_dot"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="botcontrol_info_time">
                <span class="botcontrol_info_time-current">{{audioCurrentTime}}</span>
                <span class="botcontrol_info_time-duration"> / {{audioDuration}}</span>
            </div>
        </div>
        <div class="botcontrol_left">
            <el-icon class="botcontrol_btn-icon play" v-show="audio.paused"><Play /></el-icon>
            <el-icon class="botcontrol_btn-icon pause" v-show="!audio.paused"><Pause /></el-icon>
            <el-icon class="botcontrol_btn-icon volume" v-show="!audio.muted"><Volume /></el-icon>
            <el-icon class="botcontrol_btn-icon mute" v-show="audio.muted"><Volume_mute /></el-icon>
            <el-icon class="botcontrol_btn-icon list"><List /></el-icon>
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
    &_right {
        display: flex;
        align-items: center;
    }
    &_left {
        display: flex;
        align-items: center;
        .play,
        .pause {
            display: none;
        }
    }
    &_btn {
        &_play {
            width: 60px;
            height: 50px;
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
            width: 72px;
            min-width: 72px;
            height: 72px;
            display: flex;
            align-items: center;
            &-img {
                width: 100%;
            }
        }
        &_title:extend(.textOverflowEllipsis) {
            height: 48px;
            display: grid;
            align-items: center;
            justify-content: flex-start;
            flex: 1 1 auto;
            grid-template-columns: auto 1fr;
            grid-template-areas: 'song singer';
        }
        &_song:extend(.textOverflowEllipsis) {
            grid-area: song;
            margin-right: 10px;
        }
        &_singer:extend(.textOverflowEllipsis) {
            grid-area: singer;
            color: var(--el-color-danger-light-5);
            &-name {
                &:hover {
                    color: var(--el-color-danger);
                }
            }
        }
        .progressBar(@color) {
            height: 100%;
            border-radius: 6px;
            background-color: @color;
        }
        &_bar {
            cursor: pointer;
            &-time {
                .progressBar(transparent);
                height: 12px;
            }
            position: relative;
            .progressBar(var(--el-color-info-light-8));
            z-index: 1;
        }
        &_progress {
            position: absolute;
            top: 0;
            left: 0;
            .progressBar(var(--el-color-danger-light-5));
            z-index: 3;
        }
        &_bg {
            .progressBar(var(--el-color-info-light-3));
            z-index: 2;
        }
        &_dot {
            box-sizing: border-box;
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
        &_time {
            min-width: 100px;
            font-size: 14px;
            color: var(--el-color-info);
            &-current {
                color: var(--el-text-color-primary);
            }
            &-duration {
            }
        }
    }
}
@media screen and (max-width: 810px) {
    .botcontrol {
        &_right {
            display: none;
        }
        &_left {
            .volume {
                display: none;
            }
            .mute:extend(.volume) {

            }
            .play {
                display: block;
                font-size: 30px;
            }
        }
        &_info {
            &_time {
                display: none;
            }
        }
    }
}
@media screen and (max-width: 400px) {
    .botcontrol {
        &_info {
            &_cover {
                // display: none;
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onMounted, computed, ref, watch } from 'vue';
import { usePlayerStore } from '../../store/player';
import { AudioInfoType } from '../../interface'
import Volume from '../../assets/iconfont/volume.vue';
import Pause from '../../assets/iconfont/pause.vue';
import Play from '../../assets/iconfont/play.vue';
import Skipback from '../../assets/iconfont/skipback.vue';
import Skipforward from '../../assets/iconfont/skipforward.vue';
import Volume_mute from '../../assets/iconfont/volume_mute.vue';
import List from '../../assets/iconfont/list.vue';

interface MusicInfo {
    type: AudioInfoType
    id: number
    title: string
    cover: string
    singers: Singer[]
    duration: number
} 
interface Singer {
    id: number
    name: string
}

const musicImg = ref('/api/imgs/music.jpg');

const playerStore = usePlayerStore();
const { audio, showPlayerControl, audioInfo } = storeToRefs(playerStore);
const { changePlayerControlState } = playerStore;
/** 整合后的音频信息 */
const realAudioInfo = computed<MusicInfo>(() => {
    // console.log(audioInfo)
    if (!audioInfo.value) {
        return {
            type: AudioInfoType.local,
            id: 0,
            title: '',
            cover: '',
            singers: [] as Singer[],
            duration: 0
        } as MusicInfo
    }
    let id: number, title: string, cover: string, duration: number, singers: Singer[];
    if (audioInfo.value.type === AudioInfoType.local) {
        id = audioInfo.value.music_id;
        title = audioInfo.value.music_name;
        cover = audioInfo.value.music_cover;
        singers = audioInfo.value.singers.map(item => ({id: item.singer_id, name: item.singer_name}));
        duration = audioInfo.value.duration;
    }
    else {
        id = audioInfo.value.id;
        title = audioInfo.value.name;
        cover = audioInfo.value.al.picUrl;
        singers = audioInfo.value.ar;
        duration = audioInfo.value.dt;
    }
    const result: MusicInfo = {
        type: audioInfo.value.type, id, title, cover, duration, singers
    };
    return result;
});
const audioDuration = computed<string>(() => formatAudioTime(realAudioInfo.value.duration / 1000));
const audioCurrentTime = ref('00:00');
const audioIsPaused = ref(true);

watch(audio, (val, preVal) => {
    unbindAudioEvent();
    if (val) {
        bindAudioEvent();
    }
});

onMounted(() => {
    changePlayerControlState(true);
});


function bindAudioEvent() {
    let audioDom = audio.value;
    if (audioDom) {
        audioDom.addEventListener('timeupdate', updateAudioCurrentTime)
        audioDom.addEventListener('pause', function() {
            audioIsPaused.value = true
        })
        audioDom.addEventListener('play', function() {
            audioIsPaused.value = false
        })
    }
}
function unbindAudioEvent() {
    let audioDom = audio.value;
    if (audioDom) {
        audioDom.removeEventListener('timeupdate', updateAudioCurrentTime)
    }
}
/** 更新当前播放时间 */
function updateAudioCurrentTime() {
    if (audio.value) {
        audioCurrentTime.value = formatAudioTime(audio.value.currentTime);
    }
}
/** 格式化播放时间 */
function formatAudioTime(num: number) {
    let duration = num;
    let minutes = Math.floor(duration / 60);
    let second = Math.floor(duration - minutes * 60);
    if (minutes >= 60) {
        let hour = Math.floor(minutes / 60);
        return `${twoDigitStr(hour)}:${twoDigitStr(minutes)}:${twoDigitStr(second)}`
    }
    return `${twoDigitStr(minutes)}:${twoDigitStr(second)}`
}
/** 将一位的数字转成两位的字符串 */
function twoDigitStr(num: number) {
    if (num > 9) {
        return `${num}`
    }
    return `0${num}`
}
/** 音频播放与暂停 */
function playAudio() {
    let audioDom = audio.value;
    if (audioDom) {
        if (audioDom.paused) {
            audioDom.play()
        }
        else{
            audioDom.pause()
        }
    }
}
/** 图片加载失败 */
function onErrorImg(e: Event) {
    (e.target as HTMLImageElement).src = musicImg.value
}


</script>

