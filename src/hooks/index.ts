import { ref, onMounted, onUnmounted, watch, Ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/** 是否为小屏 */
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
        // 如果和上次路由的路径不同再添加
        if (val.path !== routeHistory[routeHistory.length - 1].path) {
            routeHistory.push({fullPath, path: val.path});
        }
    }, { deep: true, immediate: true });

    /** 回到上一个不同的路由 */
    function goBack() {
        // 没有的时候定向到根路径
        if (routeHistory.length <= 1) {
            router.replace('/');
            return;
        }
        // 删除上一个路由, 并跳转至
        router.replace(routeHistory.splice(-1, 1)[0].fullPath);
    }

    return {
        routeHistory,
        goBack,
    }
}
