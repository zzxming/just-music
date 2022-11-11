<template>
    <div class="header" v-show="showHeader">
        <div class="header_left">
            <BackRoute class="header_back" v-show="route.path !== '/home'" />
        </div>
        <div class="header_input">
            <IconInput v-if="!!inputTxt || inputTxt === ''" class="header_input_input" :inputTxt="inputTxt" @submit="commitSearch" />
        </div>
        <div class="header_right">
            <div class="header_login" v-if="!cloudIsLogin" @click="cloudLoginVisible = true">登录</div>
            <el-button class="header_drawer" plain @click="drawer = true">
                <el-icon><IconCusList /></el-icon>
            </el-button>
        </div>
    </div>

    <PlaylistDrawer :show="drawer" @close="closeDrawer" />
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
    &_right {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &_input {
        width: 400px;
        padding: 0 20px;
        margin-right: auto;
    }
    &_login {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 100%;
        margin-right: 20px;
        color: var(--el-color-info);
        cursor: pointer;
        &:hover {
            color: var(--el-color-danger);
        }
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
import { jointQuery } from '@/assets/api';
import { getCloudUserState } from '@/assets/cloudApi';
import { AudioInfoType } from '@/interface';
import { usePopoutStore, useComponentStateStore } from '@/store';


const route = useRoute();
const router = useRouter();
const inputTxt = ref<string>((route.query.kw as string) ?? '');

const popoutStore = usePopoutStore();
const { cloudLoginVisible, cloudIsLogin } = storeToRefs(popoutStore);
const componentStateStore = useComponentStateStore();
const { showHeader } = storeToRefs(componentStateStore);


const drawer = ref(false);

onMounted(async () => {
    let [err, result] = await getCloudUserState();
    if (!err) {
        (popoutStore.cloudIsLogin as unknown as boolean) = !!result;
    }
})

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
    if (route.path === '/search') {
        router.replace(jointQuery(`/search`, {
            kw: realInput,
            t
        }));
        return;
    }
    router.push(jointQuery(`/search`, {
        kw: realInput,
        t
    }));
}
/** 关闭 drawer */
function closeDrawer() {
    drawer.value = false
}
</script>

