<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">员工管理系统</div>
                <el-backtop></el-backtop>
                <div>
                    <el-tooltip content="消息服务" placement="top">
                        <el-button @click="showWeChat" icon="el-icon-message-solid" type="text" style="margin-right: 8px;color: white;" size="normal"></el-button>
                    </el-tooltip>
                    <el-dropdown class="userInfo" @command="commandHandler">
                            <span class="el-dropdown-link">
                                {{user.nickName}}
                                <i><el-image :src="user.avatar"></el-image></i>
                            </span>
                        <el-dropdown-menu size="medium" slot="dropdown">
                            <el-dropdown-item command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item command="avatar">更换头像</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu
                            router
                            style="width:100%;height: 900px;"
                            background-color="#304156"
                            text-color="#fff"
                            active-text-color="#409eff">
                        <el-submenu :index="i+''" v-for="(item,i) in routes" v-if="!item.hidden" :key="i">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="child.path" v-for="(child,j) in item.children" :key="j">
                                <i :class="child.icon"></i>
                                <span slot="title">{{child.name}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb v-if="this.$router.currentRoute.path!='/home'"
                                   separator-class="el-icon-arrow-right"
                                   style="font-size: 15px;">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div v-else>
                        <Welcome></Welcome>
                    </div>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>

        <!--修改密码-->
        <el-dialog
                title="修改密码"
                :visible.sync="pwdDialogVisible"
                width="30%">
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px">
                <el-form-item label="原始密码" prop="originalPassword">
                    <el-input v-model="passwordForm.originalPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="passwordForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="passwordForm.confirmPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="pwdDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleUpdatePassword">确 定</el-button>
          </span>
        </el-dialog>

        <!--更换头像-->
        <div>
            <el-dialog
                    title="更换头像"
                    :visible.sync="avatarDialogVisible"
                    width="30%">
                <div>
                    <el-row>
                        <el-col :span="8" :offset="6">
                            <el-upload
                                    class="avatar-uploader"
                                    action="/auth/avatar"
                                    :show-file-list="false"
                                    :on-success="handleUploadSuccess"
                                    :on-error="handleUploadError">
                                <img alt="点击修改头像" v-if="user.avatar" :src="user.avatar" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-col>
                    </el-row>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="avatarDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="avatarDialogVisible = false">确 定</el-button>
              </span>
            </el-dialog>
        </div>


    </div>
</template>

<script>
    import Welcome from "../components/home/Welcome";

    export default {
        name: "Home",
        components: {Welcome},
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem('user')),
                avatarDialogVisible: false,
                pwdDialogVisible: false,
                userInfoDialogVisible: false,
                fits: ['fill'],
                passwordForm: {
                    originalPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                passwordRules: {
                    originalPassword: [{required: true, message: '请输入原始密码', trigger: 'blur'}],
                    newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
                    confirmPassword: [{required: true, message: '请再次输入新密码', trigger: 'blur'}],
                }
            };
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            }
        },
        methods: {
            commandHandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示').then(() => {
                        axios.get('/logout').then(res => {
                            if (res) {
                                //退出时清空用户对应的菜单
                                this.passwordForm = {
                                    originalPassword: '',
                                    newPassword: '',
                                    confirmPassword: ''
                                }
                                this.$store.commit('initRoutes', []);
                                window.sessionStorage.removeItem('user');
                                this.$router.replace("/");
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                } else if (cmd == 'avatar') {
                    this.avatarDialogVisible = true;
                } else if (cmd == 'password') {
                    this.pwdDialogVisible = true;
                }
            },
            handleUploadSuccess() {
                axios.get('/auth/avatar').then(res => {
                    if (res) {
                        this.user.avatar = res.data;
                        //注意更新session，否则页面刷新头像会变成之前的头像
                        window.sessionStorage.setItem('user', JSON.stringify(this.user));
                    }
                });
            },
            handleUploadError() {
                this.$message.error("文件上传失败！");
            },
            handleUpdatePassword() {
                this.$refs.passwordForm.validate((valid) => {
                    if (valid) {
                        axios.put('/auth/password', this.passwordForm).then(res => {
                            if (res) {
                                //清空session，回到登录页
                                this.$store.commit('initRoutes', []);
                                window.sessionStorage.removeItem('user');
                                this.$router.replace("/");
                            }
                        });
                    } else {
                        this.$message.error("表单不能为空！");
                        return false;
                    }
                });
            },
            showWeChat(){
                this.$router.push("/weChat");
            }
        }
    }
</script>

<style>
    .homeHeader {
        background-color: #304156;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 25px;
        color: white;
    }

    .homeHeader .userInfo {
        font-size: 20px;
        cursor: pointer;
        color: white;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }

    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 10px;
    }

    .homeWelcome {
        text-align: center;
        font-size: 30px;
        padding-top: 50px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 90px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
