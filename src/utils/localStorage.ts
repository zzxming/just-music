import { defaultMusicImg } from "@/assets/api";
import { PlaylistType, MusicInfo, PlaylistInfo } from "@/interface";

const localStoragePlaylist = 'customPlaylist';
export const localStoragePlaylistEvent = 'customPlaylistEvent';

interface CustomPlaylist extends PlaylistInfo {
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
/** 获取 localStorage 里的自定义歌单 */
export function getAllCustomPlaylist(): CustomPlaylist[] {
    let customPlaylist = localStorage.getItem(localStoragePlaylist) as (null | string);
    if (customPlaylist) {
        try {
            return JSON.parse(customPlaylist) as CustomPlaylist[];
        }
        catch(e) {
            console.log(e, 'localstorage error');
            return [];
        }
    }
    return [];
}
/** 根据 id 获取自定义歌单 */
export function getCustomPlaylistWithId(id: number): CustomPlaylist | null {
    let allPlaylist = getAllCustomPlaylist();
    if (allPlaylist) {
        for (let playlist of allPlaylist) {
            if (playlist.id === id) return playlist;
        }
    }
    return null;
}
export function deleteCustomPlaylistWithId(id: number) {
    let allPlaylist = getAllCustomPlaylist();
    if (allPlaylist) {
        for (let i = 0; i < allPlaylist.length; i++) {
            if (allPlaylist[i].id === id) {
                allPlaylist.splice(i, 1);
                break;
            }
        }
        localStorage.setItem(localStoragePlaylist, JSON.stringify(allPlaylist));
        window.dispatchEvent(new Event(localStoragePlaylistEvent));
    }
    return true;
}
/** 保存用户创建歌单至 localStorage */
export function setCustomPlaylist(title: string, songs: MusicInfo[] = []) {
    let playlist = getAllCustomPlaylist();
    let newPlaylist: CustomPlaylist = {
        type: PlaylistType.localStorage,
        id: new Date().getTime(),
        title,
        updateTime: new Date().getTime(),
        createTime: new Date().getTime(),
        cover: songs[0].cover ?? defaultMusicImg,
        description: '',
        playCount: songs.length ?? 0,
        tracks: songs,
        trackCount: songs.length ?? 0,
        creator: {
            userId: new Date().getTime(),
            name: '自定义歌单',
            avatarUrl: defaultMusicImg
        }
    }
    playlist.unshift(newPlaylist);
    localStorage.setItem(localStoragePlaylist, JSON.stringify(playlist));
    window.dispatchEvent(new Event(localStoragePlaylistEvent));
}
