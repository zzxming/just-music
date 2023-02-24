<template>
    <div class="playlist">
        <LoadingMore :requestFunc="getPlaylistData" :isStatic="isStatic">
            <PlaylistList :isTopList="isTopList" :playlist="playlist" />
        </LoadingMore>
    </div>
</template>

<style lang="less" scoped>
.playlist {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}
</style>


<script lang="ts" setup>
import { PlaylistType, PlaylistInfoPartial } from '@/interface'
import { getCloudPersonalized } from '@/assets/cloudApi';
import { formatPlaylistPartial } from '@/utils/format';


const { isTopList } = withDefaults(
    defineProps<{
        isTopList?: boolean
        isStatic?: boolean
    }>(), {
        isTopList: false,
        isStatic: false
    }
);

const playlist = reactive<PlaylistInfoPartial[]>([]);

/** 获取精选歌单 */
async function getPlaylistData() {
    let [err, result] = await getCloudPersonalized({
        limit: isTopList ? 20 : 10
    })

    if (!err && result) {
        const { code, data } = result.data;
        playlist.push(...formatPlaylistPartial(data, PlaylistType.cloud));
        // 第一次加载完成
        return data.length
    }
    if (err) {
        // console.log(err)
        return -1;
    }
    return -1;
}

</script>
