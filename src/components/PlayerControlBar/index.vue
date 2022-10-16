
<template>
    <div v-if="audio" v-show="showPlayerControl" class="botcontrol">
        <div class="botcontrol_right">
            <el-icon class="botcontrol_btn-icon skipback"><Skipback /></el-icon>
            <el-icon class="botcontrol_btn-icon play" v-show="audio.paused"><Play /></el-icon>
            <el-icon class="botcontrol_btn-icon pause" v-show="!audio.paused"><Pause /></el-icon>
            <el-icon class="botcontrol_btn-icon skipforward"><Skipforward /></el-icon>
        </div>
        <div class="botcontrol_info">
            <div class="botcontrol_info_cover">
                <img class="botcontrol_info_cover-img" />
            </div>
            <div class="botcontrol_info_mid">
                <div class="botcontrol_info_title">
                    <div class="botcontrol_info_song">スタート</div>
                    <div class="botcontrol_info_singer">
                        <span class="botcontrol_info_singer-name">花玲</span> /
                        <span class="botcontrol_info_singer-name">LCwwww</span>
                    </div>
                </div>
                <div class="botcontrol_info_bar-time">
                    <div class="botcontrol_info_bar">
                        <div class="botcontrol_info_bg"></div>
                        <div class="botcontrol_info_progress">
                            <div class="botcontrol_info_dot"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="botcontrol_info_time">
                <span class="botcontrol_info_time-current">00:99:99</span>
                <span class="botcontrol_info_time-duration"> / 00:99:99</span>
            </div>
        </div>
        <div class="botcontrol_left">
            <el-icon class="botcontrol_btn-icon play" v-show="audio.paused"><Play /></el-icon>
            <el-icon class="botcontrol_btn-icon pause" v-show="!audio.paused"><Pause /></el-icon>
            <el-icon class="botcontrol_btn-icon volume" v-show="!audio.muted"><Volume /></el-icon>
            <el-icon class="botcontrol_btn-icon mute" v-show="audio.muted"><Volume_mute /></el-icon>
            <el-icon class="botcontrol_btn-icon list"><List /></el-icon>
        </div>
    </div>
</template>

<style lang="less" scoped>
.textOverflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.botcontrol {
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: var(--el-fill-color-blank);
    box-shadow: var(--el-box-shadow-dark);
    transition: bottom .3s linear;
    z-index: 10;
    &_right {
        display: flex;
        align-items: center;
    }
    &_left {
        display: flex;
        align-items: center;
        justify-items: space-around;
        .play {
            display: none;
        }
        .pause:extend(.play) {

        }
    }
    &_btn {
        &-icon {
            cursor: pointer;
            font-size: 30px;
            fill: var(--el-text-color-regular);
            margin: 0 5px;
            &:hover {
                fill: var(--el-text-color-primary);
            }
            &.play {
                font-size: 50px;
            }
            &.pause:extend(.play) {
            }
        }
    }
    &_info {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 70%;
        height: 100%;
        &_mid {
            display: flex;
            flex-direction: column;
            flex: 1;
            margin-left: 10px;
        }
        &_cover {
            width: 72px;
            height: 72px;
        }
        &_title:extend(.textOverflowEllipsis) {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex: 1 1 auto;
            height: 48px;
        }
        &_song:extend(.textOverflowEllipsis) {
            width: 20%;
        }
        &_singer:extend(.textOverflowEllipsis) {
            color: var(--el-color-danger-light-5);
            &-name {
                &:hover {
                    color: var(--el-color-danger);
                }
            }
        }
        .progressBar(@color) {
            height: 100%;
            border-radius: 6px;
            background-color: @color;
        }
        &_bar {
            &-time {
                .progressBar(transparent);
                height: 12px;
            }
            position: relative;
            .progressBar(var(--el-color-info-light-8));
            z-index: 1;
        }
        &_progress {
            position: absolute;
            top: 0;
            left: 0;
            .progressBar(var(--el-color-danger-light-5));
            z-index: 3;
        }
        &_bg {
            .progressBar(var(--el-color-info-light-3));
            z-index: 2;
        }
        &_dot {
            box-sizing: border-box;
            position: absolute;
            top: -4px;
            right: -10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid var(--el-color-info);
            background-color: var(--el-color-info-light-9);
            z-index: 4;
            cursor: pointer;
            &:hover {
                border: 2px solid var(--el-color-info-dark-2);
            }
        }
        &_time {
            min-width: 100px;
            font-size: 14px;
            color: var(--el-color-info);
            &-current {
                color: var(--el-text-color-primary);
            }
            &-duration {
            }
        }
    }
}
@media screen and (max-width: 750px) {
    .botcontrol {
        &_right {
            display: none;
        }
        &_left {
            .volume {
                display: none;
            }
            .mute:extend(.volume) {

            }
            .play {
                display: block;
                font-size: 30px;
            }
        }
        &_info {
            &_time {
                display: none;
            }
            &_song {
                width: 40%;
            }
        }
    }
}
@media screen and (max-width: 400px) {
    .botcontrol {
        &_info {
            &_cover {
                // display: none;
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onMounted, computed, Ref } from 'vue';
import { usePlayerStore } from '../../store/player';
import Volume from '../../assets/iconfont/volume.vue';
import Pause from '../../assets/iconfont/pause.vue';
import Play from '../../assets/iconfont/play.vue';
import Skipback from '../../assets/iconfont/skipback.vue';
import Skipforward from '../../assets/iconfont/skipforward.vue';
import Volume_mute from '../../assets/iconfont/volume_mute.vue';
import List from '../../assets/iconfont/list.vue';

const playerStore = usePlayerStore();
const { audio, showPlayerControl } = storeToRefs(playerStore);
const { changePlayerControlState } = playerStore;

onMounted(() => {
    changePlayerControlState(true)
});


</script>

