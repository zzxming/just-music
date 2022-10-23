<template>
    <div class="playtype" @click="changePlayMode">
        <LoopPlay v-show="curPlayMode === PlayMode.loop" class="el-icon playtype_loop" />
        <SinglePlay v-show="curPlayMode === PlayMode.single" class="el-icon playtype_single" />
        <RandomPlay v-show="curPlayMode === PlayMode.random" class="el-icon playtype_random" />
        <SequentialPlay v-show="curPlayMode === PlayMode.sequential" class="el-icon playtype_sequential" />
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
import LoopPlay from '@/assets/iconfont/loopPlay.vue';
import RandomPlay from '@/assets/iconfont/randomPlay.vue';
import SinglePlay from '@/assets/iconfont/singlePlay.vue';
import SequentialPlay from '@/assets/iconfont/sequentialPlay.vue';
import { usePlayerStore } from '@/store/player';
import { storeToRefs } from 'pinia';
import { PlayMode } from '@/interface';

const playerStore = usePlayerStore();
const { curPlayMode } = storeToRefs(playerStore);
const { changePlayMode } = playerStore;
</script>
