
import to from 'await-to-js';
import { LocalMusic } from "@/interface";
import { axios, mediaSrc, jointQuery, AxiosResult, AxiosResultError } from './api';

/** 根据数据库 music_id 获取歌曲的歌曲 */
export const staticMusicWithBvid = (id: number) => mediaSrc(`/music/${id}`);
/** 根据 bvid 获取的歌曲 */
export const staticMusicWithId = (bvid: string) => mediaSrc(
    jointQuery('/bili/audio', { 
        bv: bvid
    }
));
/** 搜索本地音乐资源 */
export const searchLocalMusic = async (kw: string, limit: number = 1, t: number = 1) => 
    await to<AxiosResult<LocalMusic[]>, AxiosResultError>(
        axios.get(
            jointQuery(
                '/music/search/local', 
                {
                    kw, limit, t
                }
            )
        )
    )
/** 根据数据库 music_id 获取歌曲信息 */
export const getLocalMusicInfoWithId = async (
    query: {
        id: number
    }
) => 
    await to<AxiosResult<LocalMusic>, AxiosResultError>(
        axios.get(jointQuery(`/music/info`, query))
    )