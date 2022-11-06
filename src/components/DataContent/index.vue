<template>
    <div class="content">
        <div class="content_header">
            <div class="content_title" @click="linkTo" :style="{cursor: href ? 'pointer' : 'default'}">
                <span class="content_title_text">{{ title }}</span>
                <el-icon class="content_title_icon"><IconEpArrowRightBold /></el-icon>
            </div>
        </div>
        <div class="content_body">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
.content {
    position: relative;
    box-sizing: border-box;
    // width: 100vw;
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px;
    background-color: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color);
    &_header {
        display: flex;
        align-items: center;
        width: 100%;
    }
    &_title {
        display: flex;
        align-items: center;
        height: 48px;
        font-size: 24px;
        font-weight: 700;
        color: var(--el-text-color-regular);
        cursor: pointer;
        &:hover {
            color: var(--el-color-black);
        }
        &_text {
            display: inline-flex;
            height: 100%;
            align-items: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        &_icon {
            display: inline-block;
            margin-left: 6px;
        }
    }
}

</style>

<script lang="ts" setup>


const props = defineProps<{
    title: string
    href?: string
}>();
const router = useRouter()

const linkTo = () => {
    if (!props.href) return;
    router.push(props.href);
}

</script>

