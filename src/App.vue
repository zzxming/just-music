
<template>
	<HeaderBar></HeaderBar>

	<router-view></router-view>

	<PlayerControlBar></PlayerControlBar>
	<AudioDom></AudioDom>
    <CreatePlaylist :visible="createPlaylistVisible" @close="createPlaylistVisible = false" />
	<CloudLogin />
	<MusicAndPlaylistPopout />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import PlayerControlBar from '@/components/PlayerControlBar/index.vue'
import AudioDom from '@/components/AudioDom/index.vue';
import HeaderBar from '@/components/HeaderBar/index.vue';
import CreatePlaylist from '@/components/CreatePlaylist/index.vue';
import CloudLogin from '@/components/CloudLogin/index.vue';
import MusicAndPlaylistPopout from '@/components/Popout/MusicAndPlaylistPopout.vue';
import { usePopoutStore } from '@/store/popout';

const popoutStore = usePopoutStore();
const { createPlaylistVisible } = storeToRefs(popoutStore);

</script>
