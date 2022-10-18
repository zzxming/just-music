import { defineStore } from "pinia"
import { ref } from "vue"
import { AudioInfoType, LocalAudioInfo, CloudAudioInfo, MusicInfo } from "../interface"
import { formatMusicInfo } from "../utils"


export const usePlayerStore = defineStore('player', () => {
    const audio = ref<HTMLAudioElement>();
    const audioSrc = ref(``);
    const showPlayerControl = ref(true);
    const audioInfo = ref<MusicInfo>({
        type: AudioInfoType.local,
        id: 0,
        cover: '',
        title: '',
        duration: 0,
        singers: [],
        src: ''
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
    async function setAudioInfo(info: LocalAudioInfo | CloudAudioInfo) {
        let result = await formatMusicInfo(info);
        audioInfo.value = result
        audioSrc.value = result.src
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



// {
//     state: () => ({
//         audioSrc: '',
//         showPlayerControl: true
//     }),
//     actions: {
//         setAudioSrc(src: string) {
//             this.audioSrc = src;
//         },
//         changePlayerControlState(visible: boolean) {
//             this.showPlayerControl = visible
//         }
//     }
// }

// () => {
//     let audioSrc = ref('');
//     let showPlayerControl = ref(true);

//     function setAudioSrc(src: string) {
//         audioSrc.value = src;
//     }
//     function changePlayerControlState(visible: boolean) {
//         console.log(visible)
//         showPlayerControl.value = visible;
//     }

//     return {
//         audioSrc,
//         showPlayerControl,
//         setAudioSrc,
//         changePlayerControlState,
//     }
// }