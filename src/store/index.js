import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios";

import SockJS from "sockjs-client"
import Stomp from "stompjs"

import {Notification} from 'element-ui';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},//保存聊天记录 键值对：zhanghao#sunyan:[{...},{...},{...}]
        users: [],
        currentSession: null, //当前选中用户
        currentUser: JSON.parse(window.sessionStorage.getItem('user')),
        filterKey: '',
        stomp: null, //连接对象
        isDot: {}
    },
    mutations: {
        INIT_CURRENTUSER(state, user) {
            state.currentUser = user;
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        changeCurrentSession(state, currentSession) {
            Vue.set(state.isDot, state.currentUser.userName + '#' + currentSession.userName, false);
            state.currentSession = currentSession;
        },
        addMessage(state, msg) {
            let mess = state.sessions[state.currentUser.userName + '#' + msg.to];
            if (!mess) {
                // state.sessions[state.currentUser.userName + '#' + msg.to] = [];
                Vue.set(state.sessions, state.currentUser.userName + '#' + msg.to, []);
            }
            //键值对  zhanghao#sunyan:[{...},{...},{...}]
            state.sessions[state.currentUser.userName + '#' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf  //是不是自己
            });
        },
        INIT_DATA(state) {
            // 浏览器本地历史聊天记录可以在这里完成
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_USERS(state, data) {
            state.users = data;
        }
    },
    actions: {
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));//建立连接点
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {//订阅（接收）消息
                    let receiveMsg = JSON.parse(msg.body);
                    if (!context.state.currentSession || receiveMsg.from !== context.state.currentSession.userName) {
                        Notification.info({
                            title: receiveMsg.fromNickName,
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) + '...' : receiveMsg.content,
                        });
                        Vue.set(context.state.isDot, context.state.currentUser.userName + '#' + receiveMsg.from, true);
                    }
                    receiveMsg.notSelf = true;
                    receiveMsg.to = receiveMsg.from;
                    context.commit('addMessage', receiveMsg);
                });
            }, error => {

            });
        },
        initData(context) {
            context.commit('INIT_DATA')
            Axios.get('/chat/users').then(res => {
                if (res) {
                    context.commit('INIT_USERS', res.data);
                }
            });
        }
    },
    modules: {}
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;
