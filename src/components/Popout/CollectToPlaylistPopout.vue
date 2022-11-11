<template>
    <PopoutItem botBorder @click="createPlaylist">创建新歌单</PopoutItem>
    <PopoutItem v-for="playlist in customPlaylist" @click="() => collectMusic(playlist.id)">{{playlist.title}}</PopoutItem>
</template>


<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { defaultMusicImg } from "@/assets/api";
import { usePopoutStore } from '@/store';
import { MusicInfo, CustomPlaylist, AudioInfoType } from '@/interface';
import { getAllCustomPlaylist, updateCustomPlaylist, localStoragePlaylistEvent } from '@/utils/localStorage';

const popoutStore = usePopoutStore();
const { 
    createPlaylistVisible,
    popoutHoldData,
} = storeToRefs(popoutStore);

const customPlaylist = ref<CustomPlaylist[]>([]);

/** 监听 localstorage 变化时更新 */
onMounted(() => {
    getCustomPlaylist();
    window.addEventListener(localStoragePlaylistEvent, getCustomPlaylist);
});
onUnmounted(() => {
    window.removeEventListener(localStoragePlaylistEvent, getCustomPlaylist);
});


/** 获取用户自定义歌单 */
function getCustomPlaylist() {
    customPlaylist.value = getAllCustomPlaylist();
}
/** 创建自定义歌单 */
function createPlaylist() {
    createPlaylistVisible.value = true;
}
/**
 * 收藏歌曲至歌单
 * @param playlistid 收藏至的歌单id
 */
function collectMusic(playlistid: number) {
    for (let i = 0; i < customPlaylist.value.length; i++) {
        if (customPlaylist.value[i].id === playlistid) {
            // 是否存在重复歌曲
            let result = customPlaylist.value[i].tracks.find(music => {
                if (popoutHoldData.value?.type === AudioInfoType.bili) {
                    return popoutHoldData.value.cid === music.cid;
                }
                return popoutHoldData.value?.id === music.id && popoutHoldData.value.type === music.type;
            });
            if (result) {
                ElMessage({
                    type: 'error',
                    message: '歌单内歌曲重复'
                });
                return;
            }
            customPlaylist.value[i].tracks.unshift(popoutHoldData.value as MusicInfo);
            customPlaylist.value[i].trackCount += 1;
            customPlaylist.value[i].cover = customPlaylist.value[i].tracks[0].cover || defaultMusicImg;
            break;
        }
    }
    updateCustomPlaylist(customPlaylist.value);
    ElMessage({
        type: 'success',
        message: '已收藏到歌单'
    });
}
</script>
