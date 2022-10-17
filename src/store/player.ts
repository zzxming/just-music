import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { AudioInfoType, LocalMusic, CloudMusic } from "../interface"

interface LocalAudioInfo extends LocalMusic {
    type: AudioInfoType.local
}
interface CloudAudioInfo extends CloudMusic {
    type: AudioInfoType.cloud
}

export const usePlayerStore = defineStore('player', () => {
    const audio = ref<HTMLAudioElement>();
    const audioSrc = ref(``);
    const showPlayerControl = ref(true);
    const audioInfo = ref<LocalAudioInfo | CloudAudioInfo>();

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
    function setAudioInfo(info: LocalAudioInfo | CloudAudioInfo) {
        audioInfo.value = info;
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