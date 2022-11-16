import { jointQuery } from "@/assets/api";
import { createRouter, createWebHistory, RouteRecordRaw, RouterScrollBehavior } from "vue-router"


const routes: readonly RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home',
    }, {
        path: '/home',
        component: () => import("@/pages/Home/index.vue"),
        meta: {
            keepAlive: true
        }
    }, {
        path: '/song',
        component: () => import("@/pages/Song/index.vue"),
        props(route) {
            return {
                ...route.query
            }
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/playlist',
        component: () => import("@/pages/Playlist/index.vue"),
        beforeEnter(to) {
            if (!to.query.id) {
                return jointQuery(`/playlist`, { id: 1 });
            }
        },
        props(route) {
            return {
                ...route.query
            }
        }
    }, {
        // 这不是存在与 playlist 页面下的子组件, 所以不写在 playlist 的子路由中
        path: '/playlist/detail',
        component: () => import("@/pages/PlaylistDetail/index.vue"),
        props(route) {
            return {
                ...route.query
            }
        },
        meta: {
            keepAlive: true
        }
    }, {
        path: '/search',
        component: () => import("@/pages/Search/index.vue"),
        props(route) {
            return {
                ...route.query
            }
        },
        meta: {
            keepAlive: true
        }
    },{
        path: '/player',
        component: () => import("@/pages/Player/index.vue"),
        meta: {
            keepAlive: true
        }
    }, {
        path: '/404',
        component: () => import("@/pages/Page404/index.vue"),
    }, {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        //savedPosition返回{left：0，top：0} 分别代表x轴和y轴的滚动条（scrollTop）
        if (savedPosition) {
            return savedPosition
        }
    }
})

export default router;
// Awaitable<ScrollPosition | false | void>