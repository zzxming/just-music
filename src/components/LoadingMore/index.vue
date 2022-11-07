<template>
    <div class="load-more" ref="loadMore">
        <div v-if="!haveMore" class="load-nomore">已经没有更多了</div>
        <template v-else>
            <div v-show="!loadingError">
                <span v-show="loading">加载中...</span>
                <span v-show="!loading" class="load-btn" @click="loadFunc">加载更多</span>
            </div>
            <LoadingErrorTip :isError="!loading && loadingError" :requestFunc="loadFunc" />
        </template>
    </div>
</template>

<style lang="less" scoped>
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
</style>

<script lang="ts" setup>

export interface ExposeVar {
    loadMore: HTMLDListElement
    loadFunc: (...arg: any) => number | Promise<number>;
} 
const props = defineProps<{
    requestFunc: (...arg: any) => number | Promise<number>;
}>();
const loadMore = ref<HTMLDivElement>();
const haveMore = ref(true);
const loading = ref(false);
const loadingError = ref(false);

defineExpose({loadMore, loadFunc});

/** 返回 0 表示没有更多数据, 返回 -1 表示报错, 返回其他为数据长度 */
async function loadFunc() {
    if (!haveMore.value) return 0;
    loadingError.value = false;
    loading.value = true;
    let state = await props.requestFunc();
    loading.value = false;
    if (state === -1) {
        loadingError.value = true;
    }
    else if (state === 0) {
        haveMore.value = false;
    }
    else {
        haveMore.value = true;
        loadingError.value = false;
    }
    return state;
}


</script>
