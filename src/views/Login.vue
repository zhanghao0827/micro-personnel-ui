<template>
    <div class="login">
        <el-form v-loading="loading" :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
            <h3 class="login-title">系统登录</h3>
            <el-form-item prop="username">
                <el-input size="medium" v-model="loginForm.username" prefix-icon="el-icon-user-solid" type="text"
                          auto-complete="off"
                          placeholder="账号">
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="medium"
                          v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"
                          auto-complete="off"
                          placeholder="密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input size="medium"
                          v-model="loginForm.code"
                          @keydown.enter.native="submitLogin"
                          prefix-icon="el-icon-success"
                          placeholder="验证码"
                          style="width: 63%">
                </el-input>
                <div class="login-code" @click="updateCode">
                    <img :src="codeUrl" class="login-code-img"/>
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button
                        @click="submitLogin"
                        size="medium"
                        type="primary"
                        style="width:100%;">
                    <span>登 录</span>
                </el-button>
            </el-form-item>
            <el-form-item style="width:100%;">
                <el-button
                        @click="register"
                        size="medium"
                        type="primary"
                        style="width:100%;">
                    <span>注 册</span>
                </el-button>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>Copyright © 2020-2021 easyhao.cn All Rights Reserved.</span>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie' //引入js-cookie
    import {encrypt, decrypt} from "../utils/jsencrypt";

    export default {
        name: "LoginPlus",
        data() {
            return {
                loading: false,
                loginForm: {
                    username: 'admin',
                    password: '123',
                    code: '',
                    rememberMe: false
                },
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                },
                codeUrl: '/verifyCode?time=' + new Date()
            };
        },
        mounted() {
            this.getCookie();
        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        /**
                         * Spring Security登录接口为POST请求
                         * 不支持json格式，只支持键值对
                         * then函数中的回到参数res,为服务器返回数据，但是这里被axios请求拦截器进行二次处理
                         * res为 axios响应拦截器的返回值
                         */
                        let params = "username=" + this.loginForm.username + "&password=" + this.loginForm.password + "&code=" + this.loginForm.code;
                        axios.post('/doLogin', params).then(res => {
                            this.loading = false;
                            if (res) {
                                this.$store.commit("INIT_CURRENTUSER", res.data);
                                this.handleLogLogin();
                                if (this.loginForm.rememberMe) {
                                    Cookies.set('username', this.loginForm.username, {expires: 30})
                                    Cookies.set('password', encrypt(this.loginForm.password), {expires: 30})
                                    Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30})
                                } else {
                                    Cookies.remove('username')
                                    Cookies.remove('password')
                                    Cookies.remove('rememberMe')
                                }
                                window.sessionStorage.setItem("user", JSON.stringify(res.data));
                                /**
                                 * 获取url中path参数值  next('/?redirect=' + to.path);
                                 *  path为 / 或不存在，即用户登录前没有发起请求url
                                 *  否则跳转到登录前的url
                                 */
                                let redirect = this.$route.query.redirect;
                                redirect
                                if (redirect == '/' || redirect == undefined) {
                                    this.$router.replace("/home");
                                } else {
                                    this.$router.replace(redirect);
                                }
                            } else {
                                this.updateCode();
                                this.loginForm.code = '';
                            }
                        });
                    } else {
                        this.$message.error("用户名密码不能为空！");
                        return false;
                    }
                });
            },
            handleLogLogin() {
                axios.post('/log/login/');
            },
            getCookie() {
                const username = Cookies.get('username')
                const password = Cookies.get('password')
                const rememberMe = Cookies.get('rememberMe')
                this.loginForm = {
                    username: username === undefined ? this.loginForm.username : username,
                    password: password === undefined ? this.loginForm.password : decrypt(password),
                    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
                }
            },
            updateCode() {
                this.codeUrl = '/verifyCode?time=' + new Date();
            },
            register() {
                this.$router.push('/register');
            }
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    .login {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 660px;
        background-image: url("../assets/image/login-background.jpg");
        background-size: cover;
    }

    .login-title {
        margin: 0 auto 30px auto;
        text-align: center;
        color: #707070;
    }

    .login-form {
        border-radius: 6px;
        background: #ffffff;
        width: 350px;
        padding: 25px 25px 5px 25px;
    }

    .login-tip {
        font-size: 13px;
        text-align: center;
        color: #bfbfbf;
    }

    .login-code {
        width: 33%;
        height: 34px;
        float: right;
        border: 1px #c1bfbf solid;
        border-radius: 4px;
        overflow: hidden;

        img {
            cursor: pointer;
            vertical-align: middle;
        }
    }

    .el-login-footer {
        height: 40px;
        line-height: 40px;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        font-family: Arial;
        font-size: 12px;
        letter-spacing: 1px;
    }

    .login-code-img {
        /*width: 100%;*/
        /*height: 100%;*/
    }

</style>
