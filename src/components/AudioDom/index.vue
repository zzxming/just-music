<template>
    <audio ref="audioMedia" :src="audioSrc || undefined" preload="auto" @error="loadError"></audio>
</template>

<script lang="ts" setup>
import { useAudioContorlStore, usePlayerStore } from '@/store'

const audioMedia = ref<HTMLAudioElement>();
const playerStore = usePlayerStore();
const { audioInfo, audioSrc } = storeToRefs(playerStore);
const { setAudio, setAudioInfo } = playerStore;
const audioControlStore = useAudioContorlStore();
const { bindAudioEvent } = audioControlStore;


// audioMedia 最初可能不显示, 当显示时再进行绑定
watch(audioMedia, () => {
    if (audioMedia.value) {
        setAudio(audioMedia.value);
        bindAudioEvent(audioMedia.value);
    }
});
// 更换 src 时需要 load audio
watch(audioInfo, () => {
    let audio = audioMedia.value;
    if (!audio) return;
    if (audioInfo.value.noCopyrightRcmd || audioInfo.value.st === -200) {
        return;
    } 
    if (audioSrc.value) {
        // console.log(audioSrc.value)
        audio.load();
    }
});

/** 加载失败重试 */
function loadError(e: Event) {
    // 当有播放路径时再重试
    if (audioSrc.value === undefined || audioSrc.value === null) return;
    setTimeout(() => {
        // audioMedia.value && audioMedia.value.load();
        setAudioInfo(audioInfo.value);
    }, 3000)
}

</script>