<template>
    <div class="playtype" @click="changePlayMode">
        <IconCusLoopPlay v-show="curPlayMode === PlayMode.loop" class="el-icon playtype_loop" />
        <IconCusSinglePlay v-show="curPlayMode === PlayMode.single" class="el-icon playtype_single" />
        <IconCusRandomPlay v-show="curPlayMode === PlayMode.random" class="el-icon playtype_random" />
        <IconCusSequentialPlay v-show="curPlayMode === PlayMode.sequential" class="el-icon playtype_sequential" />
    </div>

</template>

<style lang="less" scoped>
.playtype {
    font-size: 30px;
    .el-icon {
        fill: inherit;
    }
}
</style>

<script lang="ts" setup>
import { usePlayerStore } from '@/store/player';
import { PlayMode } from '@/interface';

const playerStore = usePlayerStore();
const { curPlayMode } = storeToRefs(playerStore);
const { changePlayMode } = playerStore;
</script>
