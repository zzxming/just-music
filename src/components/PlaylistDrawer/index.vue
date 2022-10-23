<template>
    <el-drawer
        modalClass="drawer"
        v-model="show"
        direction="rtl"
        :size="smallScreen ? '100%' : 400"
    >
        <template #header>
            <div class="drawer_header">
                <span class="drawer_header_title">
                    创建的歌单
                    <div class="drawer_btn">
                        <el-icon><Plus /></el-icon>
                    </div>
                </span>
            </div>
        </template>
        
        <PlaylistTitleList :playlist="playlists" />
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
}
</style>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { PlaylistInfo } from '@/interface';
import { useIsSmallScreen } from '@/hooks';
import { getCustomPlaylist } from '@/utils';
import PlaylistTitleList from '@/components/PlaylistTitleList/index.vue';


const { show } = defineProps<{
    show: boolean
}>();
const smallScreen = useIsSmallScreen();

const playlists = ref<PlaylistInfo[]>([]);

onMounted(() => {
    playlists.value = getCustomPlaylist();
});


</script>

