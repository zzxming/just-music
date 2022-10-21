// musicinfo 没有专辑信息













export enum AudioInfoType {
    local = 'local',
    cloud = 'cloud',
    bili = 'bili'
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
} 
/** 整合后的歌手信息 */
export interface Singer {
    id: number
    name: string
}
/** 携带type的本地歌曲信息 */
export interface LocalAudioInfo extends LocalMusic {
    type: AudioInfoType.local
}
/** 携带type的网易云歌曲信息 */
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
/** 网易云歌单信息 */
export interface CloudPlaylist {
    id: number
    name: string
    updateTime: number
    createTime: number
    coverImgUrl: string
    description: string
    playCount: number
    tracks: CloudMusic[]
    trackCount: number
    creator: {
        userId: number
        nickname: string
        avatarUrl: string
    }
    tags: string[]
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
