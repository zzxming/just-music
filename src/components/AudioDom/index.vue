<template>
    <audio ref="audioMedia" :src="audioSrc || undefined" preload="auto" @error="loadError"></audio>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/store/Player'

const audioMedia = ref<HTMLAudioElement>();
const playerStore = usePlayerStore();
const { audioInfo, audioSrc } = storeToRefs(playerStore);
const { setAudio } = playerStore;

// audioMedia 最初可能不显示, 当显示时再进行绑定
watch(audioMedia, (val, preVal) => {
    if (val) {
        setAudio(val)
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
        audio.load();
    }
});

/** 加载失败重试 */
function loadError(e: Event) {
    // 当有播放路径时再重试
    if (!audioSrc.value) return;
    setTimeout(() => {
        audioMedia.value && audioMedia.value.load();
    }, 3000)
}

</script>