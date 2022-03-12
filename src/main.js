import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './utils/request.js'
import {initMenu} from "./utils/menu"
import {Message} from 'element-ui'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    //访问登录页面直接放行
    if (to.path == '/' || to.path=='/register') {
        next();
    } else {
        //访问非登录页面首先判断是否登录
        if (window.sessionStorage.getItem('user')) {//如果登录成功加载菜单
            initMenu(router, store);
            next();
        } else {
            //没有登录跳转到登录页面
            Message.error({message: '请求失败，请登录或联系管理员！', showClose: true});
            //记录请求失败的path，如果登录成功之后直接访问path
            next('/?redirect=' + to.path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
