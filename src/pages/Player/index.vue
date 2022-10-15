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
import { getPlaylistHighquality, getPlaylistTrack, getMusicSrcWithCloudId, mediaSrc } from '../../assets/api';

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

    getPlaylistHighquality()
    .then(res => {
        const {code, playlist} = res.data
        if (code !== 1) return;
        console.log(playlist)
        getPlaylistTrack({id: playlist[0].id})
        .then(res => {
            console.log(res)
        })
    })

    getMusicSrcWithCloudId(1987604310)
    .then(res => {
        const { code, src } = res.data;
        if (code === 1) {
            audioUrl.value = src;
        }
    })


    // searchCloudMusic('花玲', page.value)
    // .then(res => {
    //     console.log(res)
    // })

    
    if (media.value) {
        media.value.addEventListener('canplay', () => {
            console.log('canplay')
        })
        media.value.addEventListener('ended', () => {
            console.log('随机换')
            audioUrl.value = mediaSrc(`/music/${Math.floor(Math.random() * 53) + 1}`)
        })
    }

    
})



</script>


<style lang="less" scoped>

</style>