<template>
    <ul class="playlist_list">
        <el-row :gutter="20" :class="`playlist_list_row ${isTopList ? 'toplist' : ''}`">
            <el-col 
                v-for="item in playlist" 
                class="playlist_list_wrap"
            >
                <div 
                    class="playlist_list_item"
                    @click="gotoPlaylistDetail(item.id, item.type)"
                    @contextmenu="(e) => showPopbox(e, item)"
                >
                    <div class="playlist_list_item-cover">
                        <el-icon class="playlist_list_item-icon play"><VideoPlay /></el-icon>
                        <span class="playlist_list_item-playcount">
                            <el-icon class="playlist_list_item-icon allow-right"><CaretRight /></el-icon>
                            {{formatPlayCount(item.playCount)}}
                        </span>
                        <img class="playlist_list_item-img" :src="item.type === PlaylistType.local ? mediaSrc(item.cover) : item.cover"  @error="throttle(onErrorImg, 3000)" />
                    </div>
                    <div class="playlist_list_item-title">
                        {{item.title}}
                    </div>
                </div>
            </el-col>
        </el-row>
    </ul>

</template>

<style lang="less" scoped>
.playlist_list {
    display: inline-block;
    width: 100%;
    height: 100%;
    min-height: 200px;
    &_row {
        justify-content: space-around;
        &::-webkit-scrollbar {
            height: 6px;
            border-radius: 6px;
            overflow: hidden;
            background-color: var(--el-bg-color-page);
        }
        &::-webkit-scrollbar-button {
            display: none;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background-color: var(--el-color-danger-light-7);
        }
    }
    &_wrap {
        max-width: 20%;
        flex: 0 0 20%;
        margin: 10px 0; 
    }
    &_item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        // background-color: aqua;
        &-cover {
            position: relative;
            display: flex;
            width: 100%;
            min-width: 48px;
            margin-bottom: 6px;
            padding-top: 100%;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            &:hover {
                .playlist_list_item-icon {
                    opacity: 1;
                }
            }
        }
        &-img {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 1;
        }
        &-icon {
            position: absolute;
            font-size: 30px;
            color: var(--el-color-white);
            opacity: 0;
            transition: opacity 0.3s linear;
            z-index: 2;
            &.play {
                bottom: 8px;
                right: 8px;
                font-size: 40px;
                background: rgba(121,121,121,.5);
                border-radius: 50%;
            }
        }
        &-playcount {
            position: absolute;
            display: flex;
            align-items: center;
            top: 4px;
            right: 4px;
            font-size: 12px;
            color: var(--el-color-white);
            z-index: 2;
            line-height: 22px;
            .playlist_list_item-icon {
                position: relative;
                font-size: 16px;
                opacity: 1;
            }
        }
        &-title {
            align-self: flex-start;
            display: -webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 24px;
            color: var(--el-text-color-regular);
            cursor: pointer;
            &:hover {
                color: var(--el-color-black);
            }
        }
    }
}
.toplist {
    flex-wrap: wrap !important;
}

@media screen and (max-width: 800px) {
    .playlist_list {
        &_wrap {
            max-width: 24%;
            flex: 0 0 24%;
            margin: 10px 0; 
        }
        &_row {
            justify-content: flex-start;
            flex-wrap: nowrap;
            overflow-x: auto;
            
        }
    }
    .toplist {
        .playlist_list_wrap {
            max-width: 33%;
            flex: 0 0 33%;
            margin: 10px 0; 
        }
    }
}
@media screen and (max-width: 550px) {
    .toplist {
        .playlist_list_wrap {
            max-width: 50%;
            flex: 0 0 50%;
            margin: 10px 0; 
        }
    }
}
@media screen and (max-width: 375px) {
    .playlist_list {
        &_wrap {
            max-width: 31%;
            flex: 0 0 31%;
            margin: 10px 0; 
        }
        &_row {
            flex-wrap: nowrap;
            overflow-x: auto;
        }
    }
}
</style>

<script lang="ts" setup>
import { throttle } from 'lodash';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { PlaylistType, PlaylistInfoPartial } from '@/interface';
import { usePopoutStore } from '@/store/popout';
import { mediaSrc } from '@/assets/api';

const musicImg = ref('/api/imgs/music.jpg');

const { isTopList, playlist } = defineProps<{
    isTopList: boolean
    playlist: PlaylistInfoPartial[]
}>();
const router = useRouter();
const popoutStore = usePopoutStore();
const { setPopoutState } = popoutStore;

/** 格式化显示播放数 */
function formatPlayCount(num: number) {
    if (num > 100000000) {
        return `${Math.floor(num / 100000000)}亿`
    }
    if (num > 10000) {
        return `${Math.floor(num / 10000)}万`
    }
    return `${num}`
}
/** 跳转至歌单内歌曲列表 */
function gotoPlaylistDetail(id: number, type: PlaylistType) {
    router.push(`/playlist/detail?id=${id}&t=${type}`)
}
/** 图片加载失败 */
function onErrorImg(e: Event) {
    (e.target as HTMLImageElement).src = musicImg.value
}

function showPopbox(e: MouseEvent, playlist: PlaylistInfoPartial) {
    // console.log(event)
    e.preventDefault();
    // console.log(playlist)

    setPopoutState({
        popoutVisible: true,
        popoutPosition: {
            left: e.pageX,
            top: e.pageY,
        },
        popoutHoldData: playlist,
        popoutIsMusic: false,
        popoutCanDelete: false
    })
}

</script>

