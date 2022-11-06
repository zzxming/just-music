import { Ref } from 'vue';

/** 是否为小屏 <550 */
export function useIsSmallScreen(): Ref<boolean> {
    const smallScreen = ref(false);

    onMounted(() => {
        calculateTable();
        window.addEventListener('resize', calculateTable)
    });
    onUnmounted(() => {
        window.removeEventListener('resize', calculateTable)
    });
    /** 计算视口宽度是否小屏 */
    function calculateTable() {
        smallScreen.value = window.innerWidth < 550;
    }
    
    return smallScreen
}

/** 保存路由的历史, 用于回退 */
export function useRouteHistory() {
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
    }

    return {
        routeHistory,
        goBack,
    }
}
