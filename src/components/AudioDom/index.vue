<template>
    <div>
        <audio v-if="audioInfo.src !== ''" ref="audioMedia" :src="audioInfo.src"></audio>
    </div>
</template>

<script lang="ts" setup>
import {  onMounted, ref, watch } from 'vue'
import { usePlayerStore } from '../../store/Player'
import { storeToRefs } from 'pinia'
import { getLocalMusicInfoWithId } from '../../assets/localApi';
import { getCloudMusicInfoWithId } from '../../assets/cloudApi';
import { AudioInfoType } from '../../interface';

const audioMedia = ref<HTMLAudioElement>();
const playerStore = usePlayerStore();
const { audioInfo } = storeToRefs(playerStore);
const { setAudio, setAudioInfo } = playerStore;

/** audioMedia 最初可能不显示, 当显示时再进行绑定 */
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
        // load 后不能直接执行 play
        setTimeout(() => {
            audioMedia.value && audioMedia.value.play()
        }, 0);
    }
})

onMounted(() => {
    // getMusicInfoWithId(random(54,55), AudioInfoType.local);
    getMusicInfoWithId(569105662, AudioInfoType.cloud);
})
/** 根据 id 获取本地的音频信息 */
async function getMusicInfoWithId(id: number, type: AudioInfoType) {
    
    let [err, result] = type === AudioInfoType.local ? await getLocalMusicInfoWithId({id}) : await getCloudMusicInfoWithId({ids: id});
    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data
        setAudioInfo({
            type,
            ...data
        });
        // setAudioSrc(`/music/${data.music_id}`)
    }
}

</script>