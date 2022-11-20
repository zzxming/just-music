import OriginAxios, { AxiosError } from "axios"
import { ElMessage } from "element-plus";

export const axios = OriginAxios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/'
});


axios.interceptors.response.use((response) => {
    // console.log(response)
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
    if (!url.includes('?') && Object.keys(query).length > 0) {
        result += '?'
    }
    for (let key in query) {
        result += `&${key}=${query[key]}`
    }
    return result;
}

export interface AxiosResult<T> extends AxiosResultCode {
    data: T
}
export interface AxiosResultError extends AxiosError<ErrorResult> {
    
}

export interface ErrorResult {
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
export const mediaSrc = (src: string) => {
    if (src === '') {
        return process.env.NODE_ENV === 'development' ? `/api${defaultMusicImg}` : defaultMusicImg
    }
    return process.env.NODE_ENV === 'development' && !src.startsWith('http') ? `/api${src}` : src
}
/** 默认的封面图片 */
export const defaultMusicImg = '/imgs/music.jpg';
