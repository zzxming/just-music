 <template>
    <Popout 
        :show="popoutVisible" 
        :position="popoutPosition" 
        @close="closePopout"
    >
        <PopoutItem @click="play">播放</PopoutItem>
        <PopoutItem botBorder @click="nextPlay">下一首播放</PopoutItem>
        <PopoutItem :botBorder="popoutCanDelete" v-if="popoutIsMusic">
            收藏到歌单
            <template #second>
                <PopoutItem botBorder @click="createPlaylist">创建新歌单</PopoutItem>
                <PopoutItem v-for="playlist in customPlaylist" @click="() => collectMusic(playlist.id)">{{playlist.title}}</PopoutItem>
            </template>
        </PopoutItem>
        <PopoutItem v-if="popoutCanDelete && popoutIsMusic" @click="deletefromPlaylist">从歌单中删除</PopoutItem>
        <PopoutItem v-if="popoutCanDelete && !popoutIsMusic" @click="deletePlaylist">删除歌单</PopoutItem>
    </Popout>
</template>

<style lang="less" scoped>
</style>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { PlaylistInfo, PlaylistType, MusicInfo, CustomPlaylist } from '@/interface';
import { getCloudPlaylistTrack } from '@/assets/cloudApi';
import { usePlaylistStore } from '@/store/playinglist';
import { usePlayerStore } from '@/store/player';
import { popoutCloseEvent, usePopoutStore } from '@/store/popout';
import { getAllCustomPlaylist, getCustomPlaylistWithId, deleteCustomPlaylistWithId, updateCustomPlaylist, localStoragePlaylistEvent } from '@/utils/localStorage';
import Popout, { PopoutPosition } from '@/components/Popout/index.vue';
import PopoutItem from '@/components/PopoutItem/index.vue';
import { formatMusicInfo } from '@/utils';
import { useRoute } from 'vue-router';


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
            }
        }
        else {
            // let [err, result] = data.type === PlaylistType.cloud ? await getCloudPlaylistTrack() : await ();
            let [err, result] = await getCloudPlaylistTrack({id: data.id});
            if (!err && result) {
                resetAudioInfo();
                playinglistReplace(formatMusicInfo(result.data.data));
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
                addToNextPlay(formatMusicInfo(result.data.data));
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
            break;
        }
    }
    updateCustomPlaylist(customPlaylist.value);
    ElMessage({
        type: 'info',
        message: '已收藏到歌单'
    });
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
    console.log('wS');
    (popoutStore.popoutVisible as unknown as boolean) = false;
    window.dispatchEvent(new Event(popoutCloseEvent));
}

</script>

