import OriginAxios, { AxiosError, AxiosResponse } from "axios"
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export const axios = OriginAxios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/'
});


axios.interceptors.response.use((response) => {
    console.log(response)
    if (response.data.code !== 1 && response.data.code !== 200) {
        ElMessage({
            type: 'error',
            message: response.data.message ?? response.data.error?.message
        })
        return Promise.reject(response)
    }
    return Promise.resolve(response)
},(error: AxiosError) => {
    console.log(error)
    ElMessage({
        type: 'error',
        message: (error.response && (error.response.data as any).message) ?? error.response?.statusText ?? error.message
    })
    return Promise.reject(error)
})
/**
 * 将query参数与路径进行拼接
 * @param url 路径
 * @param query query 参数对象
 * @returns 拼接后的完整路径
 */
export const jointQuery = (url: string, query: {[key: string]: string | number}): string => {
    let result = url;
    if (Object.keys(query).length > 0) {
        result += '?'
        for (let key in query) {
            result += `${key}=${query[key]}&`
        }
    }
    return result;
}

export interface AxiosResult<T> extends AxiosResultCode {
    data: T
}
export interface AxiosResultError {
    data: {
        code: number,
        message: string
        data?: {
            message: string
        }
    }
    status?: number
}
export interface AxiosResultCode {
    code: number
}

/** 静态资源路径 */
export const mediaSrc = (src: string) => process.env.NODE_ENV === 'development' ? `/api${src}` : src
/** 默认的封面图片 */
export const defaultMusicImg = '/api/imgs/music.jpg';
