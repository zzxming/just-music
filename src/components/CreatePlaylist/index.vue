<template>
    <el-dialog 
        class="creator" 
        v-model="visible" 
        width="400px" 
        center 
        :destroy-on-close="true"
        :before-close="() => emit('close')"
    >
        <el-form ref="formRef" :model="playlistData" :rules="rules" v-loading="loading">
            <el-form-item prop="title">
                <el-input class="creator_input" v-model="playlistData.title" placeholder="请输入新建歌单标题" />
            </el-form-item>
            <el-form-item prop="playlistLink">
                <el-input class="creator_input" v-model="playlistData.playlistLink" placeholder="请输入要导入的网易云音乐歌单id" />
            </el-form-item>
        </el-form>

        <template #header>
            <span class="creator_title">新建歌单</span>
        </template>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="danger" round @click="submitForm">创建</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.creator {
    &_input {
        :deep(.is-focus) {
            box-shadow: 0 0 0 1px var(--el-color-danger) inset;
        }
    }
    &_title {
        font-weight: 700;
    }
}
</style>
<style lang="less">
.creator {
    .el-dialog__headerbtn {
        &:hover,
        &:focus {
            .el-dialog__close {
                color: var(--el-color-danger);
            }
        }
    }
}
</style>

<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { getCloudPlaylistTrack } from '@/assets/cloudApi';
import { MusicInfo, AudioInfoType } from '@/interface';
import { formatMusicInfo } from '@/utils';
import { setCustomPlaylist } from '@/utils/localStorage';

const { visible } = defineProps<{
    visible: boolean
}>();
const emit = defineEmits<{
    (event: 'close'): void
}>();

const formRef = ref<FormInstance>();
const playlistData = ref({
    title: '',
    playlistLink: ''
});
const rules = reactive({
    title: [
        { required: true, message: '歌单名不能为空' },
        { max: 40, message: '歌单名不能超出40个字符' }
    ]
});
const loading = ref(false);

/** 验证字段正确性 */
function submitForm() {
    if (!formRef.value) return;
    formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            let result = await createPlaylist();
            loading.value = false;
            if (result.status) {
                ElMessage({
                    type: 'success',
                    message: result.message
                });
                emit('close');
                formRef.value?.resetFields();
                return true;
            }
            else {
                return false;
            }
        }
        else {
            console.log('error submit!')
            return false
        }
    });
}
/** 创建歌单 */
async function createPlaylist(): Promise<{status: boolean, message: string}> {


    let link = playlistData.value.playlistLink;
    let id = '';
    // https://music.163.com/playlist?id=5396146672&userid=293778248
    let query = link.split('?').slice(1).join('').split('&');
    for (let i = 0; i < query.length; i++) {
        let cur = query[i].split('=');
        if (cur[0] === 'id') {
            id = cur[1];
            break;
        }
    }
    // console.log(id)
    let songs: MusicInfo[] = [];
    if (id && !isNaN(Number(id))) {
        let [err, result] = await getCloudPlaylistTrack({id: Number(id)});
        if (!err && result) {
            songs = formatMusicInfo(result.data.data, AudioInfoType.cloud);
        }
        if (err) {
            return {
                status: false,
                message: err.data.message
            }
        }
    }
    setCustomPlaylist(playlistData.value.title, songs);
    // 获取歌单内的歌曲信息
    // 拿不到返回false和'歌单id不正确'的信息
    // 拿到后对信息格式化, 带type
    // 把格式化后的数组保存
    // 把最后数据保存到localStorage
    return {
        status: true,
        message: '创建成功'
    };
}

</script>

