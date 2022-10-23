<template>
    <div class="songlist">
        <el-table 
            class="songlist_large"
            :data="songs" 
            stripe 
            style="width: 100%" 
            :empty-text="emptyText"
            :row-class-name="tableRowClass"
            :row-key="(row: MusicInfo) => row.id"
            @row-contextmenu="showPopbox"
            @row-dblclick="playSong"
        >
            <el-table-column prop="index" :min-width="smallScreen ? '' : '50px'" :width="smallScreen ? '58px' : ''">
                <template #default="scope">
                    <div class="songlist_column index">
                        <span class="songlist_index">{{ twoDigitStr(scope.$index + 1) }}</span>
                        <span class="el-icon songlist_playing"><Playing /></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="180px">
                <template #default="scope">
                    <div class="songlist_column_incell">
                        <div class="songlist_column title">
                            <div class="songlist_title">
                                <span :title="scope.row.title">{{scope.row.title}}</span>
                            </div>
                            <span v-if="scope.row.fee === 1" class="el-icon songlist_title-icon"><Vip /></span>
                        </div>
                        <div v-if="smallScreen" class="songlist_column singer" :title="scope.row.singers.map((s: Singer) => s.name).join(' / ')">
                            <span class="songlist_singer">
                                <template v-for="(singer, index) in scope.row.singers">
                                    <span class="songlist_singer_item">{{ singer.name }}</span>
                                    {{ index === scope.row.singers.length - 1 ? '' : '&nbsp;/&nbsp;'}}
                                </template>
                            </span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="singers" label="歌手" min-width="120px" v-if="!smallScreen">
                <template #default="scope">
                    <div class="songlist_column singer" :title="scope.row.singers.map((s: Singer) => s.name).join(' / ')">
                        <span class="songlist_singer">
                            <template v-for="(singer, index) in scope.row.singers">
                                <span class="songlist_singer_item">{{ singer.name }}</span>
                                {{ index === scope.row.singers.length - 1 ? '' : '&nbsp;/&nbsp;'}}
                            </template>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="duration" label="时间" min-width="60px">
                <template #default="scope">
                    <div class="songlist_column duration">
                        <span class="songlist_duration">{{formatAudioTime(scope.row.duration / 1000)}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <Popout :show="popoutVisible" :position="popoutPosition" @close="closePopout">
        <PopoutItem @click="play">播放</PopoutItem>
        <PopoutItem @click="nextPlay">下一首播放</PopoutItem>
    </Popout>
</template>


<style lang="less" scoped>
.textOverflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.songlist {
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 50px;
    cursor: default;
    .active {
        .songlist_column.index {
            color: var(--el-text-color-primary);
        }
        .songlist_index {
            display: none;
        }
        .songlist_playing {
            display: block;
        }
        .songlist_title {
            color: var(--el-text-color-primary);
        }
    }
    &_index {
        color: var(--el-color-info-light-3);
    }
    &_playing {
        display: none;
    }
    &_column:extend(.textOverflowEllipsis) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &_incell {
            display: flex;
            flex-direction: column;
            .singer {
                font-size: 12px;
            }
        }
        &.index {
            color: var(--el-color-info-light-3);
        }
        &.title {
            
        }
        &.singer {

        }
    }
    &_title:extend(.textOverflowEllipsis) {
        color: var(--el-text-color-regular);
        &-icon {
            width: 30px;
            font-size: 30px;
            color: var(--el-color-info);
        }
    }
    &_singer:extend(.textOverflowEllipsis) {
        &_item {
            color: var(--el-color-info);
            cursor: pointer;
            &:hover {
                color: var(--el-text-color-primary);
            }
        }
    }
    &_duration {
    }
}

:deep(.el-table--striped .el-table__body tr.el-table__row.active td.el-table__cell) {
    background-color: var(--el-color-danger-light-7);
}
:deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
    background: var(--el-color-danger-light-8);
    color: var(--el-color-info);
}


@media screen and (max-width: 550px) {
    .songlist {
        &_column {
            &.title {
                font-size: 18px;
            }
        }
    }
}
</style>
<style lang="less">
.songlist {
    &_item {
        &.active {
            background-color: var(--el-color-danger-light-7);
        }
    }
}
</style>


<script lang="ts" setup>
import { TableColumn } from 'element-plus/es/components/table/src/table-column/defaults';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue'
import Vip from '@/assets/iconfont/vip.vue'
import Playing from '@/assets/iconfont/playing.vue';
import { MusicInfo, Singer } from '@/interface'
import { usePlayerStore } from '@/store/player';
import { usePlaylistStore } from '@/store/playlist';
import { formatAudioTime, twoDigitStr } from '@/utils';
import Popout, { PopoutPosition } from '@/components/Popout/index.vue';
import PopoutItem from '@/components/PopoutItem/index.vue';
import { ElMessage } from 'element-plus';
import { useIsSmallScreen } from '@/hooks'


const smallScreen = useIsSmallScreen();
const playerStore = usePlayerStore();
const playlistStore = usePlaylistStore();
const { audioInfo }  = storeToRefs(playerStore);
const { setAudioInfo } = playerStore;
const { playinglistReplace, addToPlaylist, addToNextPlay } = playlistStore;

const { songs, emptyText } = withDefaults(defineProps<{
    songs: MusicInfo[]
    emptyText?: string
}>(), {
    emptyText: '这里什么都没有',
});

const activeId = ref(audioInfo.value.id);
const popoutVisible = ref(false);
const popoutPosition = ref<PopoutPosition>({
    left: 0,
    top: 0
});
const popoutHoldData = ref<MusicInfo>();        // 弹出框相关的数据

// 当前播放变化监听
watch(audioInfo, () => activeId.value = audioInfo.value.id)


/** 双击播放歌曲 */
async function playSong(row: MusicInfo, column: TableColumn<MusicInfo>, event: MouseEvent) {
    // console.log(column)
    // console.log(row)
    if (audioInfo.value.id !== row.id) {
        setAudioInfo(row);
        ElMessage({
            type: 'success',
            message: '已开始播放'
        });
        activeId.value = row.id;
        playinglistReplace(songs);
    }
}
/** 激活的歌曲行 */
function tableRowClass(data: {row: MusicInfo}) {
    return data.row.id === activeId.value ? 'songlist_item active' : 'songlist_item'
}
/** 展示弹出框 */
function showPopbox(row: MusicInfo, column: TableColumn<MusicInfo>, event: MouseEvent) {
    // console.log(event)
    event.preventDefault();
    popoutVisible.value = true;
    popoutPosition.value = {
        left: event.pageX,
        top: event.pageY,
    }
    popoutHoldData.value = row;
}
/** 关闭弹出框 */
function closePopout() {
    popoutVisible.value = false;
}
/** 弹出框点击播放 */
function play() {
    if (popoutHoldData.value) {
        let result = addToPlaylist(popoutHoldData.value);
        if (result) {
            setAudioInfo(popoutHoldData.value);
            ElMessage({
                type: 'success',
                message: '已开始播放'
            });
        }
        else {
            ElMessage({
                type: 'error',
                message: '添加失败'
            });
        }
    }
}
/** 弹出框点击下一首播放 */
function nextPlay() {
    if (popoutHoldData.value) {
        let result = addToNextPlay(popoutHoldData.value);
        if (result) {
            ElMessage({
                type: 'success',
                message: '已添加到播放列表'
            });
        }
        else {
            ElMessage({
                type: 'error',
                message: '添加失败'
            });
        }
    }
}
</script>

