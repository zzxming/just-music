<template>
    <div>
        <audio v-if="audioSrc !== ''" ref="audioMedia" :src="audioSrc" @error="loadError"></audio>
    </div>
</template>

<script lang="ts" setup>
import {  onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/store/Player'
import { getLocalMusicInfoWithId } from '@/assets/localApi';
import { getCloudMusicInfoWithId } from '@/assets/cloudApi';
import { AudioInfoType, LocalAudioInfo } from '@/interface';
import { ElMessageBox } from 'element-plus';

const audioMedia = ref<HTMLAudioElement>();
const playerStore = usePlayerStore();
const { audioInfo, audioSrc } = storeToRefs(playerStore);
const { setAudio, setAudioInfo } = playerStore;

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

watch(audioSrc, (val) => {
    console.log(val)
    if (val === null) {
        ElMessageBox.alert(`歌曲 ${audioInfo.value.title} 是无法试听的 vip 歌曲`)
    }
})

onMounted(() => {
    // getMusicInfoWithId(random(54,55), AudioInfoType.local);
    // getMusicInfoWithId(569105662, AudioInfoType.cloud);
})
/** 根据 id 获取本地的音频信息 */
async function getMusicInfoWithId(id: number, type: AudioInfoType) {
    
    let [err, result] = type === AudioInfoType.local ? await getLocalMusicInfoWithId({id}) : await getCloudMusicInfoWithId({ids: id});
    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data;
        // 因为不知道返回的是什么类型, 合并的数据类型会有问题
        setAudioInfo({type, ...data} as LocalAudioInfo);
        // setAudioSrc(`/music/${data.music_id}`)
    }
}
/** 加载失败重试 */
function loadError(e: Event) {
    audioMedia.value && audioMedia.value.load();
}

</script>