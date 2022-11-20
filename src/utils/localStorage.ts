import { defaultMusicImg } from "@/assets/api";
import { PlaylistType, MusicInfo, CustomPlaylist, PlaylistInfo } from "@/interface";

const localStoragePlaylist = 'customPlaylist';  // localstorage 中歌单 key 名
export const localStoragePlaylistEvent = 'customPlaylistEvent'; // 改变 localstorage 中歌单数据时触发的事件名

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
export function getCustomPlaylistWithId(id: number | string): CustomPlaylist | null {
    let allPlaylist = getAllCustomPlaylist();
    if (allPlaylist) {
        for (let playlist of allPlaylist) {
            // 收藏哔哩哔哩的歌单id是字符串，localstorage里的id是字符串
            if (playlist.id == id) return playlist;
        }
    }
    return null;
}
/** 根据 id 删除自定义歌单 */
export function deleteCustomPlaylistWithId(id: number | string) {
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
/** 用户收藏某歌单 */
export function savePlaylist(playlistInfo: PlaylistInfo, songs: MusicInfo[]) {
    let playlist = getAllCustomPlaylist();
    let newPlaylist: CustomPlaylist = {
        ...playlistInfo,
        type: PlaylistType.localStorage,
        tracks: songs
    }
    playlist.unshift(newPlaylist);
    localStorage.setItem(localStoragePlaylist, JSON.stringify(playlist));
    window.dispatchEvent(new Event(localStoragePlaylistEvent));
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
        cover: songs[0]?.cover ?? defaultMusicImg,
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
/** 更新自定义歌单 */
export function updateCustomPlaylist(playlist: CustomPlaylist[]) {
    localStorage.setItem(localStoragePlaylist, JSON.stringify(playlist));
    window.dispatchEvent(new Event(localStoragePlaylistEvent));
}

const localStorageAudioLoadMode = 'audioLoadMode';  // localstorage 中音频加载模式 key 名
export const localStorageAudioLoadModeEvent = 'audioLoadModeEvent';

export function getAduioLoadMode(): '1' | '0' {
    let result = localStorage.getItem(localStorageAudioLoadMode) as '1' | '0';
    if (result !== '1' && result !== '0') {
        result = '1';
        setAudioLoadMode(true);
    }
    return result;
}
export function setAudioLoadMode(status: boolean) {
    localStorage.setItem(localStorageAudioLoadMode, status ? '1' : '0');
    window.dispatchEvent(new Event(localStorageAudioLoadModeEvent));
}
