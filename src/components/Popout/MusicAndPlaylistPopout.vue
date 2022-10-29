 <template>
    <Popout 
        :show="popoutVisible" 
        :position="popoutPosition" 
        @close="closePopout"
    >
        <PopoutItem @click="play">播放</PopoutItem>
        <PopoutItem @click="nextPlay">下一首播放</PopoutItem>
        <PopoutItem topBoder :botBorder="popoutCanDelete" v-if="popoutIsMusic">
            收藏到歌单
            <template #second>
                <PopoutItem botBorder @click="createPlaylist">创建新歌单</PopoutItem>
                <PopoutItem v-for="playlist in customPlaylist" @click="() => collectMusic(playlist.id)">{{playlist.title}}</PopoutItem>
            </template>
        </PopoutItem>
        <PopoutItem topBoder :botBorder="popoutCanDelete" v-if="!popoutIsMusic && !popoutCanDelete" @click="collectPlaylist">收藏</PopoutItem>
        <!-- <PopoutItem v-if="!popoutIsMusic && popoutHoldData?.type === PlaylistType.localStorage" @click="uploadPlaylist">上传just</PopoutItem> -->
        <PopoutItem topBorder v-if="popoutCanDelete && popoutIsMusic" @click="deletefromPlaylist">从歌单中删除</PopoutItem>
        <PopoutItem topBorder v-if="popoutCanDelete && !popoutIsMusic" @click="deletePlaylist">删除歌单</PopoutItem>
    </Popout>
</template>

<style lang="less" scoped>
</style>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { PlaylistInfo, PlaylistType, MusicInfo, CustomPlaylist, AudioInfoType } from '@/interface';
import { getCloudPlaylistTrack } from '@/assets/cloudApi';
import { postCreatePlaylist } from '@/assets/localApi';
import { defaultMusicImg } from "@/assets/api";
import { usePlaylistStore } from '@/store/playinglist';
import { usePlayerStore } from '@/store/player';
import { popoutCloseEvent, usePopoutStore } from '@/store/popout';
import { formatMusicInfo } from '@/utils';
import { getAllCustomPlaylist, getCustomPlaylistWithId, deleteCustomPlaylistWithId, updateCustomPlaylist, localStoragePlaylistEvent, setCustomPlaylist } from '@/utils/localStorage';
import Popout from '@/components/Popout/index.vue';
import PopoutItem from '@/components/PopoutItem/index.vue';


const route = useRoute();
const playlistStore = usePlaylistStore();
const playerStore = usePlayerStore();
const popoutStore = usePopoutStore();
const { 
    createPlaylistVisible,
    popoutVisible,
    popoutPosition,
    popoutHoldData,
    popoutCanDelete,
    popoutIsMusic,
} = storeToRefs(popoutStore);
const { playinglistReplace, addToNextPlay, addToPlaylist } = playlistStore;
const { resetAudioInfo } = playerStore;

const customPlaylist = ref<CustomPlaylist[]>([]);

/** 监听 localstorage 变化时更新 */
onMounted(() => {
    getCustomPlaylist();
    window.addEventListener(localStoragePlaylistEvent, getCustomPlaylist);
});
onUnmounted(() => {
    window.removeEventListener(localStoragePlaylistEvent, getCustomPlaylist);
});

/** 获取用户自定义歌单 */
function getCustomPlaylist() {
    customPlaylist.value = getAllCustomPlaylist();
}
/** 播放列表替换 */
async function play() {
    if (popoutHoldData.value) {
        // 歌曲
        if (popoutIsMusic.value) {
            let result = addToPlaylist(popoutHoldData.value as MusicInfo);
            return;   
        }

        // 歌单
        let data = popoutHoldData.value as PlaylistInfo;
        if (data.type === PlaylistType.localStorage) {
            let playlistInfo = getCustomPlaylistWithId(data.id);
            if (playlistInfo) {
                resetAudioInfo();
                playinglistReplace(playlistInfo.tracks);
                ElMessage({
                    type: 'success',
                    message: '已开始播放'
                });
            }
        }
        else {
            // let [err, result] = data.type === PlaylistType.cloud ? await getCloudPlaylistTrack() : await ();
            let [err, result] = await getCloudPlaylistTrack({id: data.id});
            if (!err && result) {
                resetAudioInfo();
                playinglistReplace(formatMusicInfo(result.data.data, AudioInfoType.cloud));
                ElMessage({
                    type: 'success',
                    message: '已开始播放'
                });
            }
            if (err) {
                ElMessage({
                    type: 'error',
                    message: 'NETWORK TIMEOUT'
                })
            }
        }
    }
}
/** 歌单添加到下一首播放 */
async function nextPlay() {
    if (popoutHoldData.value) {
        // 歌曲
        if (popoutIsMusic.value) {
            let result = addToNextPlay(popoutHoldData.value as MusicInfo);
            return;
        }

        // 歌单
        let data = popoutHoldData.value as PlaylistInfo;
        if (data.type === PlaylistType.localStorage) {
            let playlistInfo = getCustomPlaylistWithId(data.id);
            if (playlistInfo) {
                addToNextPlay(playlistInfo.tracks);
            }
        }
        else {
            // let [err, result] = data.type === PlaylistType.cloud ? await getCloudPlaylistTrack() : await ();
            let [err, result] = await getCloudPlaylistTrack({id: data.id});
            if (!err && result) {
                addToNextPlay(formatMusicInfo(result.data.data, AudioInfoType.cloud));
            }
            if (err) {
                ElMessage({
                    type: 'error',
                    message: 'NETWORK TIMEOUT'
                })
            }
        }
    }
}
/** 删除创建的歌单 */
function deletePlaylist() {
    // console.log(popoutIsMusic.value)
    if (popoutIsMusic.value) return;
    let data = popoutHoldData.value as PlaylistInfo;
    if (!data) return;
    deleteCustomPlaylistWithId(data.id);
}
/** 创建自定义歌单 */
function createPlaylist() {
    createPlaylistVisible.value = true;
}
/**
 * 收藏歌曲至歌单
 * @param playlistid 收藏至的歌单id
 */
