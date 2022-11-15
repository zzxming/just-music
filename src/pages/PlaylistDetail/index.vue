<template>
    <div class="playlist" v-loading="collectLoading">
        <LoadingErrorTip :isError="!loading && loadingError" :requestFunc="requestPlaylistData" />
        <!-- 请求失败的时候处理 songlist, 变成重新请求 -->
        <div v-loading="loading && !playlistInfo" class="playlist_wrapper">
            <div v-if="playlistInfo" class="playlist_info">
                <div class="playlist_info_left">
                    <div class="playlist_info_cover">
                        <img v-lazy="mediaSrc(playlistInfo.cover)" alt="歌单封面" :key="playlistInfo.cover" />
                    </div>
                            
                    <div class="playlist_control" v-if="props.t !== PlaylistType.localStorage">
                        <el-button class="playlist_control_btn" color="#f56c6c" plain @click.stop="collectPlaylist">{{isCollect ? '已收藏' : '收藏歌单'}}</el-button>
                    </div>
                </div>
                <div class="playlist_info_right">
                    <div class="playlist_info_right_line">
                        <h3 class="playlist_info_title" :title="playlistInfo.title">{{playlistInfo.title}}</h3>
                    </div>
                    <div class="playlist_info_right_line">
                        <el-avatar class="playlist_info_avatar" :size="36" :src="mediaSrc(playlistInfo.creator.avatarUrl)" :key="playlistInfo.creator.avatarUrl">
                            <template #default>
                                <icon-ep-user-filled />
                            </template>
                        </el-avatar>
                        <span class="playlist_info_nickname">{{ playlistInfo.creator.name }}</span>
                        <span class="playlist_info_createTime">{{ playlistInfo.createTime === 0 ? '' : new Date(playlistInfo.createTime).toLocaleDateString() }}</span>
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
                                    <el-icon v-show="descriptionOpen"><IconEpCaretTop /></el-icon>
                                    <el-icon v-show="!descriptionOpen"><IconEpCaretBottom /></el-icon>
                                </span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="playlist_song" v-show="playlistInfo">
                <Songlist 
                    :songs="songsInfo" 
                    :canDeleteSong="playlistInfo?.type === PlaylistType.localStorage" 
                    :canDrag="playlistInfo?.type === PlaylistType.localStorage"
                    :isStatic="(playlistInfo?.type === PlaylistType.localStorage) || (playlistInfo?.type === PlaylistType.bili)"
                    :loadMoreFunc="getPlaylistTrackWithId.bind(undefined, props.id, props.t, true)"
                    @songOrder="songOrder"
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
    &_control {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        margin: 20px 0;
        &_btn {
            padding: 0 30px;
            color: var(--el-color-danger);
            &:hover {
                color: var(--el-color-white);
            }
            &:active,
            &:focus {
                color: var(--el-button-active-text-color);
            }
            &:focus-visible {
                outline: 2px solid var(--el-button-border-color);
            }
        }
        .full {
            color: var(--el-color-white)
        }
    }
    &_song {
        box-sizing: border-box;
        width: 100%;
        padding: 0 40px;
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
import { getCloudPlaylistDetail, getCloudPlaylistTrack } from '@/assets/cloudApi';
import { getLocalPlaylistDetail, geLocalPlaylistTrack, getBiliAudioForPlaylist, searchMusicInfoWIthBvid } from '@/assets/localApi';
import { mediaSrc } from '@/assets/api';
import { AudioInfoType, MusicInfo, PlaylistInfo, PlaylistType, CustomPlaylist } from '@/interface';
import { formatMusicInfo, formatPlaylistInfo } from '@/utils/format';
import { getAllCustomPlaylist, getCustomPlaylistWithId, localStoragePlaylistEvent, updateCustomPlaylist, savePlaylist, deleteCustomPlaylistWithId } from '@/utils/localStorage';
import { ElMessage } from 'element-plus';


const props = defineProps<{
    id: string 
    t: PlaylistType
}>();
const router = useRouter();


const loading = ref(true);
const loadingError = ref(false);
const loadingSongError = ref(false);
const songsInfo = reactive<MusicInfo[]>([]);
const playlistInfo = ref<PlaylistInfo>();
const descriptionOpen = ref(false);
const limit = ref(1);

const collectLoading = ref(false);
const isCollect = ref(false);


watch([() => props.id, () => props.t], () => {
    songsInfo.length = 0;
    requestPlaylistData();
    let getPlaylist = getCustomPlaylistWithId(props.id);
    isCollect.value = !!getPlaylist;
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
        let customPlaylist = getCustomPlaylistWithId(props.id);
        if (customPlaylist) {
            playlistInfo.value = customPlaylist;
            songsInfo.length = 0;
            songsInfo.push(...customPlaylist.tracks);
        }
        else {
            router.replace('/404');
        }
        loading.value = false;
        return;
    }

    getPlaylistDetailWithId(props.id, props.t);
    // getPlaylistTrackWithId(props.id, props.t);
}
/** 获取歌单信息 */
async function getPlaylistDetailWithId(id: number | string, type: PlaylistType) {
    loading.value = true;
    loadingError.value = false;

    // let [err, result] = type === PlaylistType.local ? await getLocalPlaylistDetail({id}) : await getCloudPlaylistDetail({id});
    let err, result;
    switch(type) {
        case PlaylistType.local: {
            [err, result] = await getLocalPlaylistDetail({id: Number(id)})
            break;
        }
        case PlaylistType.cloud: {
            [err, result] = await getCloudPlaylistDetail({id: Number(id)})
            break;
        }
        case PlaylistType.bili: {
            [err, result] = await getBiliAudioForPlaylist(String(id))
            break;
        }
        default: {
            break;
        }
    }
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
/**
 * 获取歌单内歌曲
 * @param loadMore 是否为加载更多
 */
async function getPlaylistTrackWithId(id: number | string, type: PlaylistType, loadMore: boolean = false) {
    loadingSongError.value = false;

    // let [err, result] = type === PlaylistType.local ? await geLocalPlaylistTrack({id, limit: limit.value}) : await getCloudPlaylistTrack({id, limit: limit.value});
    let err, result;
    switch(type) {
        case PlaylistType.local: {
            [err, result] = await geLocalPlaylistTrack({id: Number(id), limit: limit.value})
            break;
        }
        case PlaylistType.cloud: {
            [err, result] = await getCloudPlaylistTrack({id: Number(id), limit: limit.value})
            break;
        }
        case PlaylistType.bili: {
            [err, result] = await searchMusicInfoWIthBvid(String(id))
            break;
        }
        default: {
            break;
        }
    }

    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data;
        if (!loadMore) {
            songsInfo.length = 0;
        }
        songsInfo.push(...formatMusicInfo(data, type === PlaylistType.cloud ? AudioInfoType.cloud : AudioInfoType.local));
        limit.value += 1;
        return data.length;
    }
    else {
        // 加载 localstorage 歌单的时候不会进行请求，所以 err / result 是 undefined，导致返回0
        if (props.t === PlaylistType.localStorage) {
            return 0;
        }
        loadingSongError.value = true;
        return -1;
    }
}
/** 改变描述的展示状态 */
function switchDescriptionState() {
    descriptionOpen.value = !descriptionOpen.value;
}
/** 本地歌单歌曲排序 */
function songOrder(songs: MusicInfo[]) {
    if (!playlistInfo.value) return;
    if (playlistInfo.value.type !== PlaylistType.localStorage) return;

    let tempPlaylistInfo = { ...playlistInfo.value } as CustomPlaylist;
    tempPlaylistInfo.tracks = songs;
    
    let allPlaylist = getAllCustomPlaylist();
    let index = allPlaylist.findIndex(info => info.id === tempPlaylistInfo.id);
    if (index === -1) return;
    allPlaylist.splice(index, 1, tempPlaylistInfo);
    updateCustomPlaylist(allPlaylist);
}
/** 收藏歌单或取消收藏 */
async function collectPlaylist() {
    if (!playlistInfo.value) return;
    
    if (isCollect.value) {
        // 取消收藏
        deleteCustomPlaylistWithId(props.id);
        isCollect.value = false;
        ElMessage({
            type: 'success',
            message: '歌单取消收藏成功'
        })
    }
    else {
        // 收藏
        if (props.t !== PlaylistType.bili) {
            collectLoading.value = true;
            let state = 0;
            do {
                state = await getPlaylistTrackWithId(props.id, props.t, true);
            } while(state > 0)
            collectLoading.value = false;
        }

        savePlaylist(playlistInfo.value, songsInfo);
        isCollect.value = true;
        ElMessage({
            type: 'success',
            message: '收藏成功'
        })
    }
}
</script>