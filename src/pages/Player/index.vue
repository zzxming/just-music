<template>
    <div>
        some
        <audio ref="media" :src="audioUrl" controls autoplay></audio>
        <!-- <audio ref="media" :src="mediaSrc(`/bili/audio?bv=BV1KJ411C7qF`)" controls></audio> -->
        <div v-if="loading">loading...</div>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { mediaSrc } from '../../assets/api';
import { getCloudPlaylistHighquality, getMusicSrcWithCloudId } from '../../assets/cloudApi';

let audioUrl = ref(mediaSrc(`/music/${Math.floor(Math.random() * 53) + 1}`))
let media = ref<HTMLAudioElement>()
let loading = ref(false)
let page = ref(1)

// searchLocalMusic('BV1KJ411C7qF')
// .then(response => {
//     console.log(response)
// })

// searchLocalMusic('BV1WR4y1j7Ar')
// .then(response => {
//     console.log(response)
// })

onMounted(() => {


    getMusicSrc()
    test()
    
    if (media.value) {
        let audio = media.value;
        audio.volume = 0.2
        audio.addEventListener('canplay', () => {
            console.log('canplay')
            audio.play();
        })
        audio.addEventListener('ended', () => {
            console.log('随机换')
            audioUrl.value = mediaSrc(`/music/${Math.floor(Math.random() * 53) + 1}`)
        })
    }

    
})

async function test() {
    let [err, result] = await getCloudPlaylistHighquality()
    if (err) {
        console.log(err)
        return;
    }
    if (result) {
        const { code, data } = result.data;
        console.log(data)
    }
}


async function getMusicSrc() {
    let [err, result] = await getMusicSrcWithCloudId(1987604310);
    if (err) {
        console.log(err)
        return;
    }
    if (result) {
        const { code, data } = result.data;
        if (code === 1) {
            audioUrl.value = data.src
        }
    }
}

</script>


<style lang="less" scoped>

</style>