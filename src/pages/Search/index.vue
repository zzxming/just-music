<template>
    <div class="search">
        <div class="search_type">
            <el-tabs 
                class="search_header"
                v-model="currentSearchType"
                :stretch="true"
                @tab-change="searchTypeChange"
            >
                <template v-for="sType in AudioInfoType">
                    <el-tab-pane 
                        v-if="sType !== AudioInfoType.local"
                        :label="SearchTypeTxt[sType]" 
                        :name="sType"
                    >
                        <template #label>
                            <div class="search_type_item">{{SearchTypeTxt[sType]}}</div>
                        </template>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </div>
        <div class="search_result">
            <!-- key 刷新组件，使每次改变时重新加载组件里的 loadMore 组件，达到每次改变自动显示加载中 -->
            <LoadingMore 
                :key="`${kw}-${currentSearchType}`"
                :requestFunc="requestSearch" 
                :isStatic="currentSearchType === AudioInfoType.bili"
            >
                <Songlist 
                    :songs="songsData" 
                    :emptyText="currentSearchType === AudioInfoType.bili ? '请输入正确的bv号' : '没有搜索到相关歌曲'" 
                />
            </LoadingMore>
        </div>
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
        background-color: var(--el-bg-color-overlay);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
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
import { AudioInfoType, MusicInfo } from '@/interface'
import { formatMusicInfo, isType } from '@/utils/format'
import { searchCloudMusic, SearchCloudResult } from '@/assets/cloudApi'
import { searchLocalMusic, searchMusicInfoWIthBvid } from '@/assets/localApi'
import { jointQuery } from '@/assets/api';

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

const currentSearchType = ref<AudioInfoType>(props.t);
const type = ref(1);
const limit = ref(1);
const fristLoading = ref(true);
const loadingError = ref(false);
const songsData = reactive<MusicInfo[]>([]);


// url 变化重置状态
watch(() => props, () => {
    limit.value = 1;
    loadingError.value = false;
    fristLoading.value = true;
    songsData.length = 0;
}, {
    deep: true
});

/** 搜索类型改变 */
function searchTypeChange() {
    router.replace(jointQuery(route.path, {kw: props.kw, t: currentSearchType.value}));
}
/**
 * 发起搜索请求
 */
async function requestSearch() {
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
            break;
        }
        case AudioInfoType.cloud: {
            [err, result] = await searchCloudMusic({
                kw: props.kw,
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
    // 添加时不清空已有数据
    if (!err && result) {
        fristLoading.value = false;
        // console.log(result)
        let data = result.data;

        limit.value += 1;
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
