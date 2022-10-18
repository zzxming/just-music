<template>
    song
    <div v-show="!loading">
        {{audioInfo}}
    </div>
</template>

<style lang="less" setup></style>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getLocalMusicInfoWithId } from '../../assets/localApi'
import { getCloudMusicInfoWithId } from '../../assets/cloudApi'
import { AudioInfoType, MusicInfo, LocalAudioInfo } from '../../interface'
import { usePlayerStore } from '../../store/player'
import { formatMusicInfo } from '../../utils'
import { storeToRefs } from 'pinia';


const props = defineProps<{
    id: number
    t: AudioInfoType
}>();
const playerStore = usePlayerStore();
const {  } = storeToRefs(playerStore);
const {  } = playerStore;


const loading = ref(true);
const audioInfo = ref<MusicInfo>();


onMounted(() => {
    // getMusicInfoWithId(props.id, props.t);
    // getMusicInfoWithId(1, AudioInfoType.local);
    getMusicInfoWithId(569105662, AudioInfoType.cloud);
    // getCloudMusicInfoWithId({ids:569105662})
});

/** 获取歌曲信息 */
async function getMusicInfoWithId(id: number, type: AudioInfoType) {
    loading.value = true;
    let [err, result] = type === AudioInfoType.local ? await getLocalMusicInfoWithId({id}) : await getCloudMusicInfoWithId({ids: id});
    loading.value = false;
    if (!err && result) {
        // console.log(result)
        let { code, data } = result.data;
        
        // 因为不知道返回的是什么类型, 合并的数据类型会有问题
        audioInfo.value = await formatMusicInfo({type, ...data} as LocalAudioInfo)
        
    }
}

</script>