
<template>
	<HeaderBar></HeaderBar>
	<Suspense>
		<template #default>
			<router-view></router-view>
		</template>

		<template #fallback>
        	<div class="loading">Loading...</div>
        </template>
    </Suspense>
	<PlayerControlBar></PlayerControlBar>
	<AudioDom></AudioDom>
    <CreatePlaylist :visible="createPlaylistVisible" @close="createPlaylistVisible = false" />
	<CloudLogin />
	<MusicAndPlaylistPopout />
</template>

<style lang="less" scoped>
.loading {
	position: fixed;
	inset: 0;
	margin: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30px;
}
</style>


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
const { 
	createPlaylistVisible,
} = storeToRefs(popoutStore);

</script>