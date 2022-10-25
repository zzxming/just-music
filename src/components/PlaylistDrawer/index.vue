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
                    <div class="drawer_btn" @click="dialogVisible = true">
                        <el-icon><Plus /></el-icon>
                    </div>
                </span>
            </div>
        </template>
        
        <PlaylistTitleList @clickItem="() => emit('close')" />
    </el-drawer>
    <CreatePlaylist :visible="dialogVisible" @close="dialogVisible = false" />
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
import { ref } from 'vue';
import { useIsSmallScreen } from '@/hooks';
import PlaylistTitleList from '@/components/PlaylistTitleList/index.vue';
import CreatePlaylist from '@/components/CreatePlaylist/index.vue';


const { show } = defineProps<{
    show: boolean
}>();
const emit = defineEmits<{
    (event: 'close'): void
}>();
const smallScreen = useIsSmallScreen();

const dialogVisible = ref(false);


</script>

