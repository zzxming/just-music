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
import { getMusicInfoWithId } from '../../assets/localApi';
import { random } from 'lodash';
import { AudioInfoType } from '../../interface';

const audioMedia = ref<HTMLAudioElement>();
const playerStore = usePlayerStore();
const { audioSrc } = storeToRefs(playerStore);
const { setAudio, setAudioSrc, setAudioInfo } = playerStore;

let readAudioSrc = computed({
    get: () => {
        console.log(audioSrc)
        return mediaSrc(audioSrc.value)
    },
    set:() => {

    }
});

onMounted(() => {
    let randomId = random(54,55);
    getLocalMusicInfoWithId(randomId);

    const media = audioMedia.value;
    if (media) {
        setAudio(media);
        media.addEventListener('ended', () => {
            setAudioSrc(`/music/${random(1, 55)}`)
        })
    }
})

async function getLocalMusicInfoWithId(id: number) {
    let [err, result] = await getMusicInfoWithId(id);
    if (!err && result) {
        let { code, data } = result.data
        setAudioInfo({
            type: AudioInfoType.local,
            ...data
        });
        setAudioSrc(`/music/${data.music_id}`)
    }
}

</script>