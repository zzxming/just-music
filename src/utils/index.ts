import { LocalAudioInfo, CloudAudioInfo, AudioInfoType, Singer, MusicInfo, CloudMusic, LocalMusic } from "@/interface";
import { isArray } from 'lodash';




/** 通过 is 判断传入变量是否是泛型类型, 但有可能无法通过执行环节, 因为在执行中 ts 不存在 */
export function isType<T, >(data: any): data is T {
    return data
}
/** 整合数据, 统一本地歌曲和网易云歌曲的字段 */
export function formatMusicInfo(info: LocalAudioInfo[] | CloudAudioInfo[] | MusicInfo[] | LocalMusic[] | CloudMusic[], type?: AudioInfoType): MusicInfo[];
export function formatMusicInfo(info: LocalAudioInfo | CloudAudioInfo | MusicInfo | LocalMusic | CloudMusic, type?: AudioInfoType): MusicInfo;
export function formatMusicInfo(
    info: LocalAudioInfo | CloudAudioInfo | MusicInfo | LocalMusic | CloudMusic | 
          LocalAudioInfo[] | CloudAudioInfo[] | MusicInfo[] | LocalMusic[] | CloudMusic[], 
    type?: AudioInfoType
): MusicInfo | MusicInfo[] {
    return isArray(info) ? info.map(item => formatSingleMusicInfo(item, type)) : formatSingleMusicInfo(info, type)
}
/** 格式化单个音频信息 */
function formatSingleMusicInfo(
    info: LocalAudioInfo | CloudAudioInfo | LocalMusic | CloudMusic | MusicInfo, 
    type?: AudioInfoType
): typeof result {
    // 因为 isType 是通过 ts 的 is 进行判断, 在执行过程中, ts 以及不存在, 所以需要额外的判断
    // 有 title 就表示是 MusicInfo 类型
    if (isType<MusicInfo>(info) && info.title) {
        return info;
    }
    let id: number = 0, 
        title: string = '', 
        cover: string = '', 
        duration: number = 0, 
        singers: Singer[] = [],
        album: string = '',
        fee: number = 0;
    try {
        // console.log(info)
        if (isType<LocalAudioInfo>(info) && (type === AudioInfoType.local || info.type === AudioInfoType.local)) {
            id = info.music_id;
            title = info.music_name;
            cover = info.music_cover;
            duration = info.duration;
            singers = info.singers.map(item => ({id: item.singer_id, name: item.singer_name}));
            fee = 0;
            album = info.album;
        }
        else if (isType<CloudAudioInfo>(info) && (type === AudioInfoType.cloud || info.type === AudioInfoType.cloud)) {
            id = info.id;
            title = info.name;
            cover = info.al.picUrl;
            duration = info.dt;
            singers = info.ar;
            fee = info.fee
            album = info.al.name;
        }
        else {
            throw Error('function formatMusicInfo argument type error')
        }
    }
    catch(e) {
        throw e;
    }

    let result: MusicInfo = {
        type: type || info.type, id, title, cover, duration, singers, fee, album
    }
    return result
}
/** 格式化播放时间 */
export function formatAudioTime(num: number) {
    let duration = num;
    let minutes = Math.floor(duration / 60);
    let second = Math.floor(duration - minutes * 60);
    if (minutes >= 60) {
        let hour = Math.floor(minutes / 60);
        return `${twoDigitStr(hour)}:${twoDigitStr(minutes)}:${twoDigitStr(second)}`
    }
    return `${twoDigitStr(minutes)}:${twoDigitStr(second)}`
}
/** 将一位的数字转成两位的字符串 */
export function twoDigitStr(num: number) {
    if (num > 9) {
        return `${num}`
    }
    return `0${num}`
}


