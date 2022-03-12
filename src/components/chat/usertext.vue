<template>
    <div id="uesrtext">
        <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" v-on:keyup="addMessage">
        </textarea>
        <el-button @click="sendMessage" type="success" plain>发送</el-button>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'uesrtext',
        data() {
            return {
                content: ''
            }
        },
        computed: mapState([
            'sessions',
            'currentSession'
        ]),
        methods: {
            addMessage(e) {
                if (e.ctrlKey && e.keyCode === 13) {
                    this.sendMessage();
                }
            },
            sendMessage() {
                if (this.currentSession.userName === undefined) {
                    this.$message.warning('请选择要发送消息的用户！');
                    return;
                }
                if (this.content === '') {
                    this.$message.warning('消息内容不能为空！');
                    return;
                }
                let msgObj = {};
                msgObj.to = this.currentSession.userName;
                msgObj.content = this.content;
                //发送消息
                this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(msgObj));
                this.$store.commit('addMessage', msgObj);
                this.content = '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    #uesrtext {
        display: flex;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 30%;
        border-top: solid 1px #DDD;

        > textarea {
            padding: 10px;
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
        }
    }
</style>
