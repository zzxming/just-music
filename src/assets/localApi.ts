
import to from 'await-to-js';
import { AxiosResponse } from 'axios'
import { AudioInfoType, BiliMusic, CloudAudioInfo, LocalAudioInfo, LocalMusic, MusicInfo, PlaylistInfo, LocalPlaylist } from "@/interface";
import { axios, mediaSrc, jointQuery, AxiosResult, AxiosResultError } from './api';

/** 根据数据库 music_id 获取歌曲的歌曲 */
export const staticMusicWithid = (id: number) => mediaSrc(`/music/local/${id}`);
/** 根据 bvid 获取的歌曲 */
export const searchMusicWithBvId = (bvid: string) => mediaSrc(
    jointQuery('/bili/audio', { 
        bv: bvid
    }
));
/** 根据 bvid 获取歌曲信息 */
export const searchMusicInfoWIthBvid = async (bvid: string) =>
    await to<AxiosResponse<AxiosResult<MusicInfo[]>>, AxiosResultError>(
        axios.get(jointQuery('/bili/info', { bv: bvid }))
        .then((response: AxiosResponse<AxiosResult<BiliMusic>>) => {
            const info = response.data.data;

            // 没有数据不会返回data, 防止报错设置空数组
            if (response.data.code === 0) {
                return {
                    ...response,
                    data: {
                        ...response.data,
                        data: []
                    }
                }
            }
            return {
                ...response,
                data: {
                    ...response.data,
                    data: [
                        {
                            type: AudioInfoType.bili,
                            id: info?.bvid,
                            title: info?.title,
                            cover: info?.cover,
                            singers: info?.singers,
                            album: info?.album,
                            duration: info?.duration,
                            fee: 0,
                            st: 0,
                            noCopyrightRcmd: null,
                            full: true
                        }
                    ]
                }
            }
        })
    )


/** 搜索本地音乐资源 */
export const searchLocalMusic = async (query: {
    kw: string, 
    limit: number, 
    t: number
}) => {
    if (!query.limit) query.limit = 1;
    if (!query.t) query.t = 1;
    return await to<AxiosResponse<AxiosResult<LocalMusic[]>>, AxiosResultError>(
        axios.get(jointQuery('/music/search/local', query))
    )
}
    
/** 根据数据库 music_id 获取歌曲信息 */
export const getLocalMusicInfoWithId = async (
    query: {
        id: number
    }
) => 
    await to<AxiosResponse<AxiosResult<LocalMusic>>, AxiosResultError>(
        axios.get(jointQuery(`/music/local/info`, query))
    )

    
/** 创建数据库歌单 */
export const postCreatePlaylist = async (
    params: {
        title: string, 
        creator_id: number,
        description: string,
        cover: string,
        songs: MusicInfo[],
    }
) => {
    // 目前不弄用户系统, 所以创建者id默认为1
    params.creator_id = params.creator_id ?? 1;
    return await to<{code: number, message: string}, AxiosResultError>(
        axios.post('/music/local/playlist/create', { ...params })
        .then(res => ({
            code: res.data.code,
            message: res.data.message
        }))
    ) 
}
/** 获取歌单详细信息 */
export const getLocalPlaylistDetail = async (
    query: {
        id: number
    }
) => await to<AxiosResponse<AxiosResult<LocalPlaylist>>, AxiosResultError>(
    axios.get(jointQuery('/music/local/playlist/detail', query))
)
/** 根据 id 获取本地歌单内歌曲信息 */
export const geLocalPlaylistTrack = async (
    query: {
        id: number
    }
) => await to<AxiosResponse<AxiosResult<LocalAudioInfo[] | CloudAudioInfo[]>>, AxiosResultError>(
    axios.get(jointQuery('/music/local/playlist/track', query))
)
/** 根据 id 获取本地歌单内歌曲信息 */
export const getLocalPlaylistRandom = async (
    query: {
        limit?: number
    }
) => {
    if (!query.limit) query.limit = 10;
    return await to<AxiosResponse<AxiosResult<PlaylistInfo[]>>, AxiosResultError>(
        axios.get('/music/local/playlist/random')
    )
}

