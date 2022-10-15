<template>
    <div class="content">
        <div class="content_title">
            <span class="content_title_text">{{ title }}</span>
        </div>
        <div class="content_content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
.content {
    position: relative;
    width: 100%;
    padding: 40px;
    &_title {
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        font-weight: 700;
        &_text {
            display: inline-block;
            &::after {
                content: '>';
                display: inline-block;
                margin-left: 6px;
                font-weight: 400;
            }
        }
    }
}

</style>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { getCloudPlaylistHighquality, playlistVal } from '../../assets/cloudApi';
import { CloudPlaylist } from '../../interface'
import { ElMessage } from 'element-plus';


defineProps({
    title: String
});

let loading = ref(false);
let lasttime = ref(0);
let cat = ref(playlistVal.All);
let playlist = reactive<CloudPlaylist[]>([]);


const getCloudPlaylistHighqualityData = async () => {
    loading.value = true;
    let [err, result] = await getCloudPlaylistHighquality(lasttime.value)
    loading.value = false;
    if (result) {
        const { code, data } = result.data;
        playlist = data.playlist;
        lasttime.value = data.lasttime;
    }
    if (err) {
        console.log(err)
        ElMessage({
            type: 'error',
            message: err.name
        })
        return;
    }
}

</script>

