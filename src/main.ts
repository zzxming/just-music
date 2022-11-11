import { createApp } from 'vue'
import '@/style.less'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import lazyPlugin from 'vue3-lazy'
import { mediaSrc, defaultMusicImg } from '@/assets/api';
import { customDirective } from '@/directives';

const app = createApp(App);

for (let n in customDirective) {
    app.directive(n, customDirective[n])
}


app.use(createPinia());
app.use(lazyPlugin, {
    loading: mediaSrc(defaultMusicImg),
    error: mediaSrc(defaultMusicImg)
});
app.use(router).mount('#app');
