import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { mediaSrc } from "../assets/api"
import { getMusicSrcWithCloudId } from "../assets/cloudApi"
import { AudioInfoType, LocalMusic, CloudMusic } from "../interface"

interface LocalAudioInfo extends LocalMusic {
    type: AudioInfoType.local
}
interface CloudAudioInfo extends CloudMusic {
    type: AudioInfoType.cloud
}
interface MusicInfo {
    type: AudioInfoType
    id: number
    title: string
    cover: string
    singers: Singer[]
    duration: number
    src: string
} 
interface Singer {
    id: number
    name: string
}


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
        let id: number, 
            title: string, 
            cover: string, 
            duration: number, 
            singers: Singer[], 
            src: string;
        if (info.type === AudioInfoType.local) {
            id = info.music_id;
            title = info.music_name;
            cover = info.music_cover;
            duration = info.duration;
            singers = info.singers.map(item => ({id: item.singer_id, name: item.singer_name}));
            src = mediaSrc(`/music/${info.music_id}`)
        }
        else {
            id = info.id;
            title = info.name;
            cover = info.al.picUrl;
            duration = info.dt;
            singers = info.ar;
            let [err, result] = await getMusicSrcWithCloudId(info.id);
            if (!err && result) {
                src = result.data.data.src;
            }
            else {
                src = ''
            }
        }
        audioInfo.value = {
            type: info.type, id, title, cover, duration, singers, src
        };
        audioSrc.value = src
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