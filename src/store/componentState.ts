
/** 组件 FullScreenMask 被点击关闭触发的事件名称 */
export const fullScreenMaskEvent = 'fullScreenMaskClick';


export const useComponentStateStore = defineStore('componentState', () => {

    const showPlayerControl = ref(false);
    /** 改变全局音频显示状态 */
    function changePlayerControlState(visible: boolean) {
        showPlayerControl.value = visible;
    }

    const showHeader = ref(true);
    /** 改变全局 header 显示状态 */
    function changeShowHeaderState(visible: boolean) {
        showHeader.value = visible;
    }

    const activePlayinglist = ref(false);
    /** 改变全局播放列表显示状态 */
    function changePlayinglistState(visible: boolean) {
        activePlayinglist.value = visible;
    }


    // 路由历史路径
    const routeHistory = reactive<{path: string, fullPath: string}[]>([]);
    const route = useRoute();
    const router = useRouter();

    watch(() => route, (val) => {
        let fullPath = val.fullPath;
        // 第一次路由直接添加
        if (routeHistory.length < 1) {
            routeHistory.push({fullPath, path: val.path});
            return;
        }
        // 如果这次进的是404, 表示上一次的路径是无效的, 删除掉
        if (val.path === '/404' && routeHistory.length > 1) {
            // 如果路径小于2, 说明是直接进入的404, 刚才删的是根路径, 补回去
            routeHistory.splice(routeHistory.length - 1, 1);
        }
        // 如果和上次路由的路径不同再添加, 相同则替换
        if (val.path !== routeHistory[routeHistory.length - 1].path) {
            routeHistory.push({fullPath, path: val.path});
        }
        else {
            routeHistory[routeHistory.length - 1] = {fullPath, path: val.path};
        }
    }, { deep: true, immediate: true });

    /** 回到上一个不同的路由 */
    function goBack() {
        // 没有的时候定向到根路径
        if (routeHistory.length <= 1) {
            router.replace('/');
            return;
        }
        // 删除当前路由, 并跳转至前一个
        routeHistory.splice(-1, 1);
        router.replace(routeHistory[routeHistory.length - 1].fullPath);
        // 使用 goback 可以保留用户的页面滚动位置
        // router.back();
    }
 
    const fullScreenMaskState = ref(false);
    /** 改变全局播放列表显示状态 */
    function changFullScreenMaskState(visible: boolean) {
        fullScreenMaskState.value = visible;
        if (!visible) {
            window.dispatchEvent(new Event(fullScreenMaskEvent));
        }
    }


    return {
        showPlayerControl,
        changePlayerControlState,
        showHeader,
        changeShowHeaderState,
        activePlayinglist,
        changePlayinglistState,
        routeHistory,
        goBack,
        fullScreenMaskState,
        changFullScreenMaskState,
    }

});
