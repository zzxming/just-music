import { LocalAudioInfo, CloudAudioInfo, AudioInfoType, Singer, MusicInfo, CloudMusic, LocalMusic, CloudPlaylistInfo, CloudPlaylist, PlaylistInfo } from "@/interface";
import { isArray } from 'lodash';




/** 通过 is 判断传入变量是否是泛型类型, 但有可能无法通过执行环节, 因为在执行中 ts 不存在 */
export function isType<T, >(data: any): data is T {
    return true
}
/** 整合歌曲数据, 统一本地歌曲和网易云歌曲的字段 */
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
): MusicInfo {
    // 因为 isType 是通过 ts 的 is 进行判断, 在执行过程中, ts 以及不存在, 所以需要额外的判断
    // 有 title 就表示是 MusicInfo 类型
    if (
        isType<MusicInfo>(info) && info.type && info.title && 
        info.id && info.cover && info.singers && 
        info.duration && info.album && info.fee
    ) {
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
        // isType 这里只是保证 ts 不报错, 在运行时 isType 函数一直是 true
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

    return {
        type: type || info.type, id, title, cover, duration, singers, fee, album
    }
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

/** 整合歌单数据, 统一本地歌单和网易云歌单的字段, 目前差本地歌单筛选 */
export function formatPlaylist(
    playlist: CloudPlaylistInfo | CloudPlaylist | PlaylistInfo, 
    type?: AudioInfoType
): PlaylistInfo {
    // 当前已经是 PlaylistInfo 类型直接返回
    if (
        isType<PlaylistInfo>(playlist) && 
        playlist.type && playlist.id &&  playlist.title &&
        playlist.updateTime && playlist.createTime &&
        playlist.cover && playlist.description &&
        playlist.playCount && playlist.trackCount &&
        playlist.creator
        // playlist.tracks &&
    ) {
        return playlist
    }


    let id: number = 0,
        title: string = '',
        updateTime: number = 0,
        createTime: number = 0,
        cover: string = '',
        description: string = '',
        playCount: number = 0,
        // tracks: MusicInfo[] = [],
        trackCount: number = 0,
        creator: {
            userId: number
            name: string
            avatarUrl: string
        } = {
            userId: 0,
            name: '',
            avatarUrl: '',
        };

    try {
        // console.log(info)
        // isType 这里只是保证 ts 不报错, 在运行时 isType 函数一直是 true
        if (isType<CloudPlaylistInfo>(playlist) && (type === AudioInfoType.cloud || playlist.type === AudioInfoType.cloud)) {
            id = playlist.id;
            title = playlist.name;
            updateTime = playlist.updateTime;
            createTime = playlist.createTime;
            cover = playlist.coverImgUrl;
            description = playlist.description;
            playCount = playlist.playCount;
            // tracks = formatMusicInfo(playlist.tracks, AudioInfoType.cloud);
            trackCount = playlist.trackCount;
            creator = {
                userId: playlist.creator.userId,
                name: playlist.creator.nickname,
                avatarUrl: playlist.creator.avatarUrl
            }
        }

        else {
            throw Error('function formatMusicInfo argument type error')
        }
    }
    catch(e) {
        throw e;
    }
    return {
        type: type || playlist.type, id, title, 
        updateTime, createTime, cover, description, 
        playCount, trackCount, creator,
        // tracks, 
    }
}


/** 获取用户创建歌单 */
export function getCustomPlaylist(): PlaylistInfo[] {
    let str = localStorage.getItem('playlist');
    if (str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            localStorage.setItem('playlist', '');
        }
    }
    return [];
}
/** 保存用户创建歌单 */
export function setCustomPlaylist() {

}

