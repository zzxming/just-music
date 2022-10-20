import { defineStore } from "pinia"
import { ref } from "vue"
import { mediaSrc } from "@/assets/api";
import { getMusicSrcWithCloudId } from "@/assets/cloudApi";
import { AudioInfoType, LocalAudioInfo, CloudAudioInfo, MusicInfo } from "@/interface"
import { formatMusicInfo, isType } from "@/utils"


export const usePlayerStore = defineStore('player', () => {
    const audio = ref<HTMLAudioElement>();
    const audioSrc = ref<string | null>(``);
    const showPlayerControl = ref(true);
    const audioInfo = ref<MusicInfo>({
        type: AudioInfoType.local,
        id: 0,
        cover: '',
        title: '',
        duration: 0,
        singers: [],
        album: '',
        fee: 0
    });

    function setAudio(media: HTMLAudioElement) {
        if (audio) {
            audio.value = media
        }
    }
    function setAudioSrc(src: string) {
        audioSrc.value = src;
    }
    function changePlayerControlState(visible: boolean) {
        showPlayerControl.value = visible;
    }
    async function setAudioInfo(info: LocalAudioInfo | CloudAudioInfo | MusicInfo) {
        // 因为 isType 是通过 ts 的 is 进行判断, 在执行过程中, ts 以及不存在, 所以需要额外的判断
        if (isType<MusicInfo>(info) && info.title) {
            audioInfo.value = info;
        }
        else {
            let result = formatMusicInfo(info);
            audioInfo.value = result;
        }
        let src: string;
        if (info.type === AudioInfoType.cloud) {
            // https://music.163.com/song?id=476081899
            // 如果是vip歌曲需要获取歌曲的播放路径
            // 部分 vip 歌曲不让试听, 则获取的 src 为 null
            if (info.fee) {
                let [err, result] = await getMusicSrcWithCloudId(info.id);
                if (!err && result) {
                    src = result.data.data.src;
                }
                else {
                    await setAudioInfo(info);
                    return;
                }
            }
            else {
                src = `https://music.163.com/song/media/outer/url?id=${info.id}.mp3`
            }
        }
        else {
            if (isType<LocalAudioInfo>(info)) {
                src = mediaSrc(info.music_url);
            }
            else {
                src = mediaSrc(`/music/${info.id}`);
            }
        }
        setAudioSrc(src)
        // audioSrc.value = result.src
    }

    return {
        audio,
        audioSrc,
        showPlayerControl,
        audioInfo,
        setAudio,
        setAudioSrc,
        changePlayerControlState,
        setAudioInfo,
    }
});


