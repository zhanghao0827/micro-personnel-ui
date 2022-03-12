<template>
    <div>
        <div style="margin-top: 20px;">
            <el-button @click="showAddDialog" type="primary" icon="el-icon-plus" size="small">添加用户</el-button>
        </div>
        <div>
            <el-table
                    v-loading="loading"
                    :data="userListPage"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="userId"
                        label="用户编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名称"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="nickName"
                        label="用户昵称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号码"
                        width="150">
                </el-table-column>
<!--                <el-table-column-->
<!--                        label="角色"-->
<!--                        width="150">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-popover-->
<!--                                @show="showPopover(scope.row)"-->
<!--                                @hide="hidePopover(scope.row)"-->
<!--                                placement="bottom"-->
<!--                                title="用户角色"-->
<!--                                width="200"-->
<!--                                trigger="click">-->
<!--                            <div>-->
<!--                                <el-select multiple :multiple-limit="3" v-model="roleIds" placeholder="请选择">-->
<!--                                    <el-option-->
<!--                                            v-for="(role,index) in roleAll"-->
<!--                                            :key="index"-->
<!--                                            :label="role.roleName"-->
<!--                                            :value="role.roleId">-->
<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                            </div>-->
<!--                            <el-button :disabled="roleAllVisible" slot="reference" type="text" icon="el-icon-view">点击查看-->
<!--                            </el-button>-->
<!--                        </el-popover>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更新时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <!-- 点击scope.row.enabled自动取反，无需操作 -->
                        <el-switch
                                :disabled="scope.row.userId == 1 || scope.row.userId == 2 || scope.row.userId == 3 ||scope.row.userId == 4"
                                @change="handleEditUserEnabled(scope.row)"
                                v-model="scope.row.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="200px">
                    <template slot="header" slot-scope="scope">
                        <el-input
                                v-model="searchNickName"
                                size="mini"
                                placeholder="输入昵称搜索用户"/>
                    </template>
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="small">编辑</el-button>
                        <el-popover
                                style="margin-left: 10px;margin-right: 10px;"
                                @show="showPopover(scope.row)"
                                @hide="hidePopover(scope.row)"
                                placement="bottom"
                                title="用户角色"
                                width="200"
                                trigger="click">
                            <div>
                                <el-select multiple :multiple-limit="3" v-model="roleIds" placeholder="请选择">
                                    <el-option
                                            v-for="(role,index) in roleAll"
                                            :key="index"
                                            :label="role.roleName"
                                            :value="role.roleId">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-button :disabled="roleAllVisible" slot="reference" type="text" icon="el-icon-view">角色管理
                            </el-button>
                        </el-popover>
                        <el-button type="text" icon="el-icon-delete" size="small" style="color: red;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="user-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next, sizes, total"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    :total="userList.length">
            </el-pagination>
        </div>
        <!--用户添加-->
        <div>
            <el-dialog
                    title="用户添加"
                    :visible.sync="addDialogVisible"
                    width="30%">
                <el-form :model="userAddForm" :rules="rules" ref="userAddForm" label-width="100px">
                    <el-form-item label="用户名称" prop="userName">
                        <el-input v-model="userAddForm.userName" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickName">
                        <el-input v-model="userAddForm.nickName" placeholder="请输入用户昵称"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" show-password v-model="userAddForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userAddForm.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="userAddForm.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleAdd">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysUser",
        data() {
            return {
                loading: false,
                userList: [],
                roleAll: [],
                roleIds: [],
                searchNickName: '',
                roleAllVisible: false,
                addDialogVisible: false,
                userAddForm: {
                    userName: '',
                    nickName: '',
                    password: '',
                    email: '',
                    phone: ''
                },
                rules: {
                    userName: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
                    nickName: [{required: true, message: '请输入用户昵称', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', required: true, message: '邮箱格式错误', trigger: 'blur'}
                    ],
                    phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}],
                },
                pageIndex: 1,
                pageSize: 5
            };
        },
        mounted() {
            this.initUserList();
            this.initRoleAll();
        },
        computed: {
            userListPage() {
                let offset = (this.pageIndex - 1) * this.pageSize;
                return this.userList.filter(data => !this.searchNickName || data.nickName.toLowerCase().includes(this.searchNickName.toLowerCase())).slice(offset, offset + this.pageSize);
            }
        },
        methods: {
            initUserList() {
                this.loading = true;
                axios.get('/sys/user/').then(res => {
                    this.loading = false;
                    if (res) {
                        this.userList = res;
                    }
                });
            },
            initRoleAll() {
                axios.get('/sys/role/').then(res => {
                    if (res) {
                        this.roleAll = res;
                    }
                });
            },
            showPopover(user) {
                this.roleAllVisible = true;
                this.roleIds = []; //事先清空
                let roles = user.roles;
                roles.forEach(role => {
                    this.roleIds.push(role.roleId);
                });
            },
            hidePopover(user) {
                this.roleAllVisible = false;
                /**
                 * 判断roleIds不变化就不更新
                 * length改变，更新
                 * length数组元素内容变化，更新
                 * length不变且数组元素内容变化，更新
                 */
                let flag = false;
                let roles = [];
                Object.assign(roles, user.roles);
                if (roles.length != this.roleIds.length) {
                    flag = true;
                } else {
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.roleIds.length; j++) {
                            let sr = this.roleIds[j];
                            if (role.roleId == sr) {
                                roles.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    if (roles.length != 0) {
                        flag = true;
                    }
                }
                if (flag) {
                    let url = '/sys/user/user_role?userId=' + user.userId;
                    this.roleIds.forEach(roleId => {
                        url += '&roleIds=' + roleId;
                    });
                    axios.put(url).then(res => {
                        if (res) {
                            this.initUserList();
                        }
                    });
                }
            },
            handleEditUserEnabled(user) {
                axios.put('/sys/user/enabled', user).then(res => {
                    if (res) {
                        this.initUserList();
                    }
                });
            },
            showAddDialog() {
                this.addDialogVisible = true;
            },
            handleCancel() {
                this.userAddForm = {
                    userName: '',
                    nickName: '',
                    password: '',
                    email: '',
                    phone: ''
                }
                this.addDialogVisible = false;
            },
            handleAdd() {
                this.$refs.userAddForm.validate((valid) => {
                    if (valid) {
                        axios.post('/sys/user/', this.userAddForm).then(res => {
                            if (res) {
                                this.initUserList();
                            }
                        });
                        this.addDialogVisible = false;
                        this.userAddForm = {
                            userName: '',
                            nickName: '',
                            password: '',
                            email: '',
                            phone: ''
                        }
                    } else {
                        this.$message.warning("表单不能为空！");
                        return false;
                    }
                });
            },
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            }
        },

    }
</script>

<style>
    .user-pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
</style>
