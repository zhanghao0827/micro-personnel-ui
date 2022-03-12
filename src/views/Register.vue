<template>
    <div>
        <el-form :model="registerForm" ref="registerForm" :rules="rules" label-width="100px" class="register-container">
            <h3 class="register-title">用户注册</h3>
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="registerForm.userName" placeholder="请输入用户名称（如：zhangsan）" type="text"
                          auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="registerForm.nickName" placeholder="请输入用户昵称（如：张三）" type="text"
                          auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
                <el-input v-model="registerForm.password" placeholder="请输入密码" type="password"
                          auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" placeholder="请输入邮箱" type="text" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="registerForm.phone" placeholder="请输入手机号码" type="text" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="短信验证码" prop="code">
                <el-input v-model="registerForm.code" style="width: 125px;" type="text" auto-complete="off"></el-input>
                <div class="register-msg-btn">
                    <el-button @click="sendMsm" :disabled="smsDisabled" type="primary" plain>{{smsContent}}</el-button>
                </div>
            </el-form-item>
            <div>
                <el-button @click="submitRegister" type="primary" class="register-submit">注册</el-button>
            </div>
            <div style="margin-top: 20px;">
                <el-button @click="backLogin" type="primary" class="back-login">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Register",
        data() {
            return {
                registerForm: {
                    userName: '',
                    nickName: '',
                    password: '',
                    email: '',
                    phone: '',
                    code: ''
                },
                smsContent: '发送验证码',
                smsTime: 60,
                smsDisabled: false,
                rules: {
                    userName: [{required: true, message: '请选择用户名称', trigger: 'blur'}],
                    nickName: [{required: true, message: '请选择用户昵称', trigger: 'blur'}],
                    password: [{required: true, message: '请选择用户密码', trigger: 'blur'}],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', required: true, message: '邮箱格式错误', trigger: 'blur'}
                    ],
                    phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入短信验证码', trigger: 'blur'}],
                }

            };
        },
        methods: {
            sendMsm() {
                if (this.registerForm.phone == '') {
                    this.$message.warning("请输入手机号码！");
                } else if (!(/^1[3456789]\d{9}$/.test(this.registerForm.phone))) {
                    this.$message.error("手机号码格式错误！");
                } else {
                    //请求后端发送验证码
                    axios.get('/sms?photo=' + this.registerForm.phone).then(res => {
                        if (res) {
                            let clock = window.setInterval(() => {
                                this.smsDisabled = true;
                                this.smsTime--;
                                this.smsContent = this.smsTime + 's后重新发送'
                                if (this.smsTime < 0) {     //当倒计时小于0时清除定时器
                                    window.clearInterval(clock);
                                    this.smsContent = '重新发送';
                                    this.smsDisabled = false;
                                    this.smsTime = 60;
                                }
                            }, 1000);
                        }
                    });
                }
            },
            submitRegister() {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        axios.post('/register', this.registerForm).then(res => {
                            if (res) {
                                this.registerForm.userName = '';
                                this.registerForm.nickName = '';
                                this.registerForm.password = '';
                                this.registerForm.email = '';
                                this.registerForm.phone = '';
                                this.registerForm.code = '';
                                this.$router.replace("/");
                            }
                        });
                    } else {
                        this.$message.warning("表单不能为空！");
                        return false;
                    }
                });
            },
            backLogin() {
                this.$router.push("/");
            }
        }
    }
</script>

<style>
    .register-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 50px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .register-title {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .register-submit {
        width: 100%;
        text-align: center;
    }

    .register-msg-btn {
        width: 100px;
        height: 32px;
        float: right;
    }

    .register-msg-btn button {
        width: 100%;
        height: 100%;
    }

    .back-login {
        width: 100%;
        text-align: center;
    }

</style>
