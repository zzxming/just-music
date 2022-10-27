import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"
import { jointQuery, mediaSrc } from "@/assets/api";
import { getMusicSrcWithCloudId } from "@/assets/cloudApi";
import { AudioInfoType, LocalAudioInfo, CloudAudioInfo, MusicInfo, PlayMode } from "@/interface"
import { formatMusicInfo, isType } from "@/utils"
import { ElMessageBox, ElMessage } from "element-plus";

const initAudioInfo = {
    type: AudioInfoType.local,
    id: 0,
    cover: '',
    title: '',
    duration: 0,
    singers: [],
    album: '',
    fee: 0,
    noCopyrightRcmd: null,
    st: 0
};
export const usePlayerStore = defineStore('player', () => {
    const audio = ref<HTMLAudioElement>();
    const audioSrc = ref<string | null>(``);    // 部分网易云 vip 歌曲不让试听, 给的路径就是 null
    const showPlayerControl = ref(false);
    const audioInfo = ref<MusicInfo>(initAudioInfo);
    const playMode = reactive<PlayMode[]>([PlayMode.loop, PlayMode.single, PlayMode.random, PlayMode.sequential]);
    const playModeIndex = ref(0);
    const curPlayMode = computed(() => playMode[playModeIndex.value]);

    /** 设置 audio 元素 */
    function setAudio(media: HTMLAudioElement) {
        if (audio) {
            audio.value = media
        }
    }
    /** 设置音频播放路径 */
    function setAudioSrc(src: string | null) {
        audioSrc.value = src;
    }
    /** 改变全局音频显示状态 */
    function changePlayerControlState(visible: boolean) {
        showPlayerControl.value = visible;
    }
    /** 设置当前没有播放歌曲 */
    function resetAudioInfo() {
        audioSrc.value = '';
        audioInfo.value = initAudioInfo;
        audio.value?.pause();
    }
    /** 设置当前音频显示信息 */
    async function setAudioInfo(info: LocalAudioInfo | CloudAudioInfo | MusicInfo) {
        // 因为 isType 是通过 ts 的 is 进行判断, 在执行过程中, ts 以及不存在, 所以需要额外的判断
        if (isType<MusicInfo>(info) && info.title) {
            audioInfo.value = info;
        }
        else {
            let result = formatMusicInfo(info, info.type);
            audioInfo.value = result;
        }
        showPlayerControl.value = true;

        // 网易云音乐没有其他版本, 下架了
        if (audioInfo.value.st === -200) {
            ElMessage({
                type: 'error',
                message: '当前歌曲网易云音乐已下架'
            })
        }
        // 网易云音乐有其他版本
        else if (audioInfo.value.noCopyrightRcmd) {
            ElMessage({
                type: 'error',
                message: '此歌曲无法在网易云音乐播放'
            })
        } 
        else if (audioInfo.value.fee === 1) {
            ElMessageBox.alert(`正在试听 ${audioInfo.value.title} 歌曲片段`, '', {
                center: true
            })
        }

        let src: string | null;
        let audioInfoCur = audioInfo.value;
        if (audioInfoCur.type === AudioInfoType.cloud) {
            // 网易云没有音源, 这个属性表示有别的版本
            if (audioInfoCur.noCopyrightRcmd) {
                src = null;
            }
            else {
                // https://music.163.com/song?id=476081899
                // 如果是 vip 歌曲需要获取歌曲的播放路径
                // 部分 vip 歌曲不让试听, 则获取的 src 为 null
                if (audioInfoCur.fee) {
                    let [err, result] = await getMusicSrcWithCloudId(audioInfoCur.id as number);
                    if (!err && result) {
                        src = result.data.data.src;
                    }
                    else {
                        console.log(err);
                        return;
                    }
                }
                else {
                    src = `https://music.163.com/song/media/outer/url?id=${audioInfoCur.id}.mp3`
                }
            }
        }
        else if (audioInfoCur.type === AudioInfoType.bili) {
            src = mediaSrc(jointQuery(`/bili/audio`, {bv: audioInfoCur.id}))
        }
        else {
            src = mediaSrc(`/music/local/${audioInfoCur.id}`)
        }
        // console.log(src)
        setAudioSrc(src)
    }
    /** 切换播放模式 */
    function changePlayMode() {
        let targetVal = playModeIndex.value + 1;
        targetVal >= playMode.length ? playModeIndex.value = 0 : playModeIndex.value = targetVal;
    }

    return {
        audio,
        audioSrc,
        showPlayerControl,
        audioInfo,
        curPlayMode,
        setAudio,
        setAudioSrc,
        changePlayerControlState,
        resetAudioInfo,
        setAudioInfo,
        changePlayMode,
    }
});


