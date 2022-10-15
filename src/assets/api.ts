import OriginAxios from "axios"

export const axios = OriginAxios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/'
});
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
export interface AxiosResult<T> {
    data: {
        code: number
        data: T
    }
}

/** 静态资源路径 */
export const mediaSrc = (src: string) => process.env.NODE_ENV === 'development' ? `/api${src}` : src

