<template>
    <div class="header">
        <div class="header_input">
            <IconInput class="header_input_input" @submit="commitSearch" />
        </div>
    </div>
</template>


<style lang="less" scoped>
.header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 40px;
    &_input {
        width: 400px
        
    }
}

@media screen and (max-width: 810px) {
    .header {
        justify-content: center;
        &_input {
            width: 300px;
        }
    }
}
@media screen and (max-width: 550px) {
    .header {
        padding: 0;
        justify-content: center;
        &_input {
            width: 80%;
        }
    }
}
</style>

<script lang="ts" setup>
import { jointQuery } from '@/assets/api';
import IconInput from '@/components/IconInput/index.vue'
import { AudioInfoType } from '@/interface';
import { useRouter } from 'vue-router';

const router = useRouter();

/** 提交搜索 */
function commitSearch(input: string) {
    let realInput = input.trim();
    if (realInput === '') return;
    router.push(jointQuery(`/search`, {
        kw: realInput,
        t: AudioInfoType.cloud
    }))
}
</script>

