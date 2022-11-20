<template>
    <audio ref="audioMedia" :src="loadAudioSrc" preload="auto" @error="loadError"></audio>
</template>

<script lang="ts" setup>
import { useAudioContorlStore, usePlayerStore } from '@/store'
import { getAduioLoadMode } from '@/utils/localstorage';
import { jointQuery } from '@/assets/api';
import { ElMessage } from 'element-plus';
import { AudioInfoType } from '@/interface';

const audioMedia = ref<HTMLAudioElement>();
const playerStore = usePlayerStore();
const { audioInfo, audioSrc } = storeToRefs(playerStore);
const { setAudio } = playerStore;
const audioControlStore = useAudioContorlStore();
const { bindAudioEvent, playNext } = audioControlStore;


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
    // if (audioSrc.value) {
    //     // console.log(audioSrc.value)
    //     audio.load();
    // }
});
/** 真实加载 audio src */
const loadAudioSrc = computed(() => {
    if (audioSrc.value === null) return undefined
    if (audioInfo.value.type !== AudioInfoType.bili) return audioSrc.value;

    let mode = getAduioLoadMode();
    return jointQuery(audioSrc.value, {
        partialrange: mode
    })
})


/** 加载失败重试 */
function loadError() {
    // 当有播放路径时再重试
    if (audioSrc.value === undefined || audioSrc.value === null) return;
    if (audioMedia.value) {

        console.log(audioMedia.value.error)
        switch(audioMedia.value.error?.code) {
            case 1: {
                ElMessage({
                    type: 'error',
                    message: '请求被中断'
                })
                break;
            }
            case 2: {
                ElMessage({
                    type: 'error',
                    message: '网络错误'
                })
                break;
            }
            case 3: {
                ElMessage({
                    type: 'error',
                    message: '解码失败'
                })
                break;
            }
            case 4: {
                ElMessage({
                    type: 'error',
                    message: '资源不可用'
                })
                break;
            }
            default: {
                ElMessage({
                    type: 'error',
                    message: '出现了预期外的错误'
                })
                break;
            }
        }
        if (audioMedia.value.error?.code === 2) {
            setTimeout(() => {
                audioMedia.value?.load();
            }, 3000)
        }
        else {
            setTimeout(() => {
                playNext();
            }, 1500)
        }
    }
}

</script>