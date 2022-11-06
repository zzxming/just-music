<template>
    <DataContent title="网易云推荐歌单" href="/playlist">
        <CloudPlaylistRecommend />
    </DataContent>
    <!-- <DataContent title="just推荐歌单">
        <LocalPlaylistRandom />
    </DataContent> -->
    <DataContent title="推荐哔哩哔哩歌单" :style="{marginBottom: '100px'}">
        <BiliPlaylistRecommend />
    </DataContent>
</template>

<script lang="ts" setup>
</script>


<style lang="less" scoped>
</style>