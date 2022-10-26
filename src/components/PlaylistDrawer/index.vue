<template>
    <el-drawer
        modalClass="drawer"
        v-model="show"
        direction="rtl"
        :size="smallScreen ? '100%' : 400"
        :before-close="() => emit('close')"
    >
        <template #header>
            <div class="drawer_header">
                <span class="drawer_header_title">
                    创建的歌单
                    <div class="drawer_btn" @click="createPlaylistVisible = true">
                        <el-icon><Plus /></el-icon>
                    </div>
                </span>
            </div>
        </template>
        
        <PlaylistTitleList @clickItem="() => emit('close')" />
    </el-drawer>
</template>

<style lang="less" scoped>
.drawer {
    &_header {
        display: flex;
        align-items: center;
        &_title {
            display: flex;
            align-items: center;
            cursor: pointer;
            .drawer_btn {
                margin-left: 20px;
            }
        }
    }
    &_btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
<style lang="less">
.drawer {
    .el-drawer {
        .el-drawer__close-btn {
            &:hover {
                .el-icon {
                    color: var(--el-color-danger);
                }
            }
        }
    }
    .el-drawer.ltr, 
    .el-drawer.rtl {
        position: static;
        float: right;
    }
}
</style>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useIsSmallScreen } from '@/hooks';
import { popoutCloseEvent, usePopoutStore } from '@/store/popout';
import PlaylistTitleList from '@/components/PlaylistTitleList/index.vue';

const { show } = defineProps<{
    show: boolean
}>();
const emit = defineEmits<{
    (event: 'close'): void
}>();
const smallScreen = useIsSmallScreen();

const popoutStore = usePopoutStore();
const { createPlaylistVisible } = storeToRefs(popoutStore);

onMounted(() => {
    window.addEventListener(popoutCloseEvent, close)
});
onUnmounted(() => {
    window.removeEventListener(popoutCloseEvent, close)
});

function close() {
    console.log('close?')
    emit('close');
}
</script>

