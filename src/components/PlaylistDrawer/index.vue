<template>
    <div :class="`drawer ${show ? 'show' : ''}`">
        <div class="drawer_mask" @click="close"></div>
        <div class="drawer_content" :style="{width: smallScreen ? '100%' : '400px'}">
            <div class="drawer_header">
                <span class="drawer_header_title" @click="createPlaylistVisible = true">
                    创建的歌单
                    <div class="drawer_btn">
                        <el-icon><Plus /></el-icon>
                    </div>
                </span>
                <div class="drawer_header_close" @click="close">
                    <el-icon><Close /></el-icon>
                </div>
            </div>
            <div class="drawer_body" @click="close">
                <PlaylistTitleList />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.drawer {
    position: fixed;
    inset: 0;
    z-index: 11;
    overflow: hidden;
    opacity: 0;
    transition: opacity .3s linear;
    visibility: hidden;
    &.show {
        opacity: 1;
        visibility: visible;
        .drawer_content {
            right: 0;
        }
    }
    &_mask {
        width: 100%;
        height: 100%;
        background-color: var(--el-overlay-color-lighter);
        z-index: 1;
    }
    &_content {
        position: absolute;
        right: -400px;
        top: 0;
        bottom: 0;
        height: 100%;
        box-shadow: var(--el-box-shadow-dark);
        background-color: var(--el-bg-color);
        transition: all var(--el-transition-duration);
        z-index: 2;
    }
    &_header {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 20px 20px 0;
        margin-bottom: 30px;
        color: #72767b;
        &_title {
            display: flex;
            align-items: center;
            cursor: pointer;
            .drawer_btn {
                margin-left: 20px;
            }
        }
        &_close {
            margin-left: auto;
            padding: 0 6px;
            font-size: 28px;
            cursor: pointer;
            &:hover {
                color: var(--el-color-danger);
            }
        }
    }
    &_body {
        box-sizing: border-box;
        width: 100%;
        padding: 20px;
        padding-top: 0;
    }
    &_btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
</style>

<script lang="ts" setup>
import { onMounted, onUnmounted, watch} from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useIsSmallScreen } from '@/hooks';
import { popoutCloseEvent, usePopoutStore } from '@/store/popout';
import PlaylistTitleList from '@/components/PlaylistTitleList/index.vue';

const props = defineProps<{
    show: boolean
}>();
const emit = defineEmits<{
    (event: 'close'): void
}>();
const router = useRouter();
const smallScreen = useIsSmallScreen();

const popoutStore = usePopoutStore();
const { createPlaylistVisible } = storeToRefs(popoutStore);

watch(() => router, () => {
    close();
}, { deep: true })
onMounted(() => {
    window.addEventListener(popoutCloseEvent, popoutClose)
});
onUnmounted(() => {
    window.removeEventListener(popoutCloseEvent, popoutClose)
});

function close() {
    emit('close');
    (popoutStore.popoutVisible as unknown as boolean) = false;
}
function popoutClose(e: CustomEventInit<{isItem: boolean}>) {
    if (e.detail) {
        e.detail.isItem && close();
    }
}
</script>

