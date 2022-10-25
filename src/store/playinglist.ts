import { defineStore, storeToRefs } from "pinia";
import { reactive } from "vue";
import { isArray } from 'lodash';
import { MusicInfo, PlayMode } from "@/interface";
import { usePlayerStore } from '@/store/player';
import { ElMessage } from "element-plus";


export const usePlaylistStore = defineStore('playlist', () => {
    const playinglist = reactive<MusicInfo[]>([]);
    const playerStore = usePlayerStore();
    const { audioInfo, curPlayMode } = storeToRefs(playerStore);
    const { setAudioInfo } = playerStore;

    /** 替换播放列表 */
    function playinglistReplace(songs: MusicInfo[]) {
        playinglist.length = 0;
        playinglist.push(...songs);
        if (!audioInfo.value.id) {
            if (curPlayMode.value === PlayMode.random) {
                setAudioInfo(playinglist[Math.floor(Math.random() * (playinglist.length - 1))]);
            }
            else {
                setAudioInfo(playinglist[0]);
            }
        }
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
    /**
     * 添加至播放列表
     * @param musicInfo 添加的歌曲信息
     * @returns 是否添加成功
     */
    function addToPlaylist(musicInfo: MusicInfo): boolean {
        // 重复不再添加
        if (!haveMusic(musicInfo)) {
            let index = playinglist.findIndex(music => audioInfo.value.id === music.id);
            if (index === -1) {
                playinglist.push(musicInfo);
            }
            else {
                playinglist.splice(index + 1, 0, musicInfo);
            }
            setAudioInfo(musicInfo);
        }

        ElMessage({
            type: 'success',
            message: '已开始播放'
        });
        return true;
    }
    /**
     * 添加至下一首播放
     * @param musicInfo 添加的歌曲信息
     * @returns 是否添加成功
     */
    function addToNextPlay(musicInfo: MusicInfo | MusicInfo[]): boolean {
        let index = playinglist.findIndex(music => audioInfo.value.id === music.id);
        if (!isArray(musicInfo)) {
            musicInfo = [musicInfo];
        }
        // 去除重复歌曲
        for (let i = 0; i < musicInfo.length; i++) {
            if (haveMusic(musicInfo[i])) {
                musicInfo.splice(i--, 1);
            }
        }

        if (playinglist.length < 1) {
            setAudioInfo(musicInfo[0]);
        }
        if (index === -1) {
            playinglist.push(...musicInfo);
        }
        else {
            playinglist.splice(index + 1, 0, ...musicInfo);
            ElMessage({
                type: 'success',
                message: '已添加到播放列表'
            });
        }
        return true;
    }
    /** 播放列表中是否有这首歌 */
    function haveMusic(findMusic: MusicInfo) {
        return !!playinglist.find(music => music.id === findMusic.id && music.type === findMusic.type);
    }
    /** 返回播放列表中当前播放歌曲的上一首播放的歌曲信息 */
    function findPreMusic(): MusicInfo | null {
        let index = playinglist.findIndex(music => audioInfo.value.id === music.id);
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
    function findNextMusic(mode: PlayMode): MusicInfo | null {
        let curMusic = audioInfo.value;
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
        addToPlaylist,
        addToNextPlay,
        findPreMusic,
        findNextMusic,
    }
});

