<template>
    <div class="playlist_wrapper">
        <div class="playlist_title">
            <div class="playlist_title_tag-cur">{{ title }}</div>
            <ul class="playlist_title_tag">
                <li 
                    v-for="tag in playlistTag" 
                    :class="`playlist_title_tag-item ${tag.id === Number(id) ? 'active' : ''}`" 
                    @click="() => router.replace(jointQuery(`/playlist`, { id: tag.id }))"
                >
                    {{ tag.title }}
                </li>
            </ul>
        </div>
        <CloudPlaylistRecommend v-if="Number(id) === 1" :isTopList="true"  />
        <CloudPlaylistHighquality v-else-if="Number(id) === 2" :isTopList="true" />
        <div v-else class="playlist_content-error">
            没有这个分类
        </div>
    </div>
</template>

<style lang="less" scoped>
.playlist {
    &_wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        position: relative;
        min-height: calc(100vh - 64px);
        margin: 0 auto;
        padding: 40px;
        background-color: var(--el-fill-color-blank);
        border: 1px solid var(--el-border-color);
    }
    &_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 48px;
        margin-bottom: 10px;
        &_tag {
            display: flex;
            align-items: center;
            justify-content: center;
            &-cur {
                font-size: 30px;
            }
            &-item {
                margin-right: 4px;
                padding: 0 6px;
                font-size: 14px;
                color: var(--el-color-info-light-5);
                cursor: default;
                &:hover {
                    color: var(--el-color-info);
                }
                &.active {
                    border-radius: 6px;
                    color: var(--el-color-danger);
                    background-color: var(--el-color-danger-light-9);
                }
            }
        }
    }
    &_content {
        &-error {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 200px;
        }
    }
}
</style>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import CloudPlaylistHighquality from '@/components/CloudPlaylistHighquality/index.vue';
import CloudPlaylistRecommend from '@/components/CloudPlaylistRecommend/index.vue';
import { jointQuery } from '@/assets/api';

const router = useRouter();
const { id } = defineProps<{
    id: string
}>();

// tag 应该定义服务器传过来
const playlistTag = [
    {
        id: 1,
        title: '推荐歌单',
    }, {
        id: 2,
        title: '精品歌单',
    }, 
];

const title = computed(() => {
    return playlistTag.find(playlist => playlist.id === Number(id))?.title ?? ''
})


</script>

