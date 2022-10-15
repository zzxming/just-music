
import to from 'await-to-js';
import { AxiosError } from "axios"
import { CloudMusic, CloudPlaylist, CloudSong } from "../interface";
import { axios, AxiosResult, jointQuery } from './api';

/** 通过网易云歌曲 id 获取歌曲播放路径 */
export const getMusicSrcWithCloudId = async (id: number) => await to<AxiosResult<{src: string}>, AxiosError>(
    axios.get(`/music/cloud/${id}`)
)
/** 网易云歌单全部类型 */
export enum playlistVal {
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
    before: number = 0, 
    cat: playlistVal = playlistVal.All, 
    limit: number = 10
) => await to<AxiosResult<HighqualityPlaylistResponse>, AxiosError>(
    axios.get(
        jointQuery(
            `/music/cloud/playlist/highquality`, 
            {
                cat, 
                before, 
                limit
            }
        )
    )
)
/** 搜索网易云音乐资源 */
// t: 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
export const searchCloudMusic = async (kw: string, limit: number = 1, t: number = 1) => await to<AxiosResult<CloudMusic[]>, AxiosError>(
    axios.get(
        jointQuery(
            '/music/search/cloud', 
            {
                kw, limit, t
            }
        )
    )
)
/** 获取网易云歌单中的歌曲信息 */
export const getCloudPlaylistTrack = async (
    query: {
        id: number
    }
) => await to<AxiosResult<CloudSong>, AxiosError>(
    axios.get(
        jointQuery(
            `/music/cloud/playlist/track`, 
            query
        )
    )
)
/** 根据id获取网易云音乐歌单的信息 */
export const getCloudPlaylistDetail = async (
    query: {
        id: number
    }
) => await to(
    axios.get<AxiosResult<CloudPlaylist>, AxiosError>(
        jointQuery(
            '/music/cloud/playlist/detail', 
            query
        )
    )
)