<template>
    <div class="playtype" @click="changePlayMode">
        <el-icon><IconCusLoopPlay v-show="curPlayMode === PlayMode.loop" class="el-icon playtype_loop" /></el-icon>
        <el-icon><IconCusSinglePlay v-show="curPlayMode === PlayMode.single" class="el-icon playtype_single" /></el-icon>
        <el-icon><IconCusRandomPlay v-show="curPlayMode === PlayMode.random" class="el-icon playtype_random" /></el-icon>
        <el-icon><IconCusSequentialPlay v-show="curPlayMode === PlayMode.sequential" class="el-icon playtype_sequential" /></el-icon>
    </div>

</template>

<style lang="less" scoped>
.playtype {
    font-size: 30px;
    position: relative;
    width: 1em;
    height: 1em;
    .el-icon {
        position: absolute;
        left: 0;
        top: 0;
        fill: inherit;
        width: 1em;
        height: 1em;
    }
}
</style>

<script lang="ts" setup>
import { usePlayerStore } from '@/store';
import { PlayMode } from '@/interface';

const playerStore = usePlayerStore();
const { curPlayMode } = storeToRefs(playerStore);
const { changePlayMode } = playerStore;
</script>
