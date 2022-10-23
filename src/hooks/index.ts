import { ref, onMounted, onUnmounted, Ref } from 'vue';

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

