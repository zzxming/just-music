
import to from 'await-to-js';
import { AxiosResponse } from 'axios'
import { AudioInfoType, BiliMusic, LocalMusic, MusicInfo } from "@/interface";
import { axios, mediaSrc, jointQuery, AxiosResult, AxiosResultError } from './api';

/** 根据数据库 music_id 获取歌曲的歌曲 */
export const staticMusicWithid = (id: number) => mediaSrc(`/music/${id}`);
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
            // console.log(response)
            const info = response.data.data;

            return {
                ...response,
                data: {
                    ...response.data,
                    data: [
                        {
                            type: AudioInfoType.local,
                            id: info.cid,
                            title: info.title,
                            cover: info.cover,
                            singers: info.singers,
                            album: info.album,
                            duration: info.duration,
                            fee: 0
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
        axios.get(jointQuery(`/music/info`, query))
    )