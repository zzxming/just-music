<template>
    <div class="songlist">
        <div class="songlist_header" v-if="!isSmallScreen">
            <div class="songlist_index"></div>
            <div class="songlist_title">标题</div>
            <div class="songlist_singer" v-if="!isSmallScreen">歌手</div>
            <div class="songlist_duration" v-if="!isSmallScreen">时间</div>
            <div class="songlist_option" v-if="isSmallScreen"></div>
        </div>
        <div class="songlist_body">
            <div 
                v-for="(song, index) in songs" 
                :class="`songlist_item ${index % 2 === 0 ? 'stripe' : ''} ${activeId === song.id && activeCid === song.cid ? 'active' : ''} ${song.st === -200 ? 'disable' : ''}`"
                :draggable="canDrag"
                @click="(e) => isSmallScreen && playSong(e, song)"
                @dblclick="(e) => playSong(e, song)"
                @contextmenu="(e) => showPopbox(e, song)"
                @dragstart="(e) => dragstart(e, index)"
                @dragleave="(e) => dragleave(e)"
                @dragover="(e) => dragover(e)"
                @drop="(e) => drop(e, index)"
            >
                <div class="songlist_index">
                    <span class="songlist_index-text">{{ twoDigitStr(index + 1) }}</span>
                    <span class="el-icon songlist_index-icon playing"><IconCusPlaying /></span>
                </div>
                <div class="songlist_title">
                    <div class="songlist_title-title">
                        <span class="songlist_title-text" :title="song.title">{{song.title}}</span>
                        <span v-if="song.fee === 1" class="el-icon songlist_title-icon"><IconCusVip /></span>
                    </div>
                    <div v-if="isSmallScreen" class="songlist_title-singer" :title="song.singers.map((s: Singer) => s.name).join(' / ')">
                        <span class="songlist_singer">
                            <template v-for="(singer, index) in song.singers">
                                <span class="songlist_singer_item">{{ singer.name }}</span>
                                {{ index === song.singers.length - 1 ? '' : '&nbsp;/&nbsp;'}}
                            </template>
                        </span>
                    </div>
                </div>
                <div class="songlist_singer" v-if="!isSmallScreen" :title="song.singers.map((s: Singer) => s.name).join(' / ')">
                    <span class="songlist_singer">
                        <template v-for="(singer, index) in song.singers">
                            <span class="songlist_singer_item">{{ singer.name }}</span>
                            {{ index === song.singers.length - 1 ? '' : '&nbsp;/&nbsp;'}}
                        </template>
                    </span>
                </div>
                <div class="songlist_duration" v-if="!isSmallScreen">
                    <span class="songlist_duration">{{ formatAudioTime(song.duration / 1000) }}</span>
                </div>
                <div class="songlist_option" v-if="isSmallScreen">
                    <el-icon class="" @click.stop="(e: MouseEvent) => showPopbox(e, song)"><IconAntDesignMoreOutlined /></el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.songlist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
    border-radius: 10px;
    overflow: hidden;
    cursor: default;
    background-color: var(--el-bg-color-overlay);
    &_header,
    &_item {
        display: grid;
        align-items: center;
        justify-content: center;
        grid-template-areas: 'index title singer duration option';
        grid-template-columns: minmax(auto, 1fr) 6fr 4fr minmax(auto, 1fr);
        grid-gap: 10px;
        width: 100%;
        height: 36px;
        user-select: none;
    }
    &_body {
        width: 100%;
    }
    &_header {
        .textOverflowEllipsis();
        color: var(--el-color-info);
        font-size: 14px;
        .songlist_duration {
            margin-right: 24px;
        }
    }
    &_item {
        position: relative;
        height: 40px;
        font-size: 16px;
        color: var(--el-color-info-light-3);
        font-weight: lighter;
        background-color: var(--el-bg-color);
        &.stripe {
            background-color: var(--el-color-info-light-9);
        }
        &.active {
            background-color: var(--el-color-info-light-7);
            .songlist {
                &_index {
                    color: var(--el-color-danger);
                    &-text {
                        display: none;
                    }
                    &-icon.playing {
                        display: block;
                    }
                }
                &_title {
                    color: var(--el-color-danger);
                }
            }
        }
        &.disable {
            .songlist_title {
                color: var(--el-color-info-light-5);
            }
        }
        &:hover {
            background-color: var(--el-color-info-light-8);
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
    &_index,
    &_title,
    &_singer,
    &_duration,
    &_option {
        margin-right: 6px;
        padding: 0 4px;
    }
    &_index {
        grid-area: index;
        box-sizing: border-box;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &-icon {
            display: none;
        }
    }
    &_title {
        .textOverflowEllipsis();
        grid-area: title;
        color: var(--el-text-color-primary);
        &-title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        &-singer {
            color: var(--el-color-info-light-3);
            font-size: 14px;
        }
        &-text {
            .textOverflowEllipsis();
        }
        &-icon {
            margin-left: 4px;
            font-size: 30px;
        }
    }
    &_singer {
        .textOverflowEllipsis();
        grid-area: singer;
    }
    &_duration {
        grid-area: duration;
    }
    &_option {
        display: flex;
        grid-area: option;
        font-size: 24px;
        cursor: pointer;
    }
    &_empty {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 60px 0;
        color: var(--el-color-info-light-3);
    }
}

@media screen and (max-width: 550px) {
    .songlist {
        &_header,
        &_item {
            grid-template-areas: 'index title option';
            grid-template-columns: minmax(auto, 1fr) 6fr minmax(auto, 1fr);
        }
        &_item {
            height: 64px;
        }
    }
}

.textOverflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>


<script lang="ts" setup>
import { AudioInfoType, MusicInfo, Singer } from '@/interface';
import { usePlayerStore, usePlaylistStore, usePopoutStore } from '@/store';
import { formatAudioTime, twoDigitStr } from '@/utils/format';
import { useIsSmallScreen } from '@/hooks';


const router = useRouter();
const isSmallScreen = useIsSmallScreen();
const playerStore = usePlayerStore();
const playlistStore = usePlaylistStore();
const popoutStore = usePopoutStore();
const { audio, audioInfo }  = storeToRefs(playerStore);
const { setAudioInfo } = playerStore;
const { playinglistReplace } = playlistStore;
const { setPopoutState } = popoutStore;

const props = withDefaults(
    defineProps<{
        songs: MusicInfo[]
        emptyText?: string
        canDeleteSong?: boolean
        canDrag?: boolean
    }>(), {
        emptyText: '这里什么都没有',
        canDeleteSong: false,
        canDrag: false,
    }
);

const emit = defineEmits<{
    (e: 'songOrder', song: MusicInfo[]): void
}>()

const activeId = ref(audioInfo.value.id);
const activeCid = ref(audioInfo.value.cid);

// 当前播放变化监听
watch(audioInfo, (val) => {
    activeId.value = val.id
    activeCid.value = val.cid
});

/** 双击播放歌曲 */
async function playSong(event: MouseEvent, song: MusicInfo) {
    if (audioInfo.value.id !== song.id || (audioInfo.value.type === AudioInfoType.bili && audioInfo.value.cid !== song.cid)) {
        activeId.value = song.id;
        activeId.value = song.cid
        setAudioInfo(song);
        playinglistReplace(props.songs);
        audio.value?.load();
        router.push('/player');
    }
}
/** 展示弹出框 */
function showPopbox(event: MouseEvent, song: MusicInfo) {
    // console.log(event)
    event.preventDefault();

    setPopoutState({
        popoutVisible: true,
        popoutPosition: {
            left: event.pageX,
            top: event.pageY,
        },
        popoutHoldData: song,
        popoutIsMusic: true,
        popoutCanDelete: props.canDeleteSong
    })
}


function dragstart(e: DragEvent, index: number) {
    if (!props.canDrag) return;
    e.dataTransfer?.setData('data', JSON.stringify(index));
}
function dragleave(e: DragEvent) {
    if (!props.canDrag) return;
    if (e.target) {
        (e.target as HTMLElement).classList.remove('top');
        (e.target as HTMLElement).classList.remove('bottom');
    }
}
function dragover(e: DragEvent) {
    if (!props.canDrag) return;
    e.preventDefault();
    // console.log(e)
    let el = e.composedPath().find(el => Array.from((el as HTMLElement).classList).includes('songlist_item')) as HTMLElement;
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
function drop(e: DragEvent, index: number) {
    if (!props.canDrag) return;
    let el = e.composedPath().find(el => Array.from((el as HTMLElement).classList).includes('songlist_item')) as HTMLElement;
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
    let newList = [...props.songs];
    let moveData = newList[dataIndex];
    newList.splice(toIndex, 0, moveData);
    if (toIndex < dataIndex) {
        newList.splice(dataIndex + 1, 1);
    }
    else {
        newList.splice(dataIndex, 1);
    }

    emit('songOrder', newList);

    el.classList.remove('top');
    el.classList.remove('bottom');
}
</script>

