<template>
    <!-- <div v-if="loading"> -->
    <div>
        <Songlist :songs="songsData" />
    </div>
</template>


<style lang="less" scoped></style>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { AudioInfoType, MusicInfo, LocalMusic, CloudMusic } from '@/interface'
import { searchCloudMusic } from '@/assets/cloudApi'
import { formatMusicInfo } from '@/utils'
import { searchLocalMusic, searchMusicInfoWIthBvid } from '@/assets/localApi'
import Songlist from '@/components/Songlist/index.vue'

enum SearchType {
    bili = 'bili',
    local = 'local',
    cloud = 'cloud'
}

const { kw, t } = defineProps<{
    kw: string
    t: AudioInfoType
}>();
const searchType = ref<SearchType>(SearchType.cloud);
const type = ref(1);
const limit = ref(1);
const loading = ref(true);
const loadingError = ref(false);
const songsData = reactive<MusicInfo[]>([]);

onMounted(() => {
    console.log(kw, t);
    requestSearch();
})


/** 发起搜索请求 */
async function requestSearch() {
    loading.value = true;
    loadingError.value = false;
    // 每次搜索清空数据
    songsData.length = 0;
    let err, result;
    /** 判断不太的请求方法 */
    switch(searchType.value) {
        case SearchType.bili: {
            [err, result] = await searchMusicInfoWIthBvid(kw);
            break;
        }
        case SearchType.local: {
            [err, result] = await searchLocalMusic({
                kw,
                limit: limit.value,
                t: type.value
            });
            break;
        }
        case SearchType.cloud: {
            [err, result] = await searchCloudMusic({
                kw,
                limit: limit.value,
                t: type.value
            });
            break;
        }
        default: {
            err = null; 
            result = undefined;
        }
    }
    loading.value = false;
    if (!err && result) {
        // console.log(result)
        // bv 号搜索返回是单个数据
        let data = result.data.data;
        songsData.push(...formatMusicInfo(data, t));
    }
    else {
        loadingError.value = true;
        return false;
    }
}
/** 网易云搜索 */
async function searchCloud() {
    let [err, result] = await searchCloudMusic({
        kw,
        limit: limit.value,
        t: type.value
    });
    console.log('cloud', err, result)
}
/** 本地搜索 */
async function searchLocal() {
    let [err, result] = await searchLocalMusic({
        kw,
        limit: limit.value,
        t: type.value
    });
    console.log('local', err, result)
}
/** bv号搜索 */
async function searchbili() {
    let [err, result] = await searchMusicInfoWIthBvid(kw);
    console.log('bili', err, result)
}

</script>
