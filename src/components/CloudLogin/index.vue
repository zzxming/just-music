<template>
    <div class="login" @click="dialogVisible = true">登录</div>
    
    <el-dialog
        v-model="dialogVisible"
        title="网易云音乐登录"
        width="400px"
        :destroy-on-close="true"
    >
        <el-form
            v-loading="loading"
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="80px"
        >
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" type="password" @keyup.enter="submitLogin" />
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="danger" @click="submitLogin">登录</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.login {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 100%;
    margin-right: 20px;
    color: var(--el-color-info);
    cursor: pointer;
    &:hover {
        color: var(--el-color-danger);
    }
}
</style>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { FormInstance, ElMessage } from 'element-plus';
import { postCloudLogin } from '@/assets/cloudApi';

const ruleFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const ruleForm = reactive({
    phone: '',
    password: '',
});
const rules = reactive({
    phone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
});
const loading = ref(false);

/** 提交登录表单 */
function submitLogin() {
    if (!ruleFormRef.value) return
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            // 错误太多次会不让登
            loading.value = true;
            let [err, result] = await postCloudLogin(ruleForm);
            loading.value = false;
            if (!err && result) {
                console.log(result)
                ElMessage({
                    type: result.data.code === 200 ? 'success' : 'error',
                    message: result.data.data.message
                });
                if (result.data.data.code === 200) {
                    dialogVisible.value = false;
                    return true;
                }
                return false;
            }
            if (err) {
                console.log(err);
                return false;
            }
        } else {
            console.log('error submit!')
            return false;
        }
    })
}

</script>

