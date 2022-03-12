<template>
    <div>
        <div style="margin-top: 20px;">
            <el-button @click="showAddDialog" type="primary" size="small" icon="el-icon-plus">添加角色</el-button>
        </div>
        <div>
            <el-table
                    v-loading="loading"
                    :data="roleAll"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="roleId"
                        label="角色编号"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="roleKey"
                        label="权限字符">
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showEditDialog(scope.row)" icon="el-icon-edit" type="text">修改</el-button>
                        <el-button @click="showEditMenuDialog(scope.row)" icon="el-icon-menu" type="text">菜单权限</el-button>
                        <el-button @click="handleDelete(scope.row)" icon="el-icon-delete" type="text" style="color: red;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--菜单权限-->
        <div>
            <el-dialog
                    title="菜单权限"
                    :visible.sync="editMenuDialogVisible"
                    width="30%">
                <el-tree
                        ref="tree"
                        :data="menuAll"
                        :key="roleId"
                        show-checkbox
                        node-key="menuId"
                        :default-checked-keys="menuIds"
                        :props="defaultProps"></el-tree>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editMenuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEditMenuIds">确 定</el-button>
              </span>
            </el-dialog>
        </div>
        <!--角色新增-->
        <div>
            <el-dialog
                    title="添加角色"
                    :visible.sync="addDialogVisible"
                    width="30%">
                <el-form ref="roleAddForm" :model="roleAddForm" :rules="rules" label-width="100px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="roleAddForm.roleName" placeholder="请输入角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="权限字符" prop="roleKey">
                        <el-input v-model="roleAddForm.roleKey" placeholder="请输入权限字符">
                            <template slot="prepend">ROLE_</template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAdd">确 定</el-button>
                  </span>
            </el-dialog>
        </div>
        <!--角色修改-->
        <el-dialog
                title="角色修改"
                :visible.sync="editDialogVisible"
                width="30%">
            <el-form ref="roleEditForm" :model="roleEditForm" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleEditForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="权限字符" prop="roleKey">
                    <el-input v-model="roleEditForm.roleKey" placeholder="请输入权限字符">
                        <template slot="prepend">ROLE_</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SysRole",
        data: function () {
            return {
                roleId: 0,
                roleAll: [],
                menuAll: [],
                menuIds: [],
                loading: false,
                editMenuDialogVisible: false,
                addDialogVisible: false,
                editDialogVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'menuName'
                },
                roleAddForm: {
                    roleName: '',
                    roleKey: ''
                },
                roleEditForm: {
                    roleName: '',
                    roleKey: ''
                },
                rules: {
                    roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                    roleKey: [{required: true, message: '请输入权限字符', trigger: 'blur'}],
                }
            };
        },
        mounted() {
            this.initRoleAll();
            this.initMenuAll();
        },
        methods: {
            initRoleAll() {
                this.loading = true;
                axios.get('/sys/role/').then(res => {
                    this.loading = false;
                    if (res) {
                        this.roleAll = res;
                    }
                });
            },
            initMenuAll() {
                axios.get('/sys/menu/').then(res => {
                    if (res) {
                        this.menuAll = res;
                    }
                });
            },
            initMenuIds(id) {
                axios.get('/sys/menu/' + id).then(res => {
                    if (res) {
                        /**
                         * :key="roleId"
                         * :key="roleId"
                         * 每次访问treekeyId要变化，增加树形组件的区分度，方便数据更新
                         */
                        this.roleId = id;
                        this.menuIds = res;
                    }
                });
            },
            showEditMenuDialog(role) {
                this.initMenuIds(role.roleId);
                this.editMenuDialogVisible = true;
            },
            handleEditMenuIds() {
                let tree = this.$refs.tree;
                let checkedKeys = tree.getCheckedKeys(true);
                if (checkedKeys.length == 0) {
                    this.$message.warning("角色菜单不能清空！");
                } else {
                    let url = '/sys/role/role_menu?roleId=' + this.roleId;
                    checkedKeys.forEach(key => {
                        url += '&menuIds=' + key;
                    });
                    axios.put(url).then();
                }
                this.editMenuDialogVisible = false;
            },
            handleDelete(role) {
                if (role.roleId == 1 || role.roleId == 2 || role.roleId == 3) {
                    this.$message.warning('系统角色不允许删除，请联系管理员！');
                } else {
                    this.$confirm('此操作将删除' + role.roleName + ', 是否继续?', '角色删除').then(() => {
                        axios.delete('/sys/role/' + role.roleId).then(res => {
                            if (res) {
                                this.initRoleAll();
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            },
            showAddDialog() {
                this.addDialogVisible = true;
            },
            handleAdd() {
                this.$refs.roleAddForm.validate((valid) => {
                    if (valid) {
                        axios.post('/sys/role/', this.roleAddForm).then(res => {
                            if (res) {
                                this.initRoleAll();
                                this.addDialogVisible = false;
                            }
                        });
                    } else {
                        this.$message.error('表单不能为空！');
                        return false;
                    }
                });
            },
            showEditDialog(role) {
                if (role.roleId == 1 || role.roleId == 2 || role.roleId == 3) {
                    this.$message.warning('系统角色不允许修改，请联系管理员！');
                } else {
                    Object.assign(this.roleEditForm, role);
                    this.editDialogVisible = true;
                }
            },
            handleEdit() {
                axios.put('/sys/role/', this.roleEditForm).then(res => {
                    if (res) {
                        this.initRoleAll();
                        this.editDialogVisible = false;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
