<template>
    <div class="content">
        <div class="content_title" @click="linkTo">
            <span class="content_title_text">{{ title }}</span>
            <el-icon class="content_title_icon"><ArrowRightBold /></el-icon>
        </div>
        <div class="content_content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
.content {
    position: relative;
    box-sizing: border-box;
    width: 100vw;
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px;
    background-color: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color);
    &_title {
        display: flex;
        align-items: center;
        width: 100%;
        height: 48px;
        font-size: 24px;
        font-weight: 700;
        color: var(--el-text-color-regular);
        cursor: pointer;
        &:hover {
            color: var(--el-color-black);
        }
        &_text {
            display: inline-block;
        }
        &_icon {
            display: inline-block;
            margin-left: 6px;
        }
    }
}

</style>

<script lang="ts" setup>
import { useRouter } from 'vue-router';


const props = defineProps<{
    title: string
    href: string
}>();
const router = useRouter()

const linkTo = () => {
    router.push(props.href);
}

</script>

