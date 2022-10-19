<template>
    <div class="page404">
        <h3 class="page404_title">404</h3>
        <span class="page404_txt">There's nothing here</span>
    </div>
</template>

<style lang="less" scoped>
.page404 {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &_title {
        margin: 0;
        height: 70px;
        line-height: 70px;
        font-size: 60px;
    }
    &_txt {
        height: 32px;
        line-height: 32px;
        font-size: 28px;
        color: var(--el-color-info);
    }
}
</style>