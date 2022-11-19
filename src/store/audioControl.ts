
import { usePlayerStore, usePlaylistStore } from '@/store';
import { PlayMode } from '@/interface';
import { formatAudioTime } from '@/utils/format';


export const useAudioContorlStore = defineStore('audioControl', () => {

    const audioLoading = ref(false);
    const audioIsPaused = ref(true);
    const audioCurrentTimeStr = ref('00:00');
    const audioDurationStr = ref('00:00');
    const audioVolume = ref(0.7);
    const audioBuffered = ref(0);


    /** 绑定 audio 事件 */
    function bindAudioEvent(audioDom: HTMLAudioElement) {
        const playerStore = usePlayerStore();
        
        audioDom.addEventListener('progress', function() {
            for (let i = this.buffered.length - 1; i < this.buffered.length; i++) {
                // console.log('start',this.buffered.start(i),'end',this.buffered.end(i), i, this.buffered.length) 
                audioBuffered.value = Math.floor(this.buffered.end(i) / (playerStore.audioInfo.duration / 1000) * 10000) / 100;
                if (audioBuffered.value > 100) audioBuffered.value = 100;
            }
        })
        audioDom.addEventListener('timeupdate', function() {
            // safari 在播放前跳转进度的话, 这个事件之后就不会再触发了
            audioCurrentTimeStr.value = formatAudioTime(this.currentTime)
        });
        // ios safari 跳转进度会触发ended事件,导致自动播放下一首
        audioDom.addEventListener('ended', function() {
            // console.log('end')
            audioIsPaused.value = true;
            playNext();
        })
        audioDom.addEventListener('seeking', function() {
            audioCurrentTimeStr.value = formatAudioTime(this.currentTime)
        });
        audioDom.addEventListener('volumechange', function() {
            // ios safari 调整音量只能调整浏览器的音量
            audioVolume.value = this.volume;
        });
        // 在手机 ios 的 safari，audio 不会自动加载音频，preload 无效，canplay 不会执行，用这个判断是否加载完成
        audioDom.addEventListener('durationchange', function() {
            // console.log('duration', playerStore.audioInfo.duration / 1000)
            audioBuffered.value = 0;
            audioDurationStr.value = formatAudioTime(playerStore.audioInfo.duration / 1000);
            audioCurrentTimeStr.value = formatAudioTime(this.currentTime);
            audioLoading.value = false;
            audioIsPaused.value = false;
        })
        // audioDom.addEventListener('loadeddata', function() {
        //     // console.log('loadeddata')
        //     // 加载完成就播放
        //     this.play()
        // })
        audioDom.addEventListener('emptied', function() {
            const playerStore = usePlayerStore();
            // console.log('emptied', playerStore.audioInfo)
            // 保证 ios safari 可以直接播放，切换时能自动播放
            this.currentTime = 0;
            this.play()
            if (!!playerStore.audioSrc) {
                audioLoading.value = true;
            }
        })
        audioDom.addEventListener('canplay', function() {
            // console.log('canplay')
            audioLoading.value = false;
            this.play()
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
    }
    /** 根据播放模式播放下一首歌曲 */
    function playNext(isAuto: boolean = true) {
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
        // console.log(next)
        playerStore.setAudioInfo(next);
        playerStore.audio?.load();
        isAuto && playerStore.audio?.play();
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
        audioBuffered,
        bindAudioEvent,
        playNext,
        playPre,
        playAudio,
    }
});

