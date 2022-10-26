<template>
    <el-button plain class="back" @click="backRoute">
        <el-icon><ArrowLeft /></el-icon>
    </el-button>
</template>


<style lang="less" scoped>
.back {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter();

function backRoute() {
    // console.log(router)
    // console.log(router.options.history.state)
    router.back()
}

</script>


