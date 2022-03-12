import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login"
import Home from "../views/Home"
import Register from "../views/Register"
import WeChat from "../views/chat/WeChat"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden: true,
        children: [
            {
                path: '/weChat',
                name: '在线聊天',
                component: WeChat,
                hidden: true
            }
        ]
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        hidden: true
    },
    {
        /**
         * 含有通配符的路由放在最后（动态路由）
         * 匹配不到的路由，统一重定向到home,防止页面404或空白
         */
        path: '*',
        redirect: '/home'
    }
]

const router = new VueRouter({
    routes
})

export default router
