<template>
    <div class="playlist">
        <LoadingErrorTip :isError="!loading && loadingError" :requestFunc="requestPlaylistData" />
        <!-- 请求失败的时候处理 songlist, 变成重新请求 -->
        <div v-loading="loading && !playlistInfo" class="playlist_wrapper">
            <div v-if="playlistInfo" class="playlist_info">
                <div class="playlist_info_left">
                    <div class="playlist_info_cover">
                        <img v-lazy="mediaSrc(playlistInfo.cover)" alt="歌单封面" :key="playlistInfo.cover" />
                    </div>
                </div>
                <div class="playlist_info_right">
                    <div class="playlist_info_right_line">
                        <h3 class="playlist_info_title" :title="playlistInfo.title">{{playlistInfo.title}}</h3>
                    </div>
                    <div class="playlist_info_right_line">
                        <el-avatar class="playlist_info_avatar" :size="28" :icon="UserFilled" v-lazy="mediaSrc(playlistInfo.creator.avatarUrl)" :key="playlistInfo.creator.avatarUrl" />
                        <span class="playlist_info_nickname">{{playlistInfo.creator.name}}</span>
                        <span class="playlist_info_createTime">{{new Date(playlistInfo.createTime).toLocaleDateString()}}</span>
                    </div>
                    <div class="playlist_info_right_line">
                        <div class="playlise_info_playinfo">
                            <span class="playlist_info-tip">歌曲:</span>{{playlistInfo.trackCount}}
                        </div>
                    </div>
                    <div class="playlist_info_right_line">
                        <div class="playlist_info_description">
                            <span class="playlist_info-tip">简介:</span>
                            <span v-if="playlistInfo.description === ''">无</span>
                            <template v-else>
                                <span class="playlist_info_description-title" v-show="!descriptionOpen">{{playlistInfo.description}}</span>
                                <span class="playlist_info_description-full" v-show="descriptionOpen">{{playlistInfo.description}}</span>
                                <span class="playlist_info_description-arrow" @click="switchDescriptionState">
                                    <el-icon v-show="descriptionOpen"><CaretTop /></el-icon>
                                    <el-icon v-show="!descriptionOpen"><CaretBottom /></el-icon>
                                </span>
                            </template>

                        </div>
                    </div>
                </div>
            </div>
            <div class="playlist_song" v-loading="loadingSong" v-show="playlistInfo">
                <Songlist 
                    v-if="!loadingSong && !loadingSongError" 
                    :songs="songsInfo" 
                    :canDeleteSong="playlistInfo?.type === PlaylistType.localStorage" 
                />
                <LoadingErrorTip 
                    :style="{alignSelf: 'center'}" 
                    :isError="!loadingSong && loadingSongError" 
                    :requestFunc="getPlaylistTrackWithId.bind(undefined, Number(props.id), props.t)" 
                />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@coverHeight: 180px;
