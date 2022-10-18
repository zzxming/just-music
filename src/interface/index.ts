export enum AudioInfoType {
    local = 'local',
    cloud = 'cloud',
}
/** 整合后的歌曲信息 */
export interface MusicInfo {
    type: AudioInfoType
    id: number
    title: string
    cover: string
    singers: Singer[]
    duration: number
    src: string
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
    duration: number
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
    trackCount: number
    creator: {
        userId: number
        nickname: string
        avatarUrl: string
    }
    tags: string[]
}
/** 网易云音乐歌曲部分信息 */
export interface CloudSong {
    id: number
    name: string
    dt: number
    al: {
        id: number
        name: string
        picUrl: string
    },
    ar: [
        {
            id: number
            name: string
        }
    ],
}
