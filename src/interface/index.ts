/** 本地歌曲信息 */
export interface LocalMusic {
    music_id: number
    music_name: string
    music_url: string
    singers: LocalSinger[]
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
