
<template>
	<HeaderBar></HeaderBar>

	<div class="main">
		<!-- <router-view></router-view> -->
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
			</keep-alive>
			<component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
		</router-view>
	</div>

	<PlayerControlBar></PlayerControlBar>
	<AudioDom></AudioDom>
	<CreatePlaylist :visible="createPlaylistVisible" @close="createPlaylistVisible = false" />
	<CloudLogin />
	<MusicAndPlaylistPopout />
    <Playinglist />
	<FullScreenMask />
	<ToTop />
</template>

<style lang="less" scoped>
.main {
	max-width: 1280px;
	margin: 0 auto;
}
</style>

<script setup lang="ts">
import { usePopoutStore } from '@/store/popout';

const popoutStore = usePopoutStore();
const { createPlaylistVisible } = storeToRefs(popoutStore);

</script>
