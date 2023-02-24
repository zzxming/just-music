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
import { PlaylistInfo, PlaylistType } from '@/interface'
import { getCloudPlaylistHighquality, PlaylistVal } from '@/assets/cloudApi';
import { formatPlaylistInfo } from '@/utils/format';


const { isTopList } = withDefaults(
    defineProps<{
        isTopList?: boolean
        isStatic?: boolean
    }>(), {
        isTopList: false,
        isStatic: false
    }
);

const lasttime = ref(0);
const cat = ref(PlaylistVal.All);
const playlist = reactive<PlaylistInfo[]>([]);

/** 获取精选歌单 */
async function getPlaylistData() {
    let [err, result] = await getCloudPlaylistHighquality({
        before: lasttime.value, 
        cat: cat.value, 
        limit: isTopList ? 20 : 10
    })

    if (!err && result) {
        const { code, data } = result.data;
        playlist.push(...formatPlaylistInfo(data.playlist, PlaylistType.cloud));
        lasttime.value = data.lasttime;
        // 第一次加载完成
        return data.more ? data.playlist.length : 0 
    }
    if (err) {
        // console.log(err)
        return -1;
    }
    return -1;
}

</script>
