<template>
    <div>
        <audio v-if="!!audioSrc" ref="audioMedia" :src="audioSrc" @error="loadError"></audio>
    </div>
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
    if (audio) {
        audio.load();
    }
});

/** 加载失败重试 */
function loadError(e: Event) {
    setTimeout(() => {
        audioMedia.value && audioMedia.value.load();
    }, 3000)
}

</script>