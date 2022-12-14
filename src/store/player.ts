import { jointQuery, mediaSrc } from "@/assets/api";
import { getMusicSrcWithCloudId } from "@/assets/cloudApi";
import { AudioInfoType, LocalAudioInfo, CloudAudioInfo, MusicInfo, PlayMode } from "@/interface"
import { formatMusicInfo, isType } from "@/utils/format"
import { ElMessageBox, MessageBoxData, ElMessage } from "element-plus";
import { usePlaylistStore, useComponentStateStore, useAudioContorlStore } from "@/store";


const initAudioInfo = {
    type: AudioInfoType.cloud,
    id: 0,
    cid: 0,
    cover: '',
    title: '',
    duration: 0,
    singers: [],
    album: '',
    fee: 0,
    noCopyrightRcmd: null,
    st: 0,
    full: false,
    publishTime: 0
};
export const usePlayerStore = defineStore('player', () => {
    const audio = ref<HTMLAudioElement>();
    const audioSrc = ref<string | null>(null);    // 部分网易云 vip 歌曲不让试听, 给的路径就是 null
    const audioInfo = ref<MusicInfo>(initAudioInfo);
    const playMode = reactive<PlayMode[]>([PlayMode.loop, PlayMode.single, PlayMode.random, PlayMode.sequential]);
    const playModeIndex = ref(0);
    const curPlayMode = computed(() => playMode[playModeIndex.value]);
    const partialrange = ref(1);    // 是否使用 range 请求音频

    const timer = ref<NodeJS.Timeout>();
    const retryCount = ref(0);
    const messageAlert = ref<Promise<MessageBoxData>>();

    watch(audioInfo, val => {
        if (val.title) {
            document.title = `正在播放：${val.title}`;
        }
        else {
            document.title = 'Just Music'
        }
    })


    /** 设置 audio 元素 */
    function setAudio(media: HTMLAudioElement) {
        audio.value = media;
        const audioControlStore = useAudioContorlStore();
        audio.value.volume = audioControlStore.audioVolume;
    }
    /** 设置音频播放路径 */
    function setAudioSrc(src: string | null) {
        /**
         * 这个 store 不要放在全局, 如果在全局会导致 player 和 playinglist 两个 store 相互调用
         * 导致获取的数据是 undefined , 从而出现其他的意外错误
         */
        const playinglistStore = usePlaylistStore();
        const { findNextMusic } = playinglistStore;

        audioSrc.value = src;
        if (src === null) {
            clearTimeout(timer.value)
            timer.value = setTimeout(() => {
                setAudioInfo(findNextMusic(curPlayMode.value) ?? initAudioInfo);
            }, 2000);
        }
        // else if (audioInfo.value.type === AudioInfoType.bili) {
        //     ElMessage({
        //         type: 'info',
        //         message: '哔哩哔哩音频加载慢，请稍后'
        //     })
        // } 
    }
    /** 设置当前没有播放歌曲 */
    function resetAudioInfo() {
        audioSrc.value = '';
        audioInfo.value = initAudioInfo;
        audio.value?.pause();
    }
    /** 设置当前音频显示信息 */
    async function setAudioInfo(info: LocalAudioInfo | CloudAudioInfo | MusicInfo) {
        if (info !== audioInfo.value) retryCount.value = 0;
        if (timer.value) clearTimeout(timer.value);
        // 之后是否自动显示contronlbar
        let show = false;
        if (audioInfo.value.id === 0) show = true;
        // 因为 isType 是通过 ts 的 is 进行判断, 在执行过程中, ts 以及不存在, 所以需要额外的判断
        if (isType<MusicInfo>(info) && info.title) {
            audioInfo.value = info;
        }
        else {
            let result = formatMusicInfo(info, info.type);
            audioInfo.value = result;
        }
        if(show) {
            const audioControlStore = useComponentStateStore();
            audioControlStore.changePlayerControlState(true)
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
                if (audioInfoCur.fee === 1) {
                    let [err, result] = await getMusicSrcWithCloudId(audioInfoCur.id as number);

                    if (!err && result) {
                        src = result.data.data.src;
                    }
                    else {
                        if (retryCount.value > 3) {
                            const playinglistStore = usePlaylistStore();
                            const { findNextMusic } = playinglistStore;
                            setAudioInfo(findNextMusic(curPlayMode.value) ?? initAudioInfo);
                            return;
                        }
                        // console.log(err);
                        retryCount.value += 1;
                        timer.value = setTimeout(() => {
                            // console.log('retry', retryCount.value)
                            setAudioInfo(info);
                        }, 3000);
                        src = '';
                        return;
                    }
                }
                else {
                    src = `https://music.163.com/song/media/outer/url?id=${audioInfoCur.id}.mp3`
                }
            }
        }
        else if (audioInfoCur.type === AudioInfoType.bili) {
            src = mediaSrc(jointQuery(`/bili/audio`, {bvid: audioInfoCur.id, cid: audioInfoCur.cid}))
        }
        else {
            src = mediaSrc(`/music/local/${audioInfoCur.id}`)
        }
        // console.log(src)
        if (messageAlert.value) ElMessageBox.close();
        // 网易云音乐没有其他版本, 下架了
        if (audioInfo.value.st === -200) {
            setAudioSrc(null);
            ElMessage({
                type: 'error',
                message: '当前歌曲网易云音乐已下架'
            });
        }
        // 网易云音乐有其他版本
        else if (audioInfo.value.noCopyrightRcmd) {
            setAudioSrc(null);
            ElMessage({
                type: 'error',
                message: '此歌曲无法在网易云音乐播放'
            })
        } 
        else if (audioInfo.value.fee === 1) {
            setAudioSrc(src);
            // 防止 messagebox 的弹窗过多, 若上一个没有关闭手动关闭再开启新的
            let t = {};
            Promise.race([messageAlert.value, t]).then(v => (v === t)? "pending" : "fulfilled", () => "rejected")
            .then(state => {
                if (state === 'pending') {
                    ElMessageBox.close();
                }
                messageAlert.value = ElMessageBox.alert(`正在试听 ${audioInfo.value.title} 歌曲片段`, '', {
                    center: true
                });
            })
        }
        else {
            setAudioSrc(src);
        }
    }
    /** 切换播放模式 */
    function changePlayMode() {
        let targetVal = playModeIndex.value + 1;
        targetVal >= playMode.length ? playModeIndex.value = 0 : playModeIndex.value = targetVal;
    }
    /** 切换音频加载方式 */
    function changePartialRangeState(status: boolean) {
        partialrange.value = status ? 1 : 0
    }

    return {
        audio,
        audioSrc,
        audioInfo,
        curPlayMode,
        partialrange,
        setAudio,
        setAudioSrc,
        resetAudioInfo,
        setAudioInfo,
        changePlayMode,
        changePartialRangeState,
    }
});


