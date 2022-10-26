import { defineStore } from "pinia";
import { ref } from "vue";
import { PopoutPosition } from '@/components/Popout/index.vue';
import { MusicInfo, PlaylistInfo } from "@/interface";

// 有些组件(PlaylistDrawer)要在他关闭的时候执行一些东西
/** MusicAndPlaylistPopout 组件关闭时 window 触发的事件名 */
export const popoutCloseEvent = 'popoutCloseEvent';


export const usePopoutStore = defineStore('popout', () => {
    /** createPlaylist 组件显示状态 */
    const createPlaylistVisible = ref(false);
    /** cloudLogin 组件显示状态 */
    const cloudLoginVisible = ref(false);

    /** MusicAndPlaylistPopout 组件的状态 start */
    const popoutVisible = ref(false);
    const popoutPosition = ref<PopoutPosition>({
        left: 0,
        top: 0
    });
    const popoutHoldData = ref<MusicInfo | PlaylistInfo>();
    const popoutCanDelete = ref(false);
    const popoutIsMusic = ref(false);
    /** MusicAndPlaylistPopout 组件的状态 end */
    /** 设置 MusicAndPlaylistPopout 组件的状态 */
    function setPopoutState(state: {
        popoutVisible: boolean
        popoutPosition: PopoutPosition
        popoutHoldData: MusicInfo | PlaylistInfo
        popoutCanDelete: boolean
        popoutIsMusic: boolean
    }) {
        popoutPosition.value = state.popoutPosition;
        popoutHoldData.value = state.popoutHoldData;
        popoutCanDelete.value = state.popoutCanDelete;
        popoutIsMusic.value = state.popoutIsMusic;
        popoutVisible.value = state.popoutVisible;
    }

    return {
        createPlaylistVisible,
        cloudLoginVisible,
        popoutVisible,
        popoutPosition,
        popoutHoldData,
        popoutCanDelete,
        popoutIsMusic,
        setPopoutState,
    }
});
