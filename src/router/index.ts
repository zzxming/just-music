import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Home from "../pages/Home/index.vue"
import Player from "../pages/Player/index.vue"

const routes: readonly RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
    }, {
        path: '/home',
        component: Home
    }, {
        path: '/player',
        component: Player
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
