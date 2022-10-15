<script setup lang="ts">
</script>

<template>
	<Suspense>
		<template #default>
			<router-view></router-view>
		</template>

		<template #fallback>
        	<div class="loading">Loading...</div>
        </template>
    </Suspense>
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
