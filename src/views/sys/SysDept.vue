<template>
    <div>
        <div style="margin-top: 20px;">
            <el-table
                    v-loading="loading"
                    ref="deptTable"
                    :data="deptAll"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="deptId"
                    default-expand-all
                    :tree-props="{children: 'children'}">
                <el-table-column
                        prop="deptName"
                        label="部门名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="修改时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="180">
                    <template slot-scope="scope">
                        <el-button @click="showAddDialog(scope.row)" type="text" icon="el-icon-plus" size="small">添加
                        </el-button>
                        <el-button @click="showEditDialog(scope.row)" type="text" icon="el-icon-edit" size="small">编辑
                        </el-button>
                        <el-button @click="handleDelete(scope.row)" type="text" icon="el-icon-delete" size="small"
                                   style="color: red;">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--添加部门-->
        <div>
            <el-dialog
                    title="添加部门"
                    :visible.sync="addDialogVisible"
                    width="30%">
                <el-form :model="deptAddForm" label-width="80px">
                    <el-form-item label="上级部门">
                        <el-tag>{{parentDeptName}}</el-tag>
                    </el-form-item>
                    <el-form-item label="部门名称">
                        <el-input @keydown.enter.native="handleAdd" v-model="deptAddForm.deptName"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
              </span>
            </el-dialog>
        </div>

        <!--编辑部门-->
        <el-dialog
                title="编辑部门"
                :visible.sync="editDialogVisible"
                width="30%">
            <el-form :model="deptEditForm" label-width="80px">
                <el-form-item label="部门名称">
                    <el-input v-model="deptEditForm.deptName"></el-input>
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
        name: "SysDept",
        data() {
            return {
                loading: false,
                deptAll: [],
                deptAddForm: {
                    deptId: null,
                    ancestors: '',
                    deptName: ''
                },
                deptEditForm: {
                    /**
                     * deptEditForm不能为空对象
                     * 虽然经过Object.assign(this.deptEditForm, dept) 拷贝
                     * 可以回显数据，但是deptEditForm为空对象，不能回显数据基础上进行修改              *
                     */
                    deptName: ''
                },
                addDialogVisible: false,
                editDialogVisible: false,
                parentDeptName: ''
            };
        },
        mounted() {
            this.initDeptAll();
        },
        methods: {
            initDeptAll() {
                this.loading = true;
                axios.get('/sys/dept/').then(res => {
                    this.loading = false;
                    if (res) {
                        this.deptAll = res;
                    }
                });
            },
            showAddDialog(dept) {
                this.addDialogVisible = true;
                /**
                 * deptAddForm用来保留上级部门的deptId，parentId，ancestors，传入服务端
                 * 添加子部门时：
                 *      子部门的parentId：上级部门的deptId
                 *      子部门的ancestors：上级部门的ancestors+','+上级部门的deptId
                 *      子部门的deptName通过表单绑定
                 */
                this.deptAddForm.deptId = dept.deptId;
                this.deptAddForm.ancestors = dept.ancestors;
                this.parentDeptName = dept.deptName;
            },
            handleAdd() {
                axios.post('/sys/dept/', this.deptAddForm).then(res => {
                    if (res) {
                        this.initDeptAll();
                        this.addDialogVisible = false;
                        this.deptAddForm = {
                            deptId: null,
                            ancestors: '',
                            deptName: ''
                        }
                    }
                });
            },
            handleDelete(dept) {
                if (dept.children.length > 0) {
                    this.$message.warning("存在子部门，无法删除！");
                } else {
                    this.$confirm('此操作将删除' + dept.deptName + ', 是否继续?', '提示',).then(() => {
                        axios.delete('/sys/dept/' + dept.deptId).then(res => {
                            if (res) {
                                this.initDeptAll();
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            showEditDialog(dept) {
                //拷贝deptEditForm，包括deptId
                Object.assign(this.deptEditForm, dept);
                this.editDialogVisible = true;
            },
            handleEdit() {
                axios.put('/sys/dept/', this.deptEditForm).then(res => {
                    if (res) {
                        this.initDeptAll();
                        this.editDialogVisible = false;
                        this.deptEditForm = {
                            deptName: ''
                        };
                    }
                });
            }
        }
    }
</script>

<style>

</style>
