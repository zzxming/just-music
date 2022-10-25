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
    <MusicAndPlaylistPopout 
        :show="popoutVisible" 
        :position="popoutPosition" 
        :holdData="popoutHoldData"
        @click="() => emit('clickItem')" 
        @close="popoutVisible = false"
    />
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
import { PopoutPosition } from '@/components/Popout/index.vue';
import MusicAndPlaylistPopout from '@/components/Popout/MusicAndPlaylistPopout.vue';

const router = useRouter();
const { canOperate } = withDefaults(defineProps<{
    canOperate?: boolean
}>(), {
    canOperate: true
});
const emit = defineEmits<{
    (event: 'clickItem'): void
}>();


const popoutVisible = ref(false);
const popoutPosition = ref<PopoutPosition>({
    left: 0,
    top: 0
});
const popoutHoldData = ref<PlaylistInfo>();        // 弹出框相关的数据


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
    emit('clickItem');
}
/** 右键点击操作歌单 */
function rightClick(event: MouseEvent, info: PlaylistInfo) {
    if (!canOperate) return;
    // console.log(event)
    event.preventDefault();
    popoutPosition.value = {
        left: event.pageX,
        top: event.pageY,
    }
    popoutHoldData.value = info;
    popoutVisible.value = true;
}

</script>

