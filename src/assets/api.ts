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
const jointQuery = (url: string, query: {[key: string]: string | number}): string => {
    let result = url;
    if (Object.keys(query).length > 0) {
        result += '?'
        for (let key in query) {
            result += `${key}=${query[key]}&`
        }
    }
    return result;
}

interface Response {
    code: 0 | 1
}

/** 静态资源路径 */
export const mediaSrc = (src: string) => process.env.NODE_ENV === 'development' ? `/api${src}` : src

/** 根据数据库 music_id 获取歌曲的歌曲 */
export const staticMusicWithBvid = (id: number) => mediaSrc(`/music/${id}`);
/** 根据 bvid 获取的歌曲 */
export const staticMusicWithId = (bvid: string) => mediaSrc(
    jointQuery('/bili/audio', { 
        bv: bvid 
    }
));
/** 通过网易云歌曲 id 获取歌曲播放路径 */
export const getMusicSrcWithCloudId = (id: number) => axios.get<{src: string} & Response>(`/music/cloud/${id}`)


/** 搜索本地音乐资源 */
export const searchLocalMusic = (kw: string, limit: number, t: number = 1) => axios.get(
    jointQuery('/music/search/local', 
    {
        kw, limit, t
    }
));
/** 搜索网易云音乐资源 */
// t: 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
export const searchCloudMusic = (kw: string, limit: number, t: number = 1) => axios.get(
    jointQuery('/music/search/cloud', {
        kw, limit, t
    }
))
/** 根据数据库 music_id 获取歌曲信息 */
export const getMusicInfoWithId = (id: number) => axios.get(`/music/info/${id}`);

export type playlistVal = '全部' | '华语' | '欧美' | '韩语' | '日语' | '粤语' | '小语种' | '运动' | 'ACG' | '影视原声' | '流行' | '摇滚' | '后摇' | '古风' | '民谣' | '轻音乐' | '电子' | '器乐' | '说唱' | '古典' | '爵士'
/** 获取精选歌单 */
export const getPlaylistHighquality = (
    before: number = 0, 
    cat: playlistVal = '全部', 
    limit: number = 10
) => axios.get(
    jointQuery(`/music/cloud/playlist/highquality`, 
    {
        cat, 
        before, 
        limit
    }
));

export const getPlaylistTrack = (
    query: {
        id: number
    }
) => axios.get(
    jointQuery(`/music/cloud/playlist/track`, 
    query
));