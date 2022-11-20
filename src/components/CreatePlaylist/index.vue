<template>
    <el-dialog 
        class="creator" 
        v-model="visible" 
        center 
        :destroy-on-close="true"
        :before-close="close"
    >
        <div v-loading="loading">
            <el-form ref="formRef" :model="playlistData" :rules="rules" >
                <el-form-item prop="title">
                    <el-input class="creator_input" v-model="playlistData.title" placeholder="请输入新建歌单标题" />
                </el-form-item>
                <el-form-item prop="playlistLink">
                    <el-input class="creator_input" v-model="playlistData.playlistLink" placeholder="请输入要导入的网易云音乐歌单分享链接" />
                </el-form-item>
            </el-form>
            <span class="filter">
                <span class="filter_item">
                    <span>去除VIP歌曲</span>
                    <el-switch
                        v-model="filterVip"
                        style="--el-switch-on-color: #f89898;"
                    />
                </span>
                <span class="filter_item">
                    <span>去除已下架歌曲</span>
                    <el-switch
                        v-model="filterNoSource"
                        style="--el-switch-on-color: #f89898;"
                    />
                </span>
            </span>
        </div>

        <template #header>
            <span class="creator_title">新建歌单</span>
        </template>
        <template #footer>
            <span class="dialog-footer" style="display: inline-block">
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
.filter {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    &_item {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
}
</style>
<style lang="less">
.creator {
    width: 400px;
    .el-dialog__headerbtn {
        &:hover,
        &:focus {
            .el-dialog__close {
                color: var(--el-color-danger);
            }
        }
    }
}
@media screen and (max-width: 550px) {
    .creator {
        &.el-dialog {
            width: 90%;
        }
    }
}
</style>

<script lang="ts" setup>
import { ElMessage, FormInstance } from 'element-plus';
import { getCloudPlaylistTrack } from '@/assets/cloudApi';
import { MusicInfo, AudioInfoType } from '@/interface';
import { formatMusicInfo } from '@/utils/format';
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
const filterVip = ref(true);
const filterNoSource = ref(true);

/** 验证字段正确性 */
function submitForm() {
    if (!formRef.value) return;
    if (loading.value) return;
    formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            let result = await createPlaylist();
            loading.value = false
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
                ElMessage({
                    type: 'error',
                    message: result.message
                });
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
    // 主要获取路径中的 id 就行
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

        let count = 1;
        while(true) {
            let [err, result] = await getCloudPlaylistTrack({id: Number(id), limit: count++});
            if (err) {
                return {
                    status: false,
                    message: err.message
                }
            }
            else {
                if (result) {
                    let data = result.data.data;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name === null || data[i].ar[0].id === 0 || data[i].al.id === 0) {
                            continue;
                        }
                        if (filterVip.value && data[i].fee === 1) {
                            continue;
                        }
                        if (filterNoSource.value && data[i].st === -200) {
                            continue;
                        }
                        songs.push(formatMusicInfo(data[i], AudioInfoType.cloud));
                    }
                    if (data.length < 500) break;
                }
            }
        }
    }
    else {
        return {
            status: false,
            message: '无效链接'
        }
    }
    // console.log(songs)
    
    setCustomPlaylist(playlistData.value.title, songs);
    return {
        status: true,
        message: '创建成功'
    }
}
function close() {
    playlistData.value = {
        title: '',
        playlistLink: ''
    }
    emit('close')
}

</script>

