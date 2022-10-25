<template>
    <Popout :show="show" :position="position" @close="() => emit('close')">
        <PopoutItem @click="play">播放</PopoutItem>
        <PopoutItem botBorder @click="nextPlay">下一首播放</PopoutItem>
        <PopoutItem v-if="!isMusic" @click.stop="deletePlaylist">删除歌单</PopoutItem>
        <PopoutItem v-if="isMusic" @click="collect">收藏到歌单</PopoutItem>
    </Popout>
</template>

<style></style>

<script lang="ts" setup>
import { toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { PlaylistInfo, PlaylistType, MusicInfo } from '@/interface';
import { getCloudPlaylistTrack } from '@/assets/cloudApi';
import { usePlaylistStore } from '@/store/playinglist';
import { usePlayerStore } from '@/store/player';
import { getCustomPlaylistWithId, deleteCustomPlaylistWithId } from '@/utils/localStorage';
import Popout, { PopoutPosition } from '@/components/Popout/index.vue';
import PopoutItem from '@/components/PopoutItem/index.vue';
import { formatMusicInfo } from '@/utils';

const emit = defineEmits<{
    (e: 'close'): void
}>();

const props = withDefaults(defineProps<{
    show: boolean
    position: PopoutPosition
    holdData: PlaylistInfo | MusicInfo | undefined
    isMusic?: boolean
}>(), {
    isMusic: false
});
const { show, holdData, position, isMusic } = toRefs(props);

const playlistStore = usePlaylistStore();
const playerStore = usePlayerStore();
const {  } = storeToRefs(playlistStore);
const { playinglistReplace, addToNextPlay, addToPlaylist } = playlistStore;
const { resetAudioInfo } = playerStore;

/** 播放列表替换 */
async function play() {
    if (holdData.value) {
        // 歌曲
        if (isMusic.value) {
            let result = addToPlaylist(holdData.value as MusicInfo);
            return;   
        }

        // 歌单
        let data = holdData.value as PlaylistInfo;
        if (data.type === PlaylistType.localStorage) {
            let playlistInfo = getCustomPlaylistWithId(data.id);
            if (playlistInfo) {
                resetAudioInfo();
                playinglistReplace(playlistInfo.tracks);
            }
        }
        else {
            // let [err, result] = data.type === PlaylistType.cloud ? await getCloudPlaylistTrack() : await ();
            let [err, result] = await getCloudPlaylistTrack({id: data.id});
            if (!err && result) {
                resetAudioInfo();
                playinglistReplace(formatMusicInfo(result.data.data));
            }
        }
    }
}
/** 歌单添加到下一首播放 */
async function nextPlay() {
    if (holdData.value) {
        // 歌曲
        if (isMusic.value) {
            let result = addToNextPlay(holdData.value as MusicInfo);
            return;
        }

        // 歌单
        let data = holdData.value as PlaylistInfo;
        if (data.type === PlaylistType.localStorage) {
            let playlistInfo = getCustomPlaylistWithId(data.id);
            if (playlistInfo) {
                addToNextPlay(playlistInfo.tracks);
            }
        }
        else {
            // let [err, result] = data.type === PlaylistType.cloud ? await getCloudPlaylistTrack() : await ();
            let [err, result] = await getCloudPlaylistTrack({id: data.id});
            if (!err && result) {
                addToNextPlay(formatMusicInfo(result.data.data));
            }
        }
    }
}
/** 删除创建的歌单 */
function deletePlaylist() {
    console.log(isMusic.value)
    if (isMusic.value) return;
    let data = holdData.value as PlaylistInfo;
    if (!data) return;
    deleteCustomPlaylistWithId(data.id);
    emit('close');
}
/** 收藏歌曲到歌单 */
function collect() {

}

</script>

