<template>
    <div class="search">
        <div class="search_type">
            <el-tabs 
                class="search_header"
                v-model="currentSearchType"
                :stretch="true"
                @tab-change="searchTypeChange"
            >
                <el-tab-pane 
                    v-for="sType in AudioInfoType" 
                    :label="SearchTypeTxt[sType]" 
                    :name="sType"
                >
                    <template #label>
                        <div class="search_type_item">{{SearchTypeTxt[sType]}}</div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div v-loading="fristLoading && !loadingError" class="search_result">
            <Songlist 
                v-if="!fristLoading || !loadingError" 
                :songs="songsData" 
                :emptyText="currentSearchType === AudioInfoType.bili ? '请输入正确的bv号' : '没有搜索到相关歌曲'" 
            />
        </div>
        <LoadingErrorTip :isError="fristLoading && loadingError" :requestFunc="() => requestSearch(true)" />
        <LoadingMore v-if="currentSearchType !== AudioInfoType.bili" :key="currentSearchType" v-show="!fristLoading" ref="loadMore" :requestFunc="requestSearch" />
    </div>
</template>



<style lang="less" scoped>
.search {
    padding: 0 40px;
    &_header {
        background-color: var(--el-fill-color-blank);
    }
    &_type {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow-x: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        &_list {
            display: flex;
        }
        &_item {
            padding: 0 20px;
            font-size: 18px;
            font-weight: 600;
            color: var(--el-color-info);
        }
        .is-active &_item {
            color: var(--el-color-danger-light-3);
        }
    }
    &_result {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }
}
.load {
    &-more {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0 200px;
    }
    &-nomore {
        color: var(--el-color-info);
    }
    &-btn {
        color:var(--el-color-error-light-3);
        cursor: pointer;
        &:hover {
            color:var(--el-color-danger);
        }
    }
}
:deep(.el-tabs__item) {
    padding: 0;
}
:deep(.el-tabs__active-bar.is-top) {
    height: 4px;
    background-color: var(--el-color-danger-light-3);
}
:deep(.el-tabs__nav-wrap.is-top::after) {
    height: 4px;
}
@media screen and (max-width: 550px) {
    .search {
        padding: 0;
    }
}
</style>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AudioInfoType, MusicInfo } from '@/interface'
import { formatMusicInfo, isType } from '@/utils'
import { searchCloudMusic, SearchCloudResult } from '@/assets/cloudApi'
import { searchLocalMusic, searchMusicInfoWIthBvid } from '@/assets/localApi'
import { jointQuery } from '@/assets/api';
import LoadingErrorTip from '@/components/LoadingErrorTip/index.vue';
import Songlist from '@/components/Songlist/index.vue'
import LoadingMore, { ExposeVar } from '@/components/LoadingMore/index.vue';

enum SearchTypeTxt {
    bili = '哔哩哔哩',
    local = 'just',
    cloud = '网易云音乐'
}

const props = defineProps<{
    kw: string
    t: AudioInfoType
}>();
const router = useRouter();
const route = useRoute();
const loadMore = ref<ExposeVar>();

const currentSearchType = ref<AudioInfoType>(props.t);
const type = ref(1);
const limit = ref(1);
const fristLoading = ref(true);
const loadingError = ref(false);
const songsData = reactive<MusicInfo[]>([]);


// 搜索类型变化更改 url
watch(currentSearchType, (val) => {
    // console.log(val, route.query)
    // 为 loadingMore 组件设置了 :key, 使每次 searchtype 改变都会重新加载, 所以要重新挂载 observer
    nextTick(() => observerLoad());
    if (route.query.kw === props.kw && route.query.t === val) return;
    router.push(jointQuery(route.path, {kw: props.kw, t: val}));
});
// url 变化重新搜索
watch(() => props, (val) => {
    // console.log(val)
    // 因为 Search 组件的 props 来自路由
    // 所以改变 url 时先执行的是 props 发生改变
    // 但当在 search 页面改变 url 时 currentSearchType 已经赋值
    // 所以不会发生改变, 需要手动赋值一次
    currentSearchType.value = AudioInfoType[val.t];
    limit.value = 1;
    fristLoading.value = true;
    loadingError.value = false;
    songsData.length = 0;
    requestSearch(true);
}, {
    deep: true,
    immediate: true
});
/** 滚动动态加载 */
onMounted(() => {
    nextTick(() => observerLoad());
})
/** 监听动态加载歌单 */
function observerLoad() {
    if (!loadMore.value) return;
    let loadIO = new IntersectionObserver(function (entries) {
        // console.log(entries[0].isIntersecting)
        // 距离视口还有200px
        if (entries[0].isIntersecting && loadMore.value) {
            // console.log('load')
            // console.log(fristLoading.value)
            !fristLoading.value && loadMore.value.loadFunc();
        }
    }, {
        rootMargin: '0px 0px 200px 0px' // 监听视口距离向下多200px
    });
    loadIO.observe(loadMore.value.loadMore);
}


/** 搜索类型改变 */
function searchTypeChange(tabName: AudioInfoType) {
    currentSearchType.value = AudioInfoType[tabName];
    limit.value = 1;
    fristLoading.value = true;
    loadingError.value = false;
}
/**
 * 发起搜索请求
 * @param loadMore 是否是第一次发起请
 */
async function requestSearch(loadMore: boolean = false) {
    loadingError.value = false;
    let err, result;
    // console.log(currentSearchType.value)
    /** 判断不同的请求方法 */
    switch(currentSearchType.value) {
        case AudioInfoType.bili: {
            [err, result] = await searchMusicInfoWIthBvid(props.kw);
            break;
        }
        case AudioInfoType.local: {
            [err, result] = await searchLocalMusic({
                kw: props.kw,
                limit: limit.value,
                t: type.value
            });
            limit.value += 1;
            break;
        }
        case AudioInfoType.cloud: {
            [err, result] = await searchCloudMusic({
                kw: props.kw,
                limit: limit.value,
                t: type.value
            });
            limit.value += 1;
            break;
        }
        default: {
            err = null; 
            result = undefined;
        }
    }
    // 添加时不清空已有数据
    if (!err && result) {
        loadMore && (songsData.length = 0);
        fristLoading.value = false;
        // console.log(result)
        let data = result.data;

        songsData.push(...formatMusicInfo(data.data, currentSearchType.value));
        if (data.data.length < 1 || (isType<SearchCloudResult>(data) && songsData.length >= data.count)) {
            return 0;
        }
        return data.data.length;
    }
    else if (err) {
        fristLoading.value = false;
        // console.log(err)
        if (err.response && err.response.status >= 500) {
            loadingError.value = true;
            return -1;
        }
        return 0;
    }
    return -1;
}

</script>
