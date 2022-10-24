<template>
    <div class="playlist">
        <PlaylistList v-loading="fristLoading && !loadingError"  :isTopList="isTopList" :playlist="playlist" :type="AudioInfoType.cloud" />
        <LoadingErrorTip :isError="fristLoading && loadingError" :requestFunc="getCloudPlaylistPersonalized" />
    </div>
    <LoadingMore v-show="isTopList && !fristLoading" ref="loadMore" :requestFunc="getCloudPlaylistPersonalized" />
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
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { AudioInfoType, PlaylistInfo, PlaylistInfoPartial } from '@/interface'
import { getCloudPersonalized, PlaylistVal } from '@/assets/cloudApi';
import LoadingErrorTip from '@/components/LoadingErrorTip/index.vue'
import LoadingMore, { ExposeVar } from '@/components/LoadingMore/index.vue'
import PlaylistList from '@/components/PlaylistList/index.vue';
import { formatPlaylistPartial } from '@/utils';


const { isTopList } = defineProps({
    isTopList: {
        type: Boolean,
        default: false,
        required: false
    }
});

const loadMore = ref<ExposeVar>();

const loadingError = ref(false);
const fristLoading = ref(true);
const lasttime = ref(0);
const cat = ref(PlaylistVal.All);
const playlist = reactive<PlaylistInfoPartial[]>([]);


onMounted(() => {
    getCloudPlaylistPersonalized();
});
// 等待第一次加载完成再进行滚动加载的监听
watch(fristLoading, (val) => {
    if (!val) {
        // 等 dom 挂载上再绑定事件
        nextTick(() => observerLoad())
    }
})
/** 监听动态加载歌单 */
function observerLoad() {
    if (!loadMore.value) return;
    let loadIO = new IntersectionObserver(function (entries) {
        // 距离视口还有200px
        if (entries[0].isIntersecting && loadMore.value) {
            // console.log('load')
            loadMore.value.loadFunc();
        }
    }, {
        rootMargin: '0px 0px 200px 0px' // 监听视口距离向下多200px
    });
    loadIO.observe(loadMore.value.loadMore);
}
/** 获取精选歌单 */
async function getCloudPlaylistPersonalized() {
    loadingError.value = false;
    let [err, result] = await getCloudPersonalized({
        limit: isTopList ? 20 : 10
    })

    if (!err && result) {
        const { code, data } = result.data;
        playlist.push(...formatPlaylistPartial(data));
        // 第一次加载完成
        fristLoading.value = false;
        return data.length
    }
    if (err) {
        // console.log(err)
        loadingError.value = true;
        return -1;
    }
    return -1;
}

</script>
