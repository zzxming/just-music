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
    if (!(popoutHoldData.value instanceof Array) && popoutHoldData.value?.id === 0) {
        ElMessage({
            type: 'error',
            message: '歌曲信息错误'
        })
        return;
    }
    let templist = [...customPlaylist.value];

    if (popoutHoldData.value instanceof Array) {
        // 一次添加多首歌曲
        let holdData = popoutHoldData.value as MusicInfo[];
        for (let i = 0; i < templist.length; i++) {
            if (templist[i].id === playlistid) {

                holdData.map(data => {
                    let sameSong = templist[i].tracks.find(song => song.id === data.id && song.cid === data.cid)
                    if (!sameSong) {
                        templist[i].tracks.unshift(data);
                        templist[i].trackCount += 1;
                    }
                })
                templist[i].cover = templist[i].tracks[0].cover || defaultMusicImg;
                break;
            }
        }
    }
    else {
        // 添加一首歌曲
        let holdData = popoutHoldData.value as MusicInfo;

        for (let i = 0; i < templist.length; i++) {
            if (templist[i].id === playlistid) {
                // 是否存在重复歌曲
                let result = templist[i].tracks.find(music => {
                    if (holdData.type === AudioInfoType.bili) {
                        return holdData.cid === music.cid;
                    }
                    return holdData.id === music.id && holdData.type === music.type;
                });
                if (result) {
                    ElMessage({
                        type: 'error',
                        message: '歌单内歌曲重复'
                    });
                    return;
                }
                templist[i].tracks.unshift(holdData);
                templist[i].trackCount += 1;
                templist[i].cover = templist[i].tracks[0].cover || defaultMusicImg;
                break;
            }
        }
    }
    updateCustomPlaylist(templist);
    ElMessage({
        type: 'success',
        message: '已收藏到歌单'
    });
}
</script>
