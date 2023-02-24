<template>
    <div class="playlist">
        <LoadingMore :requestFunc="addData" :isStatic="true">
            <PlaylistList :isTopList="false" :playlist="playlist" />
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
import { PlaylistInfoPartial } from '@/interface'
import { getBiliAudioForPlaylist } from '@/assets/localApi';

const playlist = reactive<PlaylistInfoPartial[]>([]);

async function addData() {
    const bvArr = ['BV1mt411q7GU', 'BV1Wt411H7qN', 'BV1Dh41167W4', 'BV1tb411g7wo', 'BV1jJ41137nD'];
    return await Promise.all(bvArr.map(async (bv) => await getPlaylistData(bv)))
    .then(res => {
        playlist.push(...res)
        return 0;
    })
    .catch(err => {
        // console.log(err)
        return -1
    })
}

async function getPlaylistData(bv: string) {
    let [err, result] = await getBiliAudioForPlaylist(bv);
    if (!err && result) {
        return result.data.data;
    }
    else {
        return Promise.reject('some error');
    }
}

</script>
