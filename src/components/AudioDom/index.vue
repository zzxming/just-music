<template>
    <div>
        <audio ref="audioMedia" :src="readAudioSrc" controls></audio>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { usePlayerStore } from '../../store/Player'
import { mediaSrc } from '../../assets/api'
import { storeToRefs } from 'pinia'

const audioMedia = ref<HTMLAudioElement>();
const playerStore = usePlayerStore();
const { audioSrc } = storeToRefs(playerStore);
const { setAudio, setAudioSrc } = playerStore;

let readAudioSrc = computed({
    get: () => {
        return mediaSrc(audioSrc.value)
    },
    set:() => {

    }
});

onMounted(() => {
    const media = audioMedia.value;
    if (media) {
        setAudio(media);
        media.addEventListener('ended', () => {
            setAudioSrc(`/music/${Math.floor(Math.random() * 53) + 1}`)
        })
    }
})

</script>