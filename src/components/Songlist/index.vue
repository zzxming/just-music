<template>
        <div class="songlist">
        <div class="songlist_header">
            <div class="songlist_index"></div>
            <div class="songlist_title">标题</div>
            <div class="songlist_singer" v-if="!smallScreen">歌手</div>
            <div class="songlist_duration">时间</div>
        </div>
        <div class="songlist_body">
            <div 
                v-for="(song, index) in songs" 
                :class="`songlist_item ${index % 2 === 0 ? 'stripe' : ''} ${activeId === song.id ? 'active' : ''} ${song.st === -200 ? 'disable' : ''}`"
                @dblclick="(e) => playSong(e, song)"
                @contextmenu="(e) => showPopbox(e, song)"
            >
                <div class="songlist_index">
                    <span class="songlist_index-text">{{ twoDigitStr(index + 1) }}</span>
                    <span class="el-icon songlist_index-icon playing"><Playing /></span>
                </div>
                <div class="songlist_title">
                    <div class="songlist_title-title">
                        <span class="songlist_title-text" :title="song.title">{{song.title}}</span>
                        <span v-if="song.fee === 1" class="el-icon songlist_title-icon"><Vip /></span>
                    </div>
                    <div v-if="smallScreen" class="songlist_title-singer" :title="song.singers.map((s: Singer) => s.name).join(' / ')">
                        <span class="songlist_singer">
                            <template v-for="(singer, index) in song.singers">
                                <span class="songlist_singer_item">{{ singer.name }}</span>
                                {{ index === song.singers.length - 1 ? '' : '&nbsp;/&nbsp;'}}
                            </template>
                        </span>
                    </div>
                </div>
                <div v-if="!smallScreen" class="songlist_singer" :title="song.singers.map((s: Singer) => s.name).join(' / ')">
                    <span class="songlist_singer">
                        <template v-for="(singer, index) in song.singers">
                            <span class="songlist_singer_item">{{ singer.name }}</span>
                            {{ index === song.singers.length - 1 ? '' : '&nbsp;/&nbsp;'}}
                        </template>
                    </span>
                </div>
                <div class="songlist_duration">
                    <span class="songlist_duration">{{ formatAudioTime(song.duration / 1000) }}</span>
                </div>
            </div>
            <div v-if="songs.length < 1" class="songlist_empty">{{ emptyText }}</div>
        </div>
    </div>

</template>


<style lang="less" scoped>
.songlist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 40px;
    border-radius: 10px;
    cursor: default;
    background-color: var(--el-bg-color-overlay);
    &_header,
    &_item {
        display: grid;
        align-items: center;
        justify-content: center;
        grid-template-areas: 'index title singer duration';
        grid-template-columns: minmax(auto, 1fr) 6fr 4fr minmax(auto, 1fr);
        grid-gap: 10px;
        width: 100%;
        height: 36px;
    }
    &_body {
        width: 100%;
    }
    &_header:extend(.textOverflowEllipsis) {
        color: var(--el-color-info);
        font-size: 14px;
        .songlist_duration {
            margin-right: 24px;
        }
    }
    &_item {
        height: 40px;
        font-size: 16px;
        color: var(--el-color-info-light-3);
        font-weight: lighter;
        background-color: var(--el-bg-color);
        &.stripe {
            background-color: var(--el-color-info-light-9);
        }
        &.active {
            background-color: var(--el-color-info-light-7);
            .songlist {
                &_index {
                    color: var(--el-color-danger);
                    &-text {
                        display: none;
                    }
                    &-icon.playing {
                        display: block;
                    }
                }
                &_title {
                    color: var(--el-color-danger);
                }
            }
        }
        &.disable {
            .songlist_title {
                color: var(--el-color-info-light-5);
            }
        }
        &:hover {
            background-color: var(--el-color-info-light-8);
        }
    }
    &_index,
    &_title,
    &_singer,
    &_duration {
        margin-right: 6px;
        padding: 0 4px;
    }
    &_index {
        grid-area: index;
        box-sizing: border-box;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &-icon {
            display: none;
        }
    }
    &_title:extend(.textOverflowEllipsis) {
        grid-area: title;
        color: var(--el-text-color-primary);
        &-title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        &-text:extend(.textOverflowEllipsis) {
            
        }
        &-icon {
            margin-left: 4px;
            font-size: 30px;
        }
    }
    &_singer:extend(.textOverflowEllipsis) {
        grid-area: singer;
    }
    &_duration {
        grid-area: duration;
    }
    &_empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--el-color-info-light-3);
    }
}

@media screen and (max-width: 550px) {
    .songlist {
        &_header,
        &_item {
            grid-template-areas: 'index title duration';
            grid-template-columns: minmax(auto, 1fr) 6fr minmax(auto, 1fr);
        }
        &_item {
            height: 64px;
        }
    }
}

.textOverflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>


<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, watch, toRefs } from 'vue';
import Vip from '@/assets/iconfont/vip.vue';
import Playing from '@/assets/iconfont/playing.vue';
import { MusicInfo, Singer } from '@/interface';
import { usePlayerStore } from '@/store/player';
import { usePlaylistStore } from '@/store/playinglist';
import { usePopoutStore } from '@/store/popout';
import { formatAudioTime, twoDigitStr } from '@/utils';
import { useIsSmallScreen } from '@/hooks';


const smallScreen = useIsSmallScreen();
const playerStore = usePlayerStore();
const playlistStore = usePlaylistStore();
const popoutStore = usePopoutStore();
const { audioInfo }  = storeToRefs(playerStore);
const { setAudioInfo } = playerStore;
const { playinglistReplace } = playlistStore;
const { setPopoutState } = popoutStore;

const props = withDefaults(defineProps<{
    songs: MusicInfo[]
    emptyText?: string
    canDeleteSong?: boolean
}>(), {
    emptyText: '这里什么都没有',
    canDeleteSong: false
});
const { songs, emptyText } = toRefs(props);

const activeId = ref(audioInfo.value.id);

// 当前播放变化监听
watch(audioInfo, () => activeId.value = audioInfo.value.id)


/** 双击播放歌曲 */
async function playSong(event: MouseEvent, song: MusicInfo) {
    if (audioInfo.value.id !== song.id) {
        activeId.value = song.id;
        setAudioInfo(song);
        playinglistReplace(songs.value);
    }
}
/** 展示弹出框 */
function showPopbox(event: MouseEvent, song: MusicInfo) {
    // console.log(event)
    event.preventDefault();

    setPopoutState({
        popoutVisible: true,
        popoutPosition: {
            left: event.pageX,
            top: event.pageY,
        },
        popoutHoldData: song,
        popoutIsMusic: true,
        popoutCanDelete: props.canDeleteSong
    })
}
</script>

