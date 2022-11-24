<template>
    <div class="playlist">
        <PlaylistList v-loading="fristLoading && !loadingError" :isTopList="false" :playlist="playlist" />
        <LoadingErrorTip :isError="fristLoading && loadingError" :requestFunc="getPlaylistData" />
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

const loadingError = ref(false);
const fristLoading = ref(true);
const playlist = reactive<PlaylistInfoPartial[]>([]);

onMounted(() => {
    addData()
});

function addData() {
    const bvArr = ['BV1mt411q7GU', 'BV1Wt411H7qN', 'BV1Dh41167W4', 'BV1tb411g7wo', 'BV1jJ41137nD'];
    Promise.all(bvArr.map(async (bv) => await getPlaylistData(bv)))
    .then(res => {
        fristLoading.value = false;
        playlist.push(...res)
    })
    .catch(err => {
        // console.log(err)
        loadingError.value = true;
    })
}

async function getPlaylistData(bv: string) {
    loadingError.value = false;
    let [err, result] = await getBiliAudioForPlaylist(bv);
    if (!err && result) {
        return result.data.data
        // playlist.push(result.data.data)
    }
    else {
        return Promise.reject('some error')
    }
}

</script>
