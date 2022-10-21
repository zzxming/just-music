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
            @row-dblclick="playSong"
        >
            <el-table-column prop="index" :min-width="smallScreen ? '' : '50px'" :width="smallScreen ? '58px' : ''">
                <template #default="scope">
                    <div class="songlist_column index">
                        <span class="songlist_index">{{ twoDigitStr(scope.$index + 1) }}</span>
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
        .songlist_index {
            color: var(--el-text-color-primary);
        }
        .songlist_title {
            color: var(--el-text-color-primary);
        }
    }
    &_index {
        color: var(--el-color-info-light-3);
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
import { onMounted, onUnmounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import Vip from '@/assets/iconfont/vip.vue'
import { MusicInfo, Singer } from '@/interface'
import { usePlayerStore } from '@/store/player';
import { formatAudioTime, twoDigitStr } from '@/utils';


const playerStore = usePlayerStore();
const { audioInfo }  = storeToRefs(playerStore);
const { setAudioInfo } = playerStore;
const { songs, emptyText } = withDefaults(defineProps<{
    songs: MusicInfo[]
    emptyText?: string
}>(), {
    emptyText: '这里什么都没有',
});

const activeId = ref(audioInfo.value.id);
const smallScreen = ref(false);

onMounted(() => {
    calculateTable();
    window.addEventListener('resize', calculateTable)
});
onUnmounted(() => {
    window.removeEventListener('resize', calculateTable)
});


/** 计算视口宽度是否小屏 */
function calculateTable() {
    smallScreen.value = window.innerWidth < 550;
}
/** 双击播放歌曲 */
async function playSong(row: MusicInfo, column: TableColumn<MusicInfo>, event: MouseEvent) {
    // console.log(column)
    console.log(row)
    if (audioInfo.value.id !== row.id) {
        if (row.fee === 1) {
            ElMessageBox.alert(`正在试听 ${row.title} 歌曲片段`, '', {
                center: true
            })
        }
        console.log(row)
        setAudioInfo(row);
        activeId.value = row.id;
    }
}
/** 激活的歌曲行 */
function tableRowClass(data: {row: MusicInfo}) {
    return data.row.id === activeId.value ? 'songlist_item active' : 'songlist_item'
}
</script>

