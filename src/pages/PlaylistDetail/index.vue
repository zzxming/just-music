<template>
    <div class="playlist">
        <LoadingErrorTip :isError="!loading && loadingError" :requestFunc="requestPlaylistData" />
        <!-- 请求失败的时候处理 songlist, 变成重新请求 -->
        <div v-loading="loading && !playlistInfo" class="playlist_wrapper">
            <div v-if="playlistInfo" class="playlist_info">
                <div class="playlist_info_left">
                    <div class="playlist_info_cover">
                        <img :src="playlistInfo.coverImgUrl" alt="歌单封面" />
                    </div>
                </div>
                <div class="playlist_info_right">
                    <div class="playlist_info_right_line">
                        <h3 class="playlist_info_title">{{playlistInfo.name}}</h3>
                    </div>
                    <div class="playlist_info_right_line">
                        <el-avatar class="playlist_info_avatar" :size="28" :icon="UserFilled" :src="playlistInfo.creator.avatarUrl" />
                        <span class="playlist_info_nickname">{{playlistInfo.creator.nickname}}</span>
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
                            <span class="playlist_info_description-title" v-show="!descriptionOpen">{{playlistInfo.description}}</span>
                            <span class="playlist_info_description-full" v-show="descriptionOpen">{{playlistInfo.description}}</span>
                            <span class="playlist_info_description-arrow" @click="switchDescriptionState">
                                <el-icon v-show="descriptionOpen"><CaretTop /></el-icon>
                                <el-icon v-show="!descriptionOpen"><CaretBottom /></el-icon>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="playlist_song" v-loading="loadingSong" v-show="playlistInfo">
                <Songlist v-if="!loadingSong && !loadingSongError" :songs="songsInfo" />
                <LoadingErrorTip :style="{alignSelf: 'center'}" :isError="!loadingSong && loadingSongError" :requestFunc="getPlaylistTrackWithId.bind(undefined, props.id, props.t)" />
            </div>
        </div>
    </div>
</template>

<style lang="less" setup>
.playlist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100vw;
    min-height: 100vh;
    &_wrapper {
        align-self: center;
        width: 100%;
        min-height: 100vh;
    }
    &_info {
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        padding: 40px 60px 20px;
        font-size: 14px;
        &_left {
            align-self: flex-start;
            width: 180px;
        }
        &_right {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            width: calc(100% - 180px - 20px);
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
            img {
                width: 100%;
            }
        }
        &_title {
            font-size: 26px;
            margin: 0;
            line-height: 40px;
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
            &-full {

            }
        }
    }
    &_song {
        box-sizing: border-box;
        margin-bottom: 50px;
        width: 100%;
        min-height: calc(100vh - 40px - 20px - 180px - 50px);
    }
}
.error {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media screen and (max-width: 550px) {
    .playlist {
        &_info {
            justify-content: space-between;
            padding: 40px 20px 20px;
            line-height: 20px;
            font-size: 12px;
            &_left {
                width: 120px;
            }
            &_right {
                width: calc(100% - 120px - 20px);
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
    }
}
</style>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { UserFilled } from '@element-plus/icons-vue';
import { getLocalMusicInfoWithId } from '@/assets/localApi';
import { getCloudPlaylistDetail, getCloudPlaylistTrack } from '@/assets/cloudApi';
import { AudioInfoType, MusicInfo, CloudPlaylist } from '@/interface';
import { usePlayerStore } from '@/store/player';
import { formatMusicInfo } from '@/utils';
import LoadingErrorTip from '@/components/LoadingErrorTip/index.vue';
import Songlist from '@/components/Songlist/index.vue';


// 本地歌曲的歌单还没有做


const props = defineProps<{
    id: number
    t: AudioInfoType
}>();
const playerStore = usePlayerStore();
const {  } = storeToRefs(playerStore);
const {  } = playerStore;


const loading = ref(false);
const loadingSong = ref(false);
const loadingError = ref(false);
const loadingSongError = ref(false);
const songsInfo = ref<MusicInfo[]>([]);
const playlistInfo = ref<CloudPlaylist>();
const descriptionOpen = ref(false);


onMounted(() => {
    requestPlaylistData();

    // getPlaylistDetailWithId(1, AudioInfoType.local);
    // getPlaylistDetailWithId(569105662, AudioInfoType.cloud);
    // getCloudMusicInfoWithId({ids:569105662})
});

function requestPlaylistData() {
    getPlaylistDetailWithId(props.id, props.t);
    getPlaylistTrackWithId(props.id, props.t);
}
/** 获取歌单信息 */
async function getPlaylistDetailWithId(id: number, type: AudioInfoType) {
    loading.value = true;
    loadingError.value = false;
    // // let [err, result] = type === AudioInfoType.local ? await ({id}) : await getCloudPlaylistDetail({id});
    let [err, result] = await getCloudPlaylistDetail({id});
    loading.value = false;
        // loadingError.value = true;
    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data;
        playlistInfo.value = data;
    }
    else {
        loadingError.value = true;
    }
}
/** 获取歌单内歌曲 */
async function getPlaylistTrackWithId(id: number, type: AudioInfoType) {
    loadingSong.value = true;
    loadingSongError.value = false;
    let [err, result] = await getCloudPlaylistTrack({id});
    loadingSong.value = false;
        // loadingSongError.value = true;
    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data;
        
        let audiolist = data.map(item => formatMusicInfo({
            type: AudioInfoType.cloud,
            ...item
        }));
        // console.log(audiolist)
        if (audiolist) {
            songsInfo.value = audiolist;
        }
    }
    else {
        loadingSongError.value = true;
    }
}

function switchDescriptionState() {
    descriptionOpen.value = !descriptionOpen.value;
}

</script>