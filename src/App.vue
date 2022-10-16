
<template>
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
import PlayerControlBar from './components/PlayerControlBar/index.vue'
import AudioDom from './components/AudioDom/index.vue';
import { onMounted } from 'vue';

onMounted(() => {
})

</script>