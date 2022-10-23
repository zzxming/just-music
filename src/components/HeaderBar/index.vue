<template>
    <div class="header">
        <BackRoute class="header_back" />
        <div class="header_input">
            <IconInput v-if="!!inputTxt || inputTxt === ''" class="header_input_input" :inputTxt="inputTxt" @submit="commitSearch" />
        </div>
    </div>
</template>


<style lang="less" scoped>
.header {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    padding: 16px 40px 8px;
    z-index: 10;
    &_back {
        position: absolute;
        left: 40px;
        justify-self: flex-start;
    }
    &_input {
        width: 400px;
        padding-left: 40px;
    }
}

@media screen and (max-width: 810px) {
    .header {
        justify-content: center;
        &_back {
            left: 5%;
        }
        &_input {
            width: 300px;
        }
    }
}
@media screen and (max-width: 550px) {
    .header {
        padding-left: 0;
        padding-right: 0;
        justify-content: center;
        &_input {
            width: 80%;
        }
    }
}
</style>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { jointQuery } from '@/assets/api';
import { AudioInfoType } from '@/interface';
import IconInput from '@/components/IconInput/index.vue'
import BackRoute from '@/components/BackRoute/index.vue'

const route = useRoute();
const router = useRouter();
const inputTxt = ref<string>((route.query.kw as string) ?? '');

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
    router.push(jointQuery(`/search`, {
        kw: realInput,
        t: (route.query.t as string) || AudioInfoType.cloud
    }))
}
</script>

