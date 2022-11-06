import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'
// import ElementPlus from 'element-plus'
// import { ElAvatar, ElButton, ElCol, ElDialog, ElForm, ElFormItem, ElIcon, ElInput,ElRow,ElTabPane,ElTabs } from 'element-plus'
// import 'element-plus/dist/index.css'
// import { ArrowLeft, ArrowRightBold, Search, Expand, Delete, Close, Plus, VideoPlay, CaretRight, Loading, CaretTop, CaretBottom } from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import lazyPlugin from 'vue3-lazy'
import { mediaSrc, defaultMusicImg } from '@/assets/api';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
// const components = [ 
//     ElAvatar, ElButton, ElCol, ElDialog, ElForm, ElFormItem, ElIcon, ElInput, ElRow, ElTabPane, ElTabs,
//     ArrowLeft, ArrowRightBold, Search, Expand, Delete, Close, Plus, VideoPlay, CaretRight, Loading, CaretTop, CaretBottom
// ]
// for (let component of components) {
//     app.component(component.name, component)
// }

app.use(createPinia());
// app.use(ElementPlus);
app.use(lazyPlugin, {
    loading: mediaSrc(defaultMusicImg),
    error: mediaSrc(defaultMusicImg)
});
app.use(router).mount('#app');
