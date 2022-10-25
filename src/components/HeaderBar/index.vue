<template>
    <div class="header">
        <div class="header_left">
            <el-button plain v-show="route.path !== '/home'">
                <BackRoute class="header_back" />
            </el-button>
        </div>
        <div class="header_input">
            <IconInput v-if="!!inputTxt || inputTxt === ''" class="header_input_input" :inputTxt="inputTxt" @submit="commitSearch" />
        </div>
        <div class="header_right">
            <CloudLogin />
            <el-button class="header_drawer" plain @click="drawer = true">
                <el-icon><List /></el-icon>
            </el-button>
        </div>
    </div>

    <PlaylistDrawer :show="drawer" @close="drawer = false" />
</template>


<style lang="less" scoped>
.header {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 64px;
    padding: 16px 40px 8px;
    z-index: 9;
    &_left {

    }
    &_right {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &_back {
    }
    &_input {
        width: 400px;
        padding: 0 20px;
        margin-right: auto;
    }
}
:deep(.el-button.is-plain) {
    --el-button-hover-text-color: var(--el-color-danger);
    --el-button-hover-border-color: var(--el-color-danger);
}
:deep(.el-button:active) {
    border-color: var(--el-color-danger);
}

@media screen and (max-width: 810px) {
    .header {
        &_back {
        }
        &_input {
            width: 300px;
            margin-right: 0;
        }
    }
}
@media screen and (max-width: 550px) {
    .header {
        padding-left: 0;
        padding-right: 0;
        justify-content: center;
        &_input {
            width: 60%;
        }
    }
}
</style>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { jointQuery } from '@/assets/api';
import { AudioInfoType } from '@/interface';
import IconInput from '@/components/IconInput/index.vue';
import BackRoute from '@/components/BackRoute/index.vue';
import CloudLogin from '@/components/CloudLogin/index.vue';
import PlaylistDrawer from '@/components/PlaylistDrawer/index.vue';
import List from '@/assets/iconfont/list.vue';


const route = useRoute();
const router = useRouter();
const inputTxt = ref<string>((route.query.kw as string) ?? '');

const drawer = ref(false);

// 同步 url 的搜索参数
watch(() => route, (val) => {
    if (!val.query.kw) {
        inputTxt.value = '';
        return;
    }
    inputTxt.value = val.query.kw as string;
}, {
    deep: true
});

/** 提交搜索 */
function commitSearch(input: string) {
    let realInput = input.trim();
    if (realInput === '') return;
    let t = route.path === '/search' ? route.query.t as string : AudioInfoType.cloud;
    router.push(jointQuery(`/search`, {
        kw: realInput,
        t
    }))
}
</script>

