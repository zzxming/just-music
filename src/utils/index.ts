import { LocalAudioInfo, CloudAudioInfo, AudioInfoType, Singer, MusicInfo, CloudMusic, LocalMusic, CloudPlaylist, PlaylistInfo, PlaylistInfoPartial, PlaylistType, BiliMusic, LocalPlaylist } from "@/interface";
import { isArray } from 'lodash';




/** 通过 is 判断传入变量是否是泛型类型, 但有可能无法通过执行环节, 因为在执行中 ts 不存在 */
export function isType<T, >(data: any): data is T {
    return true
}
/** 整合歌曲数据, 统一本地歌曲和网易云歌曲的字段 */
export function formatMusicInfo(info: LocalAudioInfo[] | CloudAudioInfo[] | MusicInfo[] | LocalMusic[] | CloudMusic[] | BiliMusic[], type: AudioInfoType): MusicInfo[];
export function formatMusicInfo(info: LocalAudioInfo | CloudAudioInfo | MusicInfo | LocalMusic | CloudMusic | BiliMusic, type: AudioInfoType): MusicInfo;
export function formatMusicInfo(
    info: LocalAudioInfo | CloudAudioInfo | MusicInfo | LocalMusic | CloudMusic | BiliMusic |
          LocalAudioInfo[] | CloudAudioInfo[] | MusicInfo[] | LocalMusic[] | CloudMusic[] | BiliMusic[], 
    type: AudioInfoType
): MusicInfo | MusicInfo[] {
    // 在获取本地歌单内歌曲时会自带 type, 优先使用
    return isArray(info) ? info.map(item => formatSingleMusicInfo(item, (item as MusicInfo).type ?? type)) : formatSingleMusicInfo(info, type)
}
/** 格式化单个音频信息 */
export function formatSingleMusicInfo(
    info: LocalAudioInfo | CloudAudioInfo | LocalMusic | CloudMusic | MusicInfo | BiliMusic, 
    type?: AudioInfoType
): MusicInfo {
    // 因为 isType 是通过 ts 的 is 进行判断, 在执行过程中, ts 以及不存在, 所以需要额外的判断
    // 添加了一个额外字段, 表示已经是 MusicInfo 类型了
    if (isType<MusicInfo>(info) &&  info.full) {
        return info;
    }
    let id: number | string = 0,
        cid: number = 0, 
        title: string = '', 
        cover: string = '', 
        duration: number = 0, 
        singers: Singer[] = [],
        album: string = '',
        fee: number = 0,
        noCopyrightRcmd: {
            type: number, 
            typeDesc: string
        } | null = null,
        st: number = 0,
        publishTime: number = 0;
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
            publishTime = info.publishTime;
        }
        else if (isType<CloudAudioInfo>(info) && (type === AudioInfoType.cloud || info.type === AudioInfoType.cloud)) {
            id = info.id;
            title = info.name;
            cover = info.al.picUrl;
            duration = info.dt;
            singers = info.ar;
            fee = info.fee
            album = info.al.name;
            noCopyrightRcmd = info.noCopyrightRcmd;
            st = info.st;
            publishTime = info.publishTime;
        }
        else if (isType<BiliMusic>(info) && (type === AudioInfoType.bili || info?.type === AudioInfoType.bili)) {
            id = info.bvid;
            cid = info.cid;
            title = info.title;
            cover = info.cover;
            duration = info.duration;
            singers = info.singers.map(item => ({id: item.id, name: item.name}));
            fee = 0;
            album = info.album;
            publishTime = info.pubdate;
        }
        else {
            throw Error('function formatMusicInfo argument type error')
        }
    }
    catch(e) {
        throw e;
    }

    return {
        type: type || info.type, id, cid, title, cover, duration, singers, fee, album, noCopyrightRcmd, st, full: true, publishTime
    }
}
/** 格式化播放时间 */
export function formatAudioTime(num: number) {
    let duration = num;
    let minutes = Math.floor(duration / 60);
    let second = Math.floor(duration - minutes * 60);
    if (minutes >= 60) {
        let hour = Math.floor(minutes / 60);
        minutes = Math.floor((duration - (hour * 60 * 60)) / 60);
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
export function formatPlaylistInfo(playlist: CloudPlaylist[] | PlaylistInfo[], type: PlaylistType): PlaylistInfo[];
export function formatPlaylistInfo(playlist: CloudPlaylist | PlaylistInfo, type: PlaylistType): PlaylistInfo;
export function formatPlaylistInfo(
    playlist: CloudPlaylist | PlaylistInfo | CloudPlaylist[] | PlaylistInfo[], 
    type: PlaylistType
): PlaylistInfo | PlaylistInfo[] {
    return isArray(playlist) ? playlist.map(item => formatSinglePlaylistInfo(item, type)) : formatSinglePlaylistInfo(playlist, type)
}
/** 整合单个歌单的信息字段 */
export function formatSinglePlaylistInfo(
    playlist: CloudPlaylist | PlaylistInfo,
    type: PlaylistType
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
        // console.log(playlist)
        // isType 这里只是保证 ts 不报错, 在运行时 isType 函数一直是 true
        if (isType<CloudPlaylist>(playlist) && type === PlaylistType.cloud) {
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
        else if (isType<LocalPlaylist>(playlist) && type === PlaylistType.local) {
            id = playlist.id;
            title = playlist.title;
            updateTime = playlist.updateTime;
            createTime = playlist.createTime;
            cover = playlist.cover;
            description = playlist.description;
            playCount = playlist.playCount;
            // tracks = formatMusicInfo(playlist.tracks, AudioInfoType.cloud);
            trackCount = playlist.trackCount;
            creator = {
                userId: playlist.creator.userId,
                name: playlist.creator.name,
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
        type: type, id, title, 
        updateTime, createTime, cover, description, 
        playCount, trackCount, creator,
        // tracks, 
    }
}


/** 整合歌单的部分信息字段 */
export function formatPlaylistPartial(playlist: PlaylistInfoPartial | PlaylistInfo, type: PlaylistType): PlaylistInfoPartial;
export function formatPlaylistPartial(playlist: PlaylistInfoPartial[] | PlaylistInfo[], type: PlaylistType): PlaylistInfoPartial[];
export function formatPlaylistPartial(
    playlist: PlaylistInfoPartial | PlaylistInfoPartial[] | PlaylistInfo | PlaylistInfo[],
    type: PlaylistType
): PlaylistInfoPartial | PlaylistInfoPartial[] {
    return isArray(playlist) ? playlist.map(item => formatSinglePlaylistPartial(item, type)) : formatSinglePlaylistPartial(playlist, type)
}
/** 整合单个歌单的部分信息字段 */
function formatSinglePlaylistPartial(info:PlaylistInfoPartial |  PlaylistInfo, type: PlaylistType): PlaylistInfoPartial {
    if (
        isType<PlaylistInfoPartial>(info) &&
        info.id && info.title &&
        info.cover && info.playCount
    ) {
        return info;
    }

    let id: number = 0,
        title: string = '',
        cover: string = '',
        playCount: number = 0;

    try {
        if (isType<PlaylistInfo>(info) && type === PlaylistType.cloud) {
            id = info.id;
            title = info.title;
            cover = info.cover;
            playCount = info.playCount;
        }
        else if (isType<PlaylistInfo>(info) && type === PlaylistType.local) {
            id = info.id;
            title = info.title;
            cover = info.cover;
            playCount = info.playCount;
        }
        else {
            throw Error('function formatPlaylistPartial argument type error')
        }
    }
    catch(e) {
        throw e;
    }
    return {
        id, title, cover, playCount, type
    }
}



