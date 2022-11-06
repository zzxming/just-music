import { defineStore, storeToRefs } from "pinia";
import { reactive } from "vue";
import { isArray } from 'lodash';
import { AudioInfoType, MusicInfo, PlayMode } from "@/interface";
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
        if (!audioInfo?.value?.id) {
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
    function playinglistSplice(info: MusicInfo, curPlaying: MusicInfo): MusicInfo | null {
        let index = playinglist.findIndex(music => {
            if (info.type === AudioInfoType.bili) {
                return  music.cid === info.cid;
            }
            return music.id === info.id && music.type === info.type;
        });
        let returnSong = null;
        if (index !== -1) {
            // 在外部无法使用 usePlayerStore 获取到 playerStore 里的变量, 用传参的方式判断是否为当前播放歌曲
            let switchSong = null;
            if (info.type === curPlaying.type && info.id === curPlaying.id && info.cid === curPlaying.cid) {
                // 如果删除是当前播放歌曲, 切换当前播放歌曲, 获取清除当前播放歌曲
                if (playinglist[index + 1] || playinglist[index - 1]) {
                    switchSong = playinglist[index + 1] ?? playinglist[index - 1];
                }
            }
            else {
                switchSong = curPlaying
            }
            playinglist.splice(index, 1);

            returnSong = switchSong;
        }
        ElMessage({
            type: 'success',
            message: '删除成功'
        });
        return returnSong;
    }
    /**
     * 添加至播放列表
     * @param musicInfo 添加的歌曲信息
     * @returns 是否添加成功
     */
    function addToPlaylist(musicInfo: MusicInfo): boolean {
        // 重复不再添加
        let { info } = haveMusic(musicInfo);
        if (!info) {
            let index = playinglist.findIndex(music => audioInfo.value.id === music.id);
            if (index === -1) {
                playinglist.push(musicInfo);
            }
            else {
                playinglist.splice(index + 1, 0, musicInfo);
            }
        }
        // 播放添加的歌曲
        setAudioInfo(musicInfo);
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
        // 获得当前播放歌曲在播放列表的下标
        let { index, info } = haveMusic(audioInfo.value);
        if (!isArray(musicInfo)) {
            musicInfo = [musicInfo];
        }
        // 删除播放列表中的重复歌曲, 然后再添加
        for (let i = 0; i < playinglist.length; i++) {
            let allReadyHave = false;
            let now = playinglist[i];
            if (musicInfo.find(info => {
                if (now.type === AudioInfoType.bili) {
                    return info.cid === now.cid
                }
                return info.id === now.id
            })) {
                allReadyHave = true
            }
            if (allReadyHave) {
                if (i < index) index--;
                playinglist.splice(i--, 1);
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
        }
        ElMessage({
            type: 'success',
            message: '已添加到播放列表'
        });
        return true;
    }
    /** 播放列表中是否有这首歌 */
    function haveMusic(findMusic: MusicInfo): { index: number, info: MusicInfo }  {
        let index = playinglist.findIndex(music => {
            if (findMusic.type === AudioInfoType.bili) {
                return  music.cid === findMusic.cid;
            }
            return music.id === findMusic.id && music.type === findMusic.type;
        });
        return {
            index,
            info: playinglist[index]
        }
    }
    /** 返回播放列表中当前播放歌曲的上一首播放的歌曲信息 */
    function findPreMusic(): MusicInfo | null {
        let { index } = haveMusic(audioInfo.value);
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
                let { index } = haveMusic(audioInfo.value);
                if (index === -1) {
                    return null;
                }
                return playinglist[index + 1] ?? playinglist[0];
            }
            case PlayMode.single: {
                return curMusic;
            }
            case PlayMode.sequential: {
                let { index } = haveMusic(curMusic);
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
        haveMusic,
    }
});

