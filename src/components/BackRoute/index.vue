<template>
    <div class="back" v-show="route.path !== '/home'" @click="backRoute">
        <el-icon><ArrowLeft /></el-icon>
    </div>
</template>


<style lang="less" scoped>
.back {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--el-color-white);
    cursor: pointer;
}
</style>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();

function backRoute() {
    // console.log(route)
    // console.log(router)
    router.go(-1);
}

</script>
