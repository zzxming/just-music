<script setup lang="ts">
</script>

<template>
	<Suspense>
		<template #default>
			<router-view></router-view>
		</template>

		<template #fallback>
        	<span>Loading...</span>
        </template>
    </Suspense>
</template>

<style scoped>
</style>
