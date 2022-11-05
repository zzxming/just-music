
import to from 'await-to-js';
import { CloudMusic, CloudPlaylist, PlaylistInfoPartial, PlaylistType } from "@/interface";
import { axios, AxiosResult, AxiosResultError, jointQuery } from '@/assets/api';
import { AxiosResponse } from 'axios';




/** 通过网易云歌曲 id 获取歌曲播放路径 */
export const getMusicSrcWithCloudId = async (id: number) => 
    await to<AxiosResponse<AxiosResult<{src: string}>>, AxiosResultError>(
        axios.get(`/music/cloud/${id}`)
    )
/** 网易云歌单全部类型 */
export enum PlaylistVal {
    All = '全部',
    Chinese = '华语',
    Western = '欧美',
    Korean = '韩语',
    Japanese = '日语',
    Cantonese = '粤语',
    Minor  = '小语种',
    Motion = '运动',
    ACG = 'ACG',
    Television = '影视原声',
    Popular = '流行',
    Rock = '摇滚',
    PostRock = '后摇',
    Archaic  = '古风',
    Ballad = '民谣',
    lightMusic = '轻音乐',
    Electronics = '电子',
    InstrumentalMuisc = '器乐',
    Rap = '说唱',
    Classical = '古典',
    Jazz = '爵士'
} 

interface HighqualityPlaylistResponse {
    more: boolean
    msg?: string
    lasttime: number
    playlist: CloudPlaylist[]
}
/** 获取网易云精选歌单 */
export const getCloudPlaylistHighquality = async (
    query: {
        before: number 
        cat: PlaylistVal 
        limit: number
    }
) => {
    if (!query.before) query.before = 0;
    if (!query.cat) query.cat = PlaylistVal.All;
    if (!query.limit) query.limit = 10;
    return await to<AxiosResponse<AxiosResult<HighqualityPlaylistResponse>>, AxiosResultError>(
        axios.get(jointQuery(`/music/cloud/playlist/highquality`, query))
    )
}

/** 网易云每日推荐歌单, 歌单部分信息 */
export interface PersonalizedPlaylistResponse {
    id: number
    name: string
    picUrl: string
    playCount: number
    trackCount: number
    trackNumberUpdateTime: number
}
/** 获取网易云每日随机歌单 */
export const getCloudPersonalized = async (
    query: {
        limit: number
    }
) => await to<AxiosResponse<AxiosResult<PlaylistInfoPartial[]>>, AxiosResultError>(
    axios.get(jointQuery('/music/cloud/playlist/personalized', query))
    .then((response: AxiosResponse<AxiosResult<PersonalizedPlaylistResponse[]>>) => {
        // console.log(response)
        return {
            ...response,
            data: {
                ...response.data,
                data: response.data.data.map(item => ({
                    type: PlaylistType.cloud,
                    id: item.id,
                    title: item.name,
                    cover: item.picUrl,
                    playCount: item.playCount
                }))
            }
        }
    })
)


export interface SearchCloudResult extends AxiosResult<CloudMusic[]> {
    count: number
}
// t: 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
/** 搜索网易云音乐资源 */
export const searchCloudMusic = async (
    query: {
        kw: string, 
        limit: number, 
        t: number
}) => {
    if (!query.limit) query.limit = 1;
    if (!query.t) query.t = 1;
    return await to<AxiosResponse<SearchCloudResult>, AxiosResultError>(
        axios.get(jointQuery('/music/search/cloud', query))
    )
}
// https://music.163.com/playlist?id=5396146672
/** 获取网易云歌单中的歌曲信息 */
export const getCloudPlaylistTrack = async (
    query: {
        id: number,
        limit: number
    }
) => await to<AxiosResponse<AxiosResult<CloudMusic[]>>, AxiosResultError>(
    axios.get(jointQuery(`/music/cloud/playlist/track`, query))
);
/** 根据id获取网易云音乐歌单的信息 */
export const getCloudPlaylistDetail = async (
    query: {
        id: number
    }
) => await to<AxiosResponse<AxiosResult<CloudPlaylist>>, AxiosResultError>(
    axios.get(jointQuery('/music/cloud/playlist/detail', query))
);
/** 根据id获取网易云音乐歌曲的信息 */
export const getCloudMusicInfoWithId = async (
    query: {
        ids: number
    }
) => await to<AxiosResponse<AxiosResult<CloudMusic>>, AxiosResultError>(
    axios.get(jointQuery(`/music/cloud/info`, query))
);


/** 网易云用户登录 */
export const postCloudLogin = async (
    params: {
        phone: string, 
        password: string
    }
) => await to<AxiosResponse<AxiosResult<{code: number, message: string}>>, AxiosResultError>(
    axios.post(`/music/cloud/user/login`, { ...params })
)
/** 获取网易云用户登录状态 */
export const getCloudUserState = async () => await to<boolean, AxiosResultError>(
    axios.post('/music/cloud/user/status')
    .then((res: AxiosResponse<AxiosResult<{account: Object}>>) => {
        // console.log(res)
        return !!res.data.data.account
    })
)
/** 刷新网易云用户登录状态 */
export const refreshCloudUserState = async () => await to<AxiosResponse<AxiosResult<undefined>>, AxiosResultError>(
    axios.post('/music/cloud/user/refresh')
)
/** 退出网易云用户登录 */
export const postCloudLogout = async () => await to<AxiosResponse<AxiosResult<undefined>>, AxiosResultError>(
    axios.post('/music/cloud/user/logout')
)


