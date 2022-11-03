<template>
    <div class="player">
        <div class="player_left">
            <div class="player_start">
                <div class="player_header">
                    <div class="player_title">{{ audioInfo.title }}</div>
                    <div class="player_singer">{{ audioInfo.singers.map(item => item.name).join(' / ')}}</div>
                </div>
                <div class="player_cover">
                    <img v-lazy="mediaSrc(audioInfo.cover)" :key="audioInfo.cover" alt="歌曲封面" />
                </div>
            </div>
            <div class="player_info">
                <div class="player_title">{{ audioInfo.title }}</div>
                <span class="player_info_label">{{ new Date(audioInfo.publishTime).toLocaleDateString().split('/').join('-') }}</span>
                <div class="player_origin">
                    <span class="player_info_label">来源：</span>
                    {{ 
                        audioInfo.type === AudioInfoType.bili ? '哔哩哔哩' :
                        audioInfo.type === AudioInfoType.cloud ? '网易云音乐' :
                        audioInfo.type === AudioInfoType.local && audioInfo.id ? 'just音乐' : '未知'
                    }}
                </div>
                <div class="player_singer">
                    <span class="player_info_label">歌手：</span>
                    {{ audioInfo.singers.map(item => item.name).join(' / ')}}
                </div>
                <div class="player_ablum">
                    <span class="player_info_label">专辑：</span>
                    {{ audioInfo.album }}
                </div>
            </div>
        </div>
        <div class="player_right"></div>
        
        <div class="player_control" v-if="audioInfo.id == id && audioInfo.type == t">
            <el-icon class="player_control_btn-icon skipback" @click="playPre"><Skipback /></el-icon>
            <div class="player_control_btn_play" @click="playAudio">
                <el-icon class="player_control_btn-icon play" v-show="audioIsPaused"><Play /></el-icon>
                <el-icon class="player_control_btn-icon pause" v-show="!audioIsPaused"><Pause /></el-icon>
            </div>
            <el-icon class="player_control_btn-icon skipforward" @click="playNext"><Skipforward /></el-icon>
        </div>
    </div>
</template>


<style lang="less" scoped>
.player {
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    margin: 20px 0;
    padding: 20px 40px 10px;
    min-height: calc(100vh - 64px - 80px - 40px);
    background-color: var(--el-color-white);
    &_left {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        min-width: 550px;
    }
    &_right {
        min-width: 400px;
    }
    &_start {
        width: 100%;
    }
    &_header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        .player_title,
        .player_singer {
            display: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .player_singer {
            color: var(--el-color-info);
            margin-bottom: 10px;
        }
    }
    &_title {
        line-height: 40px;
        font-size: 30px;
        margin-bottom: 10px;
    }
    &_singer {
        line-height: 24px;
    }
    &_info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        margin-left: 40px;
        font-size: 14px;
        &_label {
            color: var(--el-color-info);
        }
    }
    &_cover {
        display: flex;
        max-width: 450px;
        max-height: 450px;
        user-select: none;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
            overflow: hidden;
        }
    }
    &_control {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-top: 30px;
        &_btn {
            &-icon {
                font-size: 44px;
                color: var(--el-color-info);
                cursor: pointer;
            }
            &_play {
                display: flex;
                justify-content: center;
                margin: 0 30px;
                .player_control_btn-icon {
                    font-size: 60px;
                }
            }
        }
    }
}
@media screen and (max-width: 980px) {
    .player {
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }
}
@media screen and (max-width: 550px) {
    .player {
        margin-bottom: 80px;
        &_start {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        &_header {
            flex-direction: column;
            .player_title,
            .player_singer {
                display: block;
            }
        }
        &_left {
            flex-direction: column;
            width: 100%;
            min-width: auto;
        }
        &_info {
            margin: 0;
            margin-top: 20px;
            align-items: center;
            .player_title,
            .player_singer {
                display: none;
            }
        }
        &_cover {
            width: 50%;
        }
    }
}
</style>


<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { mediaSrc } from '@/assets/api';
import { usePlayerStore } from '@/store/player';
import { usePlaylistStore } from '@/store/playinglist';
import { AudioInfoType } from '@/interface';
import Pause from '@/assets/iconfont/pause.vue';
import Play from '@/assets/iconfont/play.vue';
import Skipback from '@/assets/iconfont/skipback.vue';
import Skipforward from '@/assets/iconfont/skipforward.vue';


const props = defineProps<{
    id: number | string
    t: AudioInfoType
}>();
const playerStore = usePlayerStore();
const playinglistStore = usePlaylistStore();
const { audio, audioInfo, curPlayMode, audioSrc } =  storeToRefs(playerStore);
const { playinglist } =  storeToRefs(playinglistStore);
const { setAudioInfo, resetAudioInfo } = playerStore;
const { findPreMusic, findNextMusic } = playinglistStore;

const audioIsPaused = ref(true);

watch([() => props.id, () => props.t], () => {
    requesSongData();
}, { immediate: true });

onMounted(() => {
    if (audio.value) {
        audio.value.addEventListener('play', audioStatus)
        audio.value.addEventListener('pause', audioStatus)
    }
});
onUnmounted(() => {
    if (audio.value) {
        audio.value.addEventListener('play', audioStatus)
        audio.value.addEventListener('pause', audioStatus)
    }
})

function audioStatus() {
    if (audio.value) {
        audioIsPaused.value = audio.value.paused;
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
function playNext() {
    let mode = curPlayMode.value;
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
function requesSongData() {
    console.log(props.id, props.t)
}

</script>
