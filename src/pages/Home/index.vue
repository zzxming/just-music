<template>
    <DataContent title="网易云推荐歌单" href="/playlist">
        <CloudPlaylistRecommend />
    </DataContent>
    <DataContent title="just推荐歌单">
        <LocalPlaylistRandom />
    </DataContent>
</template>

<script lang="ts" setup>
import DataContent from "@/components/DataContent/index.vue";
import CloudPlaylistRecommend from "@/components/CloudPlaylistRecommend/index.vue";
import LocalPlaylistRandom from "@/components/LocalPlaylistRandom/index.vue";


</script>


<style lang="less" scoped>

</style>