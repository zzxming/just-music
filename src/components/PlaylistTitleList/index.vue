<template>
    <ul class="playlist">
        <div v-if="playlist.length < 1" class="playlist_tip">你还没有创建过歌单哦</div>
        <li v-for="info in playlist" v-key="info.id">
            <div class="playlist_item">
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
import { PlaylistInfo } from '@/interface';


let { playlist } = defineProps<{
    playlist: PlaylistInfo[]
}>();


</script>

<!-- 自定义歌单最好能够用户网易云歌单导入 -->
