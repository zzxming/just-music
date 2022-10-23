import { defineStore, storeToRefs } from "pinia";
import { reactive } from "vue";
import { MusicInfo, PlayMode } from "@/interface";
import { usePlayerStore } from './player'
import { info } from "console";
import { PlaylistVal } from "@/assets/cloudApi";


export const usePlaylistStore = defineStore('playlist', () => {
    const playinglist = reactive<MusicInfo[]>([]);

    /** 替换播放列表 */
    function playinglistReplace(songs: MusicInfo[]) {
        playinglist.length = 0;
        playinglist.push(...songs)
    }
    /**
     * 从播放列表删除一项
     * @param id 删除歌曲id
     * @param curPlaying 当前播放歌曲信息
     * @returns null表示没有歌曲能够切换, 其他返回表示切换至的歌曲信息
     */
    function playinglistSplice(id: number | string, curPlaying: MusicInfo): MusicInfo | null {
        let index = playinglist.findIndex(song => song.id === id);
        if (index === -1) return null;
        // 在外部无法使用 usePlayerStore 获取到 playerStore 里的变量, 用传参的方式判断是否为当前播放歌曲
        let switchSong = null;
        if (id === curPlaying.id) {
            // 如果删除是当前播放歌曲, 切换当前播放歌曲, 获取清除当前播放歌曲
            if (playinglist[index + 1] || playinglist[index - 1]) {
                switchSong = playinglist[index + 1] ?? playinglist[index - 1];
            }
        }
        playinglist.splice(index, 1);
        return switchSong
    }
    /** 返回播放列表中当前播放歌曲的上一首播放的歌曲信息 */
    function findPreMusic(curMusic: MusicInfo): MusicInfo | null {
        let index = playinglist.findIndex(music => curMusic.id === music.id);
        if (index === -1) {
            return null;
        }
        return playinglist[index - 1] ?? playinglist[playinglist.length - 1];
    }
    /**
     * 根据当前播放歌曲id和播放模式找到并返回下一首播放歌曲信息
     * @param curMusic 当前播放歌曲信息
     * @param mode 播放模式
     * @returns null表示不切换, 其他返回为切换至的歌曲信息
     */
    function findNextMusic(curMusic: MusicInfo, mode: PlayMode): MusicInfo | null {
        switch(mode) {
            case PlayMode.loop: {
                let index = playinglist.findIndex(music => curMusic.id === music.id);
                if (index === -1) {
                    return null;
                }
                return playinglist[index + 1] ?? playinglist[0];
            }
            case PlayMode.single: {
                return curMusic;
            }
            case PlayMode.sequential: {
                let index = playinglist.findIndex(music => curMusic.id === music.id);
                if (index === -1) {
                    return null;
                }
                return playinglist[index + 1] ?? null;
            }
            case PlayMode.random: {
                return playinglist[Math.floor(Math.random() * (playinglist.length - 1))]
            }
            default: {
                return null;
            }
        }
    }

    return {
        playinglist,
        playinglistReplace,
        playinglistSplice,
        findPreMusic,
        findNextMusic,
    }
});

