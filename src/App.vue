
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
import { usePopoutStore } from '@/store/popout';

const popoutStore = usePopoutStore();
const { createPlaylistVisible } = storeToRefs(popoutStore);

</script>
