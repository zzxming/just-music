<template>
    <ul class="playlist">
        <div v-if="playlist.length < 1" class="playlist_tip">你还没有创建过歌单哦</div>
        <li v-for="info in playlist">
            <div 
                class="playlist_item" 
                @click="() => leftClick(info.id, info.type)"
                @contextmenu="(e) => rightClick(e, info)"
            >
                <span class="playlist_title">{{ info.title }}</span>
            </div>
        </li>
    </ul>
</template>


<style lang="less" scoped>
.playlist {
    &_item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 30px;
        padding: 4px 12px;
        border-radius: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            background-color: var(--el-color-info-light-9);
        }
    }
    &_tip {
        color: var(--el-color-info);
        text-align: center;
    }
}
</style>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlaylistInfo, PlaylistType } from '@/interface';
import { jointQuery } from '@/assets/api';
import { getAllCustomPlaylist, localStoragePlaylistEvent } from '@/utils/localStorage';
import { usePopoutStore, popoutCloseEvent } from '@/store/popout';

const router = useRouter();
const { canOperate } = withDefaults(defineProps<{
    canOperate?: boolean
}>(), {
    canOperate: true
});



const popoutStore = usePopoutStore();
const { setPopoutState } = popoutStore;

const playlist = ref<PlaylistInfo[]>([]);

onMounted(() => {
    updatePlaylist();
    window.addEventListener(localStoragePlaylistEvent, updatePlaylist);
});
onUnmounted(() => {
    window.removeEventListener(localStoragePlaylistEvent, updatePlaylist);
});

function updatePlaylist() {
    playlist.value = getAllCustomPlaylist();
}



/** 进入查看歌单详细信息 */
function leftClick(id: number, t:PlaylistType) {
    router.push(jointQuery(`/playlist/detail`, { id, t }));
    (popoutStore.popoutVisible as unknown as boolean) = false;
    window.dispatchEvent(new Event(popoutCloseEvent));
}
/** 右键点击操作歌单 */
function rightClick(event: MouseEvent, info: PlaylistInfo) {
    if (!canOperate) return;
    // console.log(event)
    event.preventDefault();
    setPopoutState({
        popoutHoldData: info,
        popoutVisible: true,
        popoutCanDelete: info.type === PlaylistType.localStorage,
        popoutIsMusic: false,
        popoutPosition: {
            left: event.pageX,
            top: event.pageY,
        }
    });
}
</script>