function collectMusic(playlistid: number) {
    // 修改了哔哩哔哩的搜索, 现在不用存储在本地再发送, 即不存储再数据库里了, 数据结构要改
    for (let i = 0; i < customPlaylist.value.length; i++) {
        if (customPlaylist.value[i].id === playlistid) {
            let result = customPlaylist.value[i].tracks.find(music => music.id === popoutHoldData.value?.id && music.type == popoutHoldData.value.type);
            if (result) {
                ElMessage({
                    type: 'error',
                    message: '歌单内歌曲重复'
                });
                return;
            }
            customPlaylist.value[i].tracks.unshift(popoutHoldData.value as MusicInfo);
            customPlaylist.value[i].trackCount += 1;
            customPlaylist.value[i].cover = customPlaylist.value[i].tracks[0].cover || defaultMusicImg;
            break;
        }
    }
    updateCustomPlaylist(customPlaylist.value);
    ElMessage({
        type: 'info',
        message: '已收藏到歌单'
    });
}
/** 收藏歌单到 localstorage */
async function collectPlaylist() {
    let data = popoutHoldData.value as PlaylistInfo;
    if (data) {
        // let [err, result] = data.type === PlaylistType.cloud ? await getCloudPlaylistTrack
        let [err, result] = await getCloudPlaylistTrack({id: data.id});
        if (!err && result) {
            setCustomPlaylist(data.title, formatMusicInfo(result.data.data, data.type === PlaylistType.cloud ? AudioInfoType.cloud : AudioInfoType.local))
            ElMessage({
                type: 'success',
                message: '收藏成功'
            });
            return;
        }
    }
    ElMessage({
        type: 'error',
        message: '错误操作, 无法获取数据'
    })
}
/** 从歌单中删除选中的歌曲 */
function deletefromPlaylist() {
    let curPlaylistId = Number(route.query.id);
    for (let i = 0; i < customPlaylist.value.length; i++) {
        if (customPlaylist.value[i].id === curPlaylistId) {
            let index = customPlaylist.value[i].tracks.findIndex(song => song.id === popoutHoldData.value?.id);
            if (index === -1) {
                break;
            }
            customPlaylist.value[i].tracks.splice(index, 1);
            customPlaylist.value[i].trackCount -= 1;
            customPlaylist.value[i].cover = customPlaylist.value[i].tracks[0].cover || defaultMusicImg;
            break;
        }
    }
    updateCustomPlaylist(customPlaylist.value);
    ElMessage({
        type: 'success',
        message: '删除成功'
    });
}
/** 关闭 popout */
function closePopout() {
    (popoutStore.popoutVisible as unknown as boolean) = false;
    window.dispatchEvent(new Event(popoutCloseEvent));
}
/** 将歌单上传值数据库 */
async function uploadPlaylist() {
    // 服务器没有设置用户接口, 不能对上传的歌单进行信息修改, 不能知道是谁上传的, 此功能屏蔽

    if (popoutHoldData.value) {
        const data = popoutHoldData.value as CustomPlaylist;
        // console.log(data)
        let tip = ElMessage({
            type: 'info',
            message: '上传中...',
            duration: 0
        })
        let [err, result] = await postCreatePlaylist({...data, songs: data.tracks, creator_id: data.creator.userId})
        if (!err && result) {
            tip.close();
            ElMessage({
                type: 'success',
                message: result.message
            });
        }
    }
}
</script>

