// musicinfo 没有专辑信息













export enum AudioInfoType {
    local = 'local',
    cloud = 'cloud',
    bili = 'bili'
}
export enum PlaylistType {
    local = 'local',
    cloud = 'cloud',
    localStorage = 'localStorage'
}
/** 整合后的歌曲信息 */
export interface MusicInfo {
    type: AudioInfoType
    id: number | string
    title: string
    cover: string
    singers: Singer[]
    duration: number
    album: string
    /** 值为 1 时是vip歌曲, 只能播放部分 */
    fee: number
    noCopyrightRcmd: {
        type: number
        typeDesc: string
    } | null
    /** -200 表示歌曲下架不能听 */
    st: number
} 
/** 整合后的歌手信息 */
export interface Singer {
    id: number
    name: string
}
/** 携带 type 的本地歌曲信息 */
export interface LocalAudioInfo extends LocalMusic {
    type: AudioInfoType.local
}
/** 携带 type 的网易云歌曲信息 */
export interface CloudAudioInfo extends CloudMusic {
    type: AudioInfoType.cloud
}
/** 本地歌曲信息 */
export interface LocalMusic {
    music_id: number
    music_name: string
    music_url: string
    music_cover: string
    singers: LocalSinger[]
    album: string
    duration: number
    fee: number
}
/** 本地歌手信息 */
export interface LocalSinger {
    singer_id: number
    singer_name: string
}
/** 网易云音乐歌曲信息 */
export interface CloudMusic {
    id: number
    name: string
    ar: CloudSingerShort[]
    al: CloudAlbumShort
    dt: number
    /** 值为 1 时是vip歌曲, 只能播放部分 */
    fee: number
    noCopyrightRcmd: {
        type: number
        typeDesc: string
    }
    /** -200 表示歌曲下架不能听 */
    st: number
}
/** 网易云音乐歌手部分信息 */
export interface CloudSingerShort {
    id: number
    name: string
}
/** 网易云音乐专辑部分信息 */
export interface CloudAlbumShort {
    id: number
    name: string
    picUrl: string
}
/** bili 获取的音频信息 */
export interface BiliMusic {
    bvid: string
    cid: number
    cover: string
    duration: number
    singers: Singer[]
    title: string
    album: string
    src: string
}



/** 歌单信息 */
export interface PlaylistInfo extends PlaylistInfoPartial {
    type: PlaylistType
    id: number
    title: string
    updateTime: number
    createTime: number
    cover: string
    description: string
    playCount: number
    // tracks: MusicInfo[]
    trackCount: number
    creator: {
        userId: number
        name: string
        avatarUrl: string
    }
}
/** 自定义创建歌单 */
export interface CustomPlaylist extends PlaylistInfo {
    type: PlaylistType.localStorage
    id: number
    title: string
    updateTime: number
    createTime: number
    cover: string
    description: string
    playCount: number
    tracks: MusicInfo[]
    trackCount: number
    creator: {
        userId: number
        name: string
        avatarUrl: string
    },
}
/** 网易云歌单信息 */
export interface CloudPlaylist {
    id: number
    name: string
    updateTime: number
    createTime: number
    coverImgUrl: string
    description: string
    playCount: number
    // tracks: CloudMusic[]
    trackCount: number
    creator: {
        userId: number
        nickname: string
        avatarUrl: string
    }
    tags: string[]
}
/** 歌单部分信息 */
export interface PlaylistInfoPartial {
    type: PlaylistType
    id: number
    title: string
    cover: string
    playCount: number
}
/** 播放模式 */
export enum PlayMode {
    sequential = 'sequential',
    single = 'single',
    random = 'random',
    loop = 'loop'
}