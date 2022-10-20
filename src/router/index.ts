import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import Home from "@/pages/Home/index.vue"
import Player from "@/pages/Player/index.vue"
import Playlist from "@/pages/Playlist/index.vue"
import PlaylistDetail from "@/pages/PlaylistDetail/index.vue"
import Search from "@/pages/Search/index.vue"
import Page404 from "@/pages/Page404/index.vue"

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
        component: Playlist,
        children: [
            {
                path: 'detail',
                component: PlaylistDetail,
                props(route) {
                    return {
                        ...route.query
                    }
                }
            }
        ]
    }, {
        path: '/search',
        component: Search,
        props(route) {
            return {
                ...route.query
            }
        }
    }, {
        path: '/404',
        component: Page404
    }, {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