@infoPaddingTop: 40px;
@infoPaddingBot: 20px;
.playlist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: calc(100vh - 64px);
    &_wrapper {
        align-self: center;
        width: 100%;
        min-height: calc(100vh - 64px - 104px);
    }
    &_info {
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        padding: @infoPaddingTop 60px @infoPaddingBot;
        font-size: 14px;
        &_left {
            align-self: flex-start;
            width: @coverHeight;
        }
        &_right {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            width: calc(100% - @coverHeight - 20px);
            &_line {
                display: flex;
                align-content: center;
                justify-content: flex-start;
                margin-top: 4px;
            }
        }
        &_cover {
            display: flex;
            width: 100%;
            height: 100%;
            min-height: @coverHeight;
            border-radius: 8px;
            overflow: hidden;
            user-select: none;
            img {
                width: 100%;
            }
        }
        &_title {
            font-size: 26px;
            margin: 0;
            line-height: 40px;
            // word-break: break-all;
            // text-overflow: ellipsis;
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 2;
            // overflow: hidden;
        }
        &_nickname {
            margin-left: 6px;
            line-height: 28px;
            color: var(--el-color-danger-light-3);
            font-size: 12px;
            &:hover {
                color: var(--el-color-danger);
            }
        }
        &_createTime {
            margin-left: 6px;
            line-height: 28px;
            color: var(--el-text-color-placeholder);
            font-size: 12px;
        }
        &-tip {
            white-space: nowrap;
            margin-right: 6px;
        }
        &_description {
            position: relative;
            display: flex;    
            width: 100%;
            color: var(--el-text-color-primary);
            &-title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &-arrow {
                cursor: pointer;
            }
        }
    }
    &_song {
        box-sizing: border-box;
        width: 100%;
        padding: 0 40px;
        min-height: calc(100vh - 64px - @coverHeight - @infoPaddingTop - @infoPaddingBot);
        margin-bottom: 200px;
    }
}
@media screen and (max-width: 550px) {
    @coverHeight: 120px;
    .playlist {
        &_info {
            justify-content: space-between;
            padding: @infoPaddingTop 20px @infoPaddingBot;
            line-height: 20px;
            font-size: 12px;
            &_left {
                width: @coverHeight;
            }
            &_right {
                width: calc(100% - @coverHeight - 20px);
                margin-left: 8px;
                &_line {
                    margin: 0;
                    .el-avatar.el-avatar--icon {
                        width: 24px;
                        height: 24px;
                        align-self: center;
                    }
                }
            }
            &_cover {
                min-height: @coverHeight;
            }
            &_title {
                line-height: 30px;
                font-size: 20px;
            }
            &_createTime {
                display: none;
            }
        }
        &_song {
            padding: 0;
            min-height: calc(100vh - 64px - @coverHeight - @infoPaddingTop - @infoPaddingBot);
        }
    }
}
</style>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
import { getCloudPlaylistDetail, getCloudPlaylistTrack } from '@/assets/cloudApi';
import { getLocalPlaylistDetail, geLocalPlaylistTrack } from '@/assets/localApi';
import { mediaSrc } from '@/assets/api';
import { AudioInfoType, MusicInfo, PlaylistInfo, PlaylistType } from '@/interface';
import { formatMusicInfo, formatPlaylistInfo } from '@/utils';
import LoadingErrorTip from '@/components/LoadingErrorTip/index.vue';
import Songlist from '@/components/Songlist/index.vue';
import { getCustomPlaylistWithId, localStoragePlaylistEvent } from '@/utils/localStorage';
import { useRouter } from 'vue-router';



const props = defineProps<{
    id: string
    t: PlaylistType
}>();
const router = useRouter();

const loading = ref(true);
const loadingSong = ref(true);
const loadingError = ref(false);
const loadingSongError = ref(false);
const songsInfo = ref<MusicInfo[]>([]);
const playlistInfo = ref<PlaylistInfo>();
const descriptionOpen = ref(false);


watch([() => props.id, () => props.t], () => {
    requestPlaylistData();
}, { immediate: true });

onMounted(() => {
    if (props.t === PlaylistType.localStorage) {
        window.addEventListener(localStoragePlaylistEvent, requestPlaylistData);
    }
});
onUnmounted(() => {
    window.removeEventListener(localStoragePlaylistEvent, requestPlaylistData);
});


/** 请求歌单信息 */
async function requestPlaylistData() {

    if (props.t === PlaylistType.localStorage) {
        loading.value = true;
        loadingSong.value = true;
        let customPlaylist = getCustomPlaylistWithId(Number(props.id));
        if (customPlaylist) {
            playlistInfo.value = customPlaylist;
            songsInfo.value = customPlaylist.tracks;
        }
        else {
            router.replace('/404');
        }
        loading.value = false;
        loadingSong.value = false;
        return;
    }

    getPlaylistDetailWithId(Number(props.id), props.t);
    getPlaylistTrackWithId(Number(props.id), props.t);
}
/** 获取歌单信息 */
async function getPlaylistDetailWithId(id: number, type: PlaylistType) {
    loading.value = true;
    loadingError.value = false;
    let [err, result] = type === PlaylistType.local ? await getLocalPlaylistDetail({id}) : await getCloudPlaylistDetail({id});
    loading.value = false;

    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data;
        playlistInfo.value = formatPlaylistInfo(data, type);
        return true
    }
    else {
        router.replace('/404');
        loadingError.value = true;
        return false;
    }
}
/** 获取歌单内歌曲 */
async function getPlaylistTrackWithId(id: number, type: PlaylistType) {
    loadingSong.value = true;
    loadingSongError.value = false;
    let [err, result] = type === PlaylistType.local ? await geLocalPlaylistTrack({id}) : await getCloudPlaylistTrack({id});
    loadingSong.value = false;

    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data;
        songsInfo.value = formatMusicInfo(data, type === PlaylistType.cloud ? AudioInfoType.cloud : AudioInfoType.local);
        return true;
    }
    else {
        loadingSongError.value = true;
        return false;
    }
}
/** 改变描述的展示状态 */
function switchDescriptionState() {
    descriptionOpen.value = !descriptionOpen.value;
}

</script>