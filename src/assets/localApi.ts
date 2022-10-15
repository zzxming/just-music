
import to from 'await-to-js';
import { AxiosError } from "axios"
import { LocalMusic } from "../interface";
import { axios, mediaSrc, jointQuery, AxiosResult } from './api';

/** 根据数据库 music_id 获取歌曲的歌曲 */
export const staticMusicWithBvid = (id: number) => mediaSrc(`/music/${id}`);
/** 根据 bvid 获取的歌曲 */
export const staticMusicWithId = (bvid: string) => mediaSrc(
    jointQuery('/bili/audio', { 
        bv: bvid
    }
));
/** 搜索本地音乐资源 */
export const searchLocalMusic = async (kw: string, limit: number = 1, t: number = 1) => await to<AxiosResult<LocalMusic[]>, AxiosError>(
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
export const getMusicInfoWithId = async (id: number) => await to<AxiosResult<LocalMusic>, AxiosError>(
    axios.get(`/music/info/${id}`)
)