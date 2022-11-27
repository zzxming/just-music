<template>
    <div class="setting" @click="dialogVisible = true">
        <el-icon><IconEpSetting /></el-icon>
    </div>

    <el-dialog
        class="setting_dialog"
        v-model="dialogVisible"
        center 
    >
    <div class="setting_line">
        <span class="label">哔哩哔哩音频快速加载：</span>
        <el-switch
            v-model="audioLoadMode"
            style="--el-switch-on-color: #f89898;"
            @change="audioLoadModeChange"
        />
        <el-popover
            placement="top-start"
            :width="200"
            trigger="hover"
            content="快速加载模式下手机用户无法手动控制歌曲播放进度"
        >
            <template #reference>
                <span class="setting_tip">
                    <el-icon><IconAntDesignQuestionCircleOutlined /></el-icon>
                </span>
            </template>
        </el-popover>
    </div>
    </el-dialog>
</template>

<style lang="less" scoped>
.setting {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    font-size: 28px;
    cursor: pointer;
    color: var(--el-color-info);
    &:hover {
        color: var(--el-color-info-dark-2);
    }
    &_line {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        .label {
            min-width: 60px;
        }
    }
    &_tip {
        margin-left: 10px;
    }
}
</style>
<style lang="less">
.setting {
    &_dialog {
        width: 400px;
        z-index: 2001;
    }
}
@media screen and (max-width: 550px) {
    .setting {
        &_dialog {
            &.el-dialog {
                width: 90%;
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { getAduioLoadMode, setAudioLoadMode } from '@/utils/localStorage';

const dialogVisible = ref(false);
const audioLoadMode = ref(getAduioLoadMode() === '1' ? true : false);

function audioLoadModeChange(val: boolean | string | number) {
    setAudioLoadMode(val as boolean);
}
</script>

