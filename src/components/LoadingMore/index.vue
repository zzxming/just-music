<template>
    <div class="load_wrapper">
        <slot></slot>
        <div :class="`load_more ${isStatic ? '' : 'load_gap'}`" ref="loadMore">
            <div v-if="!haveMore && !isStatic" class="load_txt load_nomore">已经没有更多了</div>
            <template v-if="haveMore">
                <div v-show="!loadingError">
                    <span v-show="loading" :class="`load_txt ${isStatic ? 'load_gap' : ''}`">加载中...</span>
                    <span v-show="!loading && !isStatic" class="load_txt load_btn" @click="loadFunc">加载更多</span>
                </div>
                <LoadingErrorTip :isError="!loading && loadingError" :requestFunc="loadFunc" />
            </template>
        </div>
    </div>
</template>

<style lang="less" scoped>
.load {
    &_more {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &_gap {
        margin: 60px 0;
    }
    &_nomore {
        color: var(--el-color-info);
    }
    &_txt {
        display: inline-block;
    }
    &_btn {
        color:var(--el-color-error-light-3);
        cursor: pointer;
        &:hover {
            color:var(--el-color-danger);
        }
    }
}
</style>

<script lang="ts" setup>

export type LoadFunc = (...arg: any) => number | Promise<number>
export interface ExposeVar {
    loadMore: HTMLDListElement
    loadFunc: LoadFunc
} 
const props = withDefaults(
    defineProps<{
        requestFunc: LoadFunc
        // 只加载一次
        isStatic?: boolean
    }>(), {
        isStatic: false        
    }
)
let loadMore = ref<HTMLDivElement>();
let haveMore = ref(true);
let loading = ref(false);
let loadingError = ref(false);
/** 是否第一次加载 */
let fristLoad = ref(true);

defineExpose({loadMore, loadFunc});

onMounted(() => {
    if (!props.isStatic) {
        observerLoad();
    }
    else {
        loadFunc();
    }
})
function observerLoad() {
    if (!loadMore.value) return;
    let loadIO = new IntersectionObserver(async (entries) => {
        // console.log(entries[0].isIntersecting, loadMore.value)
        if (entries[0].isIntersecting && loadMore.value) {
            loadFunc();
        }
    }, {
        rootMargin: '0px 0px 200px 0px'
    });
    loadIO.observe(loadMore.value);
}
/** 返回 0 表示没有更多数据, 返回 -1 表示报错, 返回其他为数据长度 */
async function loadFunc() {
    // 静态数据第一次可加载，后续禁止
    if (props.isStatic && !fristLoad.value || !props.requestFunc) {
        return;
    }
    fristLoad.value = false;

    if (!haveMore.value) return 0;
    loadingError.value = false;
    loading.value = true;
    let state = await props.requestFunc();
    loading.value = false;
    // 静态不加载更多
    if (props.isStatic) {
        state = 0;
    }

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
