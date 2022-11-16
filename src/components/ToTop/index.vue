<template>
    <div class="to-top" v-show="showToTop" @click="toTop">
        <IconAntDesignVerticalAlignTopOutlined/>
    </div>
</template>

<style lang="less" scoped>
.to-top {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 200px;
    right: 100px;
    width: 30px;
    height: 30px;
    padding: 4px;
    border-radius: 50%;
    border: 1px solid var(--el-color-info);
    background-color: var(--el-color-info-dark-2);
    box-shadow: var(--el-box-shadow);
    color: var(--el-color-white);
    font-size: 24px;
    cursor: pointer;
    z-index: 2000;
}
</style>

<script lang="ts" setup>

const showToTop = ref(false);

onMounted(() => {
    document.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 200) {
            showToTop.value = true;
        }
        else {
            showToTop.value = false;
        }
    })
});

function toTop() {
    let timer = setInterval(() => {
        //获取滚动条的滚动高度
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        //用于设置速度差，产生缓动的效果
        var speed = Math.floor(-osTop / 6);
        document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
        if (osTop == 0){
            clearInterval(timer);
        }
    }, 30);
}

</script>
