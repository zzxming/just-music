<template>
    <ul class="playlist">
        <div v-if="playlist.length < 1" class="playlist_tip">你还没有创建过歌单哦</div>
        <li v-for="(info, index) in playlist">
            <div 
                class="playlist_item" 
                draggable="true"
                @click="() => leftClick(info.id, info.type)"
                @contextmenu="(e) => rightClick(e, info)"
                @dragstart="(e) => dragstart(e, info, index)"
                @dragleave="(e) => dragleave(e, info, index)"
                @dragover="(e) => dragover(e, info, index)"
                @drop="(e) => drop(e, info, index)"
            >
                <span class="playlist_title">{{ info.title }}</span>
            </div>
        </li>
    </ul>
</template>


<style lang="less" scoped>
.playlist {
    &_item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 30px;
        padding: 4px 12px;
        border-radius: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
            background-color: var(--el-color-info-light-9);
        }
        &.top::after {
            position: absolute;
            top: 0;
            left: 50%;
            margin-left: -48%;
            content: '';
            display: block;
            width: 96%;
            height: 1px;
            background-color: var(--el-color-danger);
        }
        &.bottom::before {
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -48%;
            content: '';
            display: block;
            width: 96%;
            height: 1px;
            background-color: var(--el-color-danger);
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
import { CustomPlaylist, PlaylistType } from '@/interface';
import { jointQuery } from '@/assets/api';
import { getAllCustomPlaylist, localStoragePlaylistEvent, updateCustomPlaylist } from '@/utils/localStorage';
import { usePopoutStore, popoutCloseEvent } from '@/store/popout';

const router = useRouter();
const { canOperate } = withDefaults(defineProps<{
    canOperate?: boolean
}>(), {
    canOperate: true
});



const popoutStore = usePopoutStore();
const { setPopoutState } = popoutStore;

const playlist = ref<CustomPlaylist[]>([]);

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
    window.dispatchEvent(new CustomEvent(popoutCloseEvent, { detail: { isItem: true } }));
}
/** 右键点击操作歌单 */
function rightClick(event: MouseEvent, info: CustomPlaylist) {
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

function dragstart(e: DragEvent, data: CustomPlaylist, index: number) {
    e.dataTransfer?.setData('data', JSON.stringify(index));
}
function dragleave(e: DragEvent, data: CustomPlaylist, index: number) {
    if (e.target) {
        (e.target as HTMLElement).classList.remove('top');
        (e.target as HTMLElement).classList.remove('bottom');
    }
}
function dragover(e: DragEvent, data: CustomPlaylist, index: number) {
    e.preventDefault();
    if (e.target) {
        let el = e.target as HTMLElement;
        let h = el.offsetHeight;
        let top = el.offsetTop;
        let pageY = e.pageY;
        if (pageY < top + h / 2) {
            el.classList.add('top');
            el.classList.remove('bottom');
        }
        else {
            el.classList.remove('top');
            el.classList.add('bottom');
        }
    }
}
function drop(e: DragEvent, data: CustomPlaylist, index: number) {
    if (e.target) {
        let el = e.target as HTMLElement;
        let classList = Array.from(el.classList);
        let dataIndex = JSON.parse(e.dataTransfer?.getData('data') as string);
        let toIndex = index;

        if (classList.includes('bottom')) toIndex += 1;
        if (toIndex < 0) toIndex = 0;
        if (toIndex === dataIndex) {
            el.classList.remove('top');
            el.classList.remove('bottom');
            return;
        }
        let newList = [...playlist.value];
        let moveData = newList[dataIndex];
        newList.splice(toIndex, 0, moveData);
        if (toIndex < dataIndex) {
            newList.splice(dataIndex + 1, 1);
        }
        else {
            newList.splice(dataIndex, 1);
        }
        updateCustomPlaylist(newList)

        el.classList.remove('top');
        el.classList.remove('bottom');
    }
}
</script>

