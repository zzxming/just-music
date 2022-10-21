<template>
    <div class="playlist_wrapper">
        <div class="playlist_wrapper_title">精品歌单</div>
        <CloudPlaylist :is-top-list="true" />
    </div>
</template>

<style lang="less" scoped>
.playlist_wrapper {
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
    &_title {
        align-self: flex-start;
        line-height: 40px;
        margin-bottom: 10px;
        font-size: 30px;
    }
}
</style>

<script lang="ts" setup>
import CloudPlaylist from '@/components/CloudPlaylist/index.vue';
</script>

