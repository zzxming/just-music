 <template>
    <Popout 
        :show="popoutVisible" 
        :position="popoutPosition" 
        @close="() => closePopout(false)"
        @click="() => closePopout(true)"
    >
        <PopoutItem @click="play">播放</PopoutItem>
        <PopoutItem @click="nextPlay">下一首播放</PopoutItem>
        <PopoutItem topBoder :botBorder="popoutCanDelete" v-if="popoutIsMusic">
            收藏到歌单
            <template #second>
                <CollectToPlaylistPopout />
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
import { getCustomPlaylistWithId, deleteCustomPlaylistWithId, getAllCustomPlaylist, updateCustomPlaylist, localStoragePlaylistEvent, setCustomPlaylist } from '@/utils/localStorage';
import Popout from '@/components/Popout/index.vue';
import CollectToPlaylistPopout from '@/components/Popout/CollectToPlaylistPopout.vue';
import PopoutItem from '@/components/PopoutItem/index.vue';


const route = useRoute();
const playlistStore = usePlaylistStore();
const playerStore = usePlayerStore();
const popoutStore = usePopoutStore();
const { 
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

            let musics = await getAllMusicInCloudPlaylist()
            .catch(err => {
                ElMessage({
                    type: 'error',
                    message: 'NETWORK TIMEOUT'
                })
            });
            if(musics) {
                console.log(musics)
                resetAudioInfo();
                playinglistReplace(musics);
                ElMessage({
                    type: 'success',
                    message: '已开始播放'
                });
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

            let musics = await getAllMusicInCloudPlaylist()
            .catch(err => {
                ElMessage({
                    type: 'error',
                    message: 'NETWORK TIMEOUT'
                })
            });
            if(musics) {
                addToNextPlay(musics);
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
    ElMessage({
        type: 'success',
        message: '删除成功'
    });
}
/** 收藏歌单到 localstorage */
async function collectPlaylist() {
    let data = popoutHoldData.value as PlaylistInfo;
    if (data) {
        // let [err, result] = data.type === PlaylistType.cloud ? await getCloudPlaylistTrack
            
        let musics = await getAllMusicInCloudPlaylist()
        .catch(err => {
            ElMessage({
                type: 'error',
                message: '错误操作, 无法获取数据'
            })
        });
        if(musics) {
            setCustomPlaylist(data.title, musics);
            ElMessage({
                type: 'success',
                message: '收藏成功'
            });
        }
    }
}
/** 从歌单中删除选中的歌曲 */
function deletefromPlaylist() {
    let curPlaylistId = Number(route.query.id);
    let templist = [...customPlaylist.value];
    for (let i = 0; i < templist.length; i++) {
        if (templist[i].id === curPlaylistId) {
            let index = templist[i].tracks.findIndex(song => song.id === popoutHoldData.value?.id);
            if (index === -1) {
                break;
            }
            templist[i].tracks.splice(index, 1);
            templist[i].trackCount -= 1;
            templist[i].cover = templist[i].tracks[0].cover || defaultMusicImg;
            break;
        }
    }
    updateCustomPlaylist(templist);
    ElMessage({
        type: 'success',
        message: '删除成功'
    });
}
/** 关闭 popout */
function closePopout(isItem: boolean) {
    popoutStore.popoutVisible = false;
    window.dispatchEvent(new CustomEvent(popoutCloseEvent, { detail: { isItem } }));
}
/** 获取网易云歌单内所有歌曲并格式化为 MusicInfo 再返回 */
async function getAllMusicInCloudPlaylist(): Promise<MusicInfo[]> {
    if (!popoutHoldData.value) {
        return Promise.reject([]);
    }
    let data = popoutHoldData.value as PlaylistInfo;
    let waitPromise = [];
    for (let i = 0; i < data.trackCount; i += 500) {
        waitPromise.push(getCloudPlaylistTrack({id: data.id, limit: i + 1}));
    }

    ElMessage({
        message: '请稍候',
        duration: 0
    })
    return await Promise.all(waitPromise)
    .then(res => {
        let musicInfo: MusicInfo[] = [];
        res.map(([err, result]) => {
            if (!err && result) {
                musicInfo.push(...formatMusicInfo(result.data.data, data.type === PlaylistType.cloud ? AudioInfoType.cloud : AudioInfoType.local))
            }
        })
        return musicInfo
    })
    .catch(err => {
        console.log(err)
        // ElMessage({
        //     type: 'error',
        //     message: 'NETWORK TIMEOUT'
        // })
        return []
    })
    .finally(() => {
        ElMessage.closeAll();
    });
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

