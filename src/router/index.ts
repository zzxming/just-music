import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Home from "../pages/Home/index.vue"
import Player from "../pages/Player/index.vue"
import Playlist from "../pages/Playlist/index.vue"
import Song from "../pages/Song/index.vue"

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
    }, {
        path: '/playlist',
        component: Playlist
    }, {
        path: '/song',
        component: Song,
        props(route) {
            return {
                ...route.query
            }
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
