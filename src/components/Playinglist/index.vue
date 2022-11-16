<template>
    <div :class="`playinglist ${activePlayinglist ? 'active' : ''}`">
        <div class="playinglist_content">
            <div class="playinglist_header">
                <div class="playinglist_header_left">

                </div>
                <div class="playinglist_header_right">
                    <el-icon class="playinglist_header_btn clear" @click="clearPlayinglist"><IconEpDelete /></el-icon>
                </div>
            </div>
            <ul class="playinglist_list">
                <li 
                    v-for="songInfo in playinglist" 
                    :class="`playinglist_list_item ${audioInfo.id === songInfo.id && audioInfo.cid === songInfo.cid ? 'playing' : ''}`"
                    @click="() => clickItem(songInfo)"
                >
                    <span v-if="audioInfo.id === songInfo.id" class="el-icon playinglist_list_item-icon playing"><IconCusPlaying  /></span>
                    <span v-if="songInfo.fee === 1" class="el-icon playinglist_list_item-icon vip"><IconCusVip  /></span>
                    <span class="playinglist_list_item-title" :title="songInfo.title">{{ songInfo.title }}</span>
                    <span class="playinglist_list_item-singer" :title="songInfo.singers.map(item => item.name).join('/')">
                        <span class="break">-</span>
                        {{ songInfo.singers.map(item => item.name).join('/') }}
                    </span>
                    <el-icon class="playinglist_list_item-delete" @click.stop="() => deleteFromPlayinglist(songInfo)"><IconEpClose /></el-icon>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="less" scoped>
.textOverflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.playinglist {
    box-sizing: border-box;
    position: fixed;
    right: 30px;
    bottom: -420px;
    z-index: 2002;
    opacity: 0;
    transition: bottom linear .1s;
    &.active {
        opacity: 1;
        bottom: 100px;
    }
    &_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 30px;
        &_left {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &_right {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &_btn {
            padding: 0 6px;
            cursor: pointer;
        }
    }
    &_content {
        box-sizing: border-box;
        width: 400px;
        height: 400px;
        padding: 20px;
        border-radius: 8px;
        background: var(--el-overlay-color-light);
        color: var(--el-bg-color-page);
        overflow-y: auto;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    &_list {
        &_item:extend(.textOverflowEllipsis) {
            display: grid;
            align-items: center;
            justify-content: flex-start;
            flex: 1 1 auto;
            grid-template-columns: auto auto auto 1fr auto;
            grid-template-areas: 'playing vip title singer delete';
            height: 36px;
            cursor: pointer;            
            &:hover {
                color: var(--el-color-white);
            }
            &.playing {
                .playinglist_list_item-icon {
                    color: var(--el-color-danger);
                }
                .playinglist_list_item-title {
                    color: var(--el-color-danger);
                }
            }
            &-icon {
                padding-right: 4px;
                font-size: 14px;
                &.playing {
                    grid-area: playing;
                }
                &.vip {
                    grid-area: vip;
                    font-size: 28px;
                }
            }
            &-title:extend(.textOverflowEllipsis) {
                grid-area: title;
            }
            &-singer:extend(.textOverflowEllipsis) {
                grid-area: singer;
                font-size: 12px;
                color: var(--el-color-info-light-5);
            }
            &-delete {
                grid-area: delete;
                margin-left: auto;
            }
        }
    }
}
.break {
    font-size: 12px;
    margin: 0 4px;
}
@media screen and (max-width: 550px) {
    .playinglist {
        right: 0;
        width: calc(100% - 20px);
        margin: 10px;
        &.active {
            bottom: 30px;
        }
        &_content {
            width: 100%;
        }
    }
}
</style>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { MusicInfo } from '@/interface';
import { usePlayerStore, usePlaylistStore, useComponentStateStore } from '@/store';
import { fullScreenMaskEvent } from '@/store/componentState';

const playerStore = usePlayerStore();
const { audioInfo } = storeToRefs(playerStore);
const { setAudioInfo, resetAudioInfo } = playerStore;
const playlistStore = usePlaylistStore();
const { playinglist } = storeToRefs(playlistStore);
const { playinglistSplice, playinglistReplace } = playlistStore;
const componentStateStore = useComponentStateStore();
const { activePlayinglist } = storeToRefs(componentStateStore);
const { changePlayinglistState, changFullScreenMaskState } = componentStateStore;


onMounted(() => {
    window.addEventListener(fullScreenMaskEvent, () => {
        changePlayinglistState(false);
    })
});

watch(activePlayinglist, val => {
    val && changFullScreenMaskState(true);
})

function clickItem(songInfo: MusicInfo) {
    playMusic(songInfo);
    changePlayinglistState(false);
    changFullScreenMaskState(false);
}
/** 播放列表点击切换歌曲 */
function playMusic(info: MusicInfo) {
    if (info.id === audioInfo.value.id && info.cid === audioInfo.value.cid) return;
    setAudioInfo(info);
}
/** 从播放列表删除歌曲 */
function deleteFromPlayinglist(info: MusicInfo) {
    let switchSong = playinglistSplice(info, audioInfo.value);
    if (switchSong) {
        setAudioInfo(switchSong)
    }
    else {
        resetAudioInfo();
    }
}
/** 清空播放列表 */
function clearPlayinglist() {
    playinglistReplace([]);
    resetAudioInfo();
    ElMessage({
        type: 'success',
        message: '播放列表已清空'
    });
}

</script>

