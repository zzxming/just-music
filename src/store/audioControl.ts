
import { usePlayerStore, usePlaylistStore } from '@/store';
import { PlayMode } from '@/interface';
import { formatAudioTime } from '@/utils/format';


export const useAudioContorlStore = defineStore('audioControl', () => {

    const audioLoading = ref(false);
    const audioIsPaused = ref(true);
    const audioCurrentTimeStr = ref('00:00');
    const audioDurationStr = ref('00:00');
    const audioVolume = ref(0.7);


    /** 绑定 audio 事件 */
    function bindAudioEvent(audioDom: HTMLAudioElement) {
        
        audioDom.addEventListener('timeupdate', function() {
            audioCurrentTimeStr.value = formatAudioTime(this.currentTime)
        });
        audioDom.addEventListener('seeking', function() {
            audioCurrentTimeStr.value = formatAudioTime(this.currentTime)
        });
        audioDom.addEventListener('volumechange', function() {
            audioVolume.value = this.volume;
        });
        // 在手机 ios 的 safari，audio 不会自动加载音频，preload 无效，canplay 不会执行，用这个判断是否加载完成
        audioDom.addEventListener('durationchange', function() {
            // console.log('duration', this.duration)
            if (this.duration) {
                audioDurationStr.value = formatAudioTime(this.duration);
                audioLoading.value = true;
            }
        })
        audioDom.addEventListener('loadeddata', function() {
            // console.log('loadeddata')
            // 加载完成就播放
            this.play()
        })
        audioDom.addEventListener('emptied', function() {
            const playerStore = usePlayerStore();
            // console.log('emptied', !playerStore.audioSrc)
            if (!!playerStore.audioSrc) {
                audioLoading.value = true;
            }
        })
        audioDom.addEventListener('canplay', function() {
            // console.log('canplay')
            audioLoading.value = false;
        })
        audioDom.addEventListener('waiting', function() {
            // console.log('waiting')
            audioLoading.value = true;
        })
        audioDom.addEventListener('playing', function() {
            // console.log('playing')
            audioLoading.value = false;
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('pause', function() {
            // console.log('pause')
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('play', function() {
            // console.log('play')
            audioIsPaused.value = this.paused;
        })
        audioDom.addEventListener('ended', function() {
            // console.log('end')
            playNext();
        })
    }
    /** 根据播放模式播放下一首歌曲 */
    function playNext(isAuto: boolean = true) {
        
        
        
        
        // safari 自动播放下一首的时候会暂停加载，不能自动加载并播放下一首
        // 随机播放的时候有可能会暂停



        const playerStore = usePlayerStore();

        let mode = playerStore.curPlayMode;
        // 手动切换时自动循环歌单
        if (!isAuto) {
            if (mode === PlayMode.single || mode === PlayMode.sequential) {
                mode = PlayMode.loop;
            }
        }
        const playlistStore = usePlaylistStore();

        let next = playlistStore.findNextMusic(mode);
        if (!next) {
            playerStore.resetAudioInfo();
            return;
        }
        if (next === playerStore.audioInfo) {
            playerStore.audio?.load();
        }
        console.log(next)
        playerStore.setAudioInfo(next);
    }
    /** 播放上一首歌曲 */
    function playPre() {
        const playerStore = usePlayerStore();
        const playlistStore = usePlaylistStore();

        let pre = playlistStore.findPreMusic();
        if (!pre) {
            playerStore.resetAudioInfo();
            return;
        }
        playerStore.setAudioInfo(pre);
    }
    /** 音频播放与暂停 */
    function playAudio() {
        if (audioLoading.value) return;
        const playerStore = usePlayerStore();
        let audioDom = playerStore.audio;
        if (audioDom) {
            if (audioDom.paused) {
                const playlistStore = usePlaylistStore();
                // 当播放路径为空且播放列表有歌曲时, 播放第一首
                if (!playerStore.audioSrc && playlistStore.playinglist.length > 0) {
                    playerStore.setAudioInfo(playlistStore.playinglist[0]);
                }
                audioDom.play();
            }
            else{
                audioDom.pause()
            }
        }
    }

    return {
        audioLoading,
        audioIsPaused,
        audioCurrentTimeStr,
        audioDurationStr,
        audioVolume,
        bindAudioEvent,
        playNext,
        playPre,
        playAudio,
    }
});

