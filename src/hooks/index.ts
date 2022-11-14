import { Ref } from 'vue';

/** 是否为小屏 <550 */
export function useIsSmallScreen(): Ref<boolean> {
    const isSmallScreen = ref(false);

    onMounted(() => {
        calculateTable();
        window.addEventListener('resize', calculateTable)
    });
    onUnmounted(() => {
        window.removeEventListener('resize', calculateTable)
    });
    /** 计算视口宽度是否小屏 */
    function calculateTable() {
        isSmallScreen.value = window.innerWidth < 550;
    }
    
    return isSmallScreen
}