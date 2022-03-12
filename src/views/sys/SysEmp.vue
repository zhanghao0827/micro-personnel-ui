<template>
    <div>
        <div style="margin-top: 15px;">
            <el-form :model="searchEmpForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="姓名" prop="empName">
                            <el-input @keydown.enter.native="initEmpList" v-model="searchEmpForm.empName"
                                      prefix-icon="el-icon-search" placeholder="请输入姓名关键词" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属部门" prop="deptId">
                            <!--                            <el-select v-model="searchEmpForm.deptId" clearable>-->
                            <!--                                <el-option-->
                            <!--                                        v-for="(item,index) in deptIdAndName"-->
                            <!--                                        :key="index"-->
                            <!--                                        :label="item.deptName"-->
                            <!--                                        :value="item.deptId">-->
                            <!--                                </el-option>-->
                            <!--                            </el-select>-->
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="hover"
                                    v-model="searchPopVisible">
                                <el-tree @node-click="handleSearchPop"
                                         :data="deptAll"
                                         :props="defaultProps"
                                         :default-expand-all="true"></el-tree>
                                <el-input slot="reference" @focus="showSearchPop"
                                          v-model="searchEmpForm.dept.deptName" clearable></el-input>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="searchEmpForm.gender" clearable>
                                <el-option label="男" value="男"></el-option>
                                <el-option label="女" value="女"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="initEmpList" type="primary" icon="el-icon-search" plain
                                   style="margin-left: 20px;">搜索
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="margin-top: 10px;">

            <el-row>
                <el-col :span="3">
                    <el-button @click="showAddDialog" type="primary" icon="el-icon-plus" plain>添加员工</el-button>
                </el-col>
                <el-col :span="3">
                    <el-button @click="exportEmpListToExcel" type="success" icon="el-icon-download" plain>导出Excel</el-button>
                </el-col>
                <el-col :span="3">
                    <el-upload
                            action="/sys/emp/import"
                            :show-file-list="false"
                            :on-success="uploadSuccess"
                            :on-error="uploadError">
                        <el-button icon="el-icon-upload2" size="small" type="success" plain>导入Excel</el-button>
                    </el-upload>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top: 15px;">
            <el-table
                    v-loading="loading"
                    :data="empListPage"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="empId"
                        label="编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="empName"
                        label="员工姓名"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="dept.deptName"
                        label="所属部门"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        label="出生日期"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="nativePlace"
                        label="籍贯"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="nation"
                        label="民族"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        label="身份证号码"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号码"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="degree"
                        label="学位"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="position"
                        label="职位"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="workTime"
                        label="任职时间"
                        width="150">
                </el-table-column>
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
                        fixed="right"
                        label="操作"
                        width="130">
                    <template slot-scope="scope">
                        <el-button @click="showEditDialog(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"
                                   style="color: red;">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="emp-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next, sizes, total"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    :total="empList.length">
            </el-pagination>
        </div>

        <!--员工添加-->
        <div>
            <el-dialog
                    title="员工添加"
                    :visible.sync="addDialogVisible"
                    width="70%">
                <div>
                    <el-form ref="empAddForm" :model="empAddForm" :rules="rules" label-width="100px"
                             class="demo-ruleForm">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="姓名" prop="empName">
                                    <el-input v-model="empAddForm.empName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所属部门" prop="deptId">
                                    <el-select v-model="empAddForm.deptId">
                                        <el-option
                                                v-for="(item,index) in deptIdAndName"
                                                :key="index"
                                                :label="item.deptName"
                                                :value="item.deptId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="性别" prop="gender">
                                    <el-select v-model="empAddForm.gender">
                                        <el-option label="男" value="男"></el-option>
                                        <el-option label="女" value="女"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="出生日期" prop="birthday">
                                    <el-date-picker
                                            style="width: 185px;"
                                            v-model="empAddForm.birthday"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="籍贯" prop="nativePlace">
                                    <el-input v-model="empAddForm.nativePlace"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="民族" prop="nation">
                                    <el-input v-model="empAddForm.nation"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="身份证号码" prop="idCard">
                                    <el-input v-model="empAddForm.idCard"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机号码" prop="phone">
                                    <el-input v-model="empAddForm.phone"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="邮箱" prop="email">
                                    <el-input v-model="empAddForm.email"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="学位" prop="degree">
                                    <el-select v-model="empAddForm.degree">
                                        <el-option label="专科" value="专科"></el-option>
                                        <el-option label="本科" value="本科"></el-option>
                                        <el-option label="硕士" value="硕士"></el-option>
                                        <el-option label="博士" value="博士"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="职位" prop="position">
                                    <el-input v-model="empAddForm.position"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="任职时间" prop="workTime">
                                    <el-date-picker
                                            style="width: 185px;"
                                            v-model="empAddForm.workTime"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAdd">确 定</el-button>
                </span>
            </el-dialog>
        </div>

        <!--员工编辑-->
        <div>
            <el-dialog
                    title="员工添加"
                    :visible.sync="editDialogVisible"
                    width="70%">
                <div>
                    <el-form ref="empAddForm" :model="empEditForm" :rules="rules" label-width="100px"
                             class="demo-ruleForm">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="姓名" prop="empName">
                                    <el-input v-model="empEditForm.empName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所属部门" prop="deptId">
                                    <el-select v-model="empEditForm.deptId">
                                        <el-option
                                                v-for="(item,index) in deptIdAndName"
                                                :key="index"
                                                :label="item.deptName"
                                                :value="item.deptId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="性别" prop="gender">
                                    <el-select v-model="empEditForm.gender">
                                        <el-option label="男" value="男"></el-option>
                                        <el-option label="女" value="女"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="出生日期" prop="birthday">
                                    <el-date-picker
                                            style="width: 185px;"
                                            v-model="empEditForm.birthday"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="籍贯" prop="nativePlace">
                                    <el-input v-model="empEditForm.nativePlace"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="民族" prop="nation">
                                    <el-input v-model="empEditForm.nation"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="身份证号码" prop="idCard">
                                    <el-input v-model="empEditForm.idCard"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机号码" prop="phone">
                                    <el-input v-model="empEditForm.phone"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="邮箱" prop="email">
                                    <el-input v-model="empEditForm.email"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="学位" prop="degree">
                                    <el-select v-model="empEditForm.degree">
                                        <el-option label="专科" value="专科"></el-option>
                                        <el-option label="本科" value="本科"></el-option>
                                        <el-option label="硕士" value="硕士"></el-option>
                                        <el-option label="博士" value="博士"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="职位" prop="position">
                                    <el-input v-model="empEditForm.position"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="任职时间" prop="workTime">
                                    <el-date-picker
                                            style="width: 185px;"
                                            v-model="empEditForm.workTime"
                                            type="date"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button @click="handleEdit" type="primary">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysEmp",
        data() {
            return {
                loading: false,
                empList: [],
                deptIdAndName: [],
                deptAll: [],
                empAddForm: {
                    empName: '',
                    deptId: null,
                    gender: '',
                    birthday: null,
                    nativePlace: '',
                    nation: '',
                    idCard: '',
                    phone: '',
                    email: '',
                    degree: '',
                    position: '',
                    workTime: null
                },
                empEditForm: {
                    empName: '',
                    deptId: null,
                    gender: '',
                    birthday: null,
                    nativePlace: '',
                    nation: '',
                    idCard: '',
                    phone: '',
                    email: '',
                    degree: '',
                    position: '',
                    workTime: null
                },
                searchEmpForm: {
                    empName: '',
                    deptId: null,
                    dept: {
                        deptName: ''
                    },
                    gender: ''
                },
                rules: {
                    empName: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
                    deptId: [{required: true, message: '请选择所属部门', trigger: 'blur'}],
                    gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
                    birthday: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
                    nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                    nation: [{required: true, message: '请输入民族', trigger: 'blur'}],
                    idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}],
                    phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}],
                    email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
                    degree: [{required: true, message: '请选择学位', trigger: 'blur'}],
                    position: [{required: true, message: '请输入职位', trigger: 'blur'}],
                    workTime: [{required: true, message: '请选择入职时间', trigger: 'blur'}]
                },
                defaultProps: {
                    children: 'children',
                    label: 'deptName'
                },
                addDialogVisible: false,
                editDialogVisible: false,
                searchPopVisible: false,
                addPopVisible: false,
                inputDeptName: '',
                pageIndex: 1,
                pageSize: 5
            };
        },
        mounted() {
            this.initEmpList();
            this.initDeptIdAndName();
            this.initDeptAll();
        },
        computed: {
            empListPage() {
                let offset = (this.pageIndex - 1) * this.pageSize;
                return this.empList.slice(offset, offset + this.pageSize);
            }
        },
        methods: {
            initEmpList() {
                this.loading = true;
                axios.post('/sys/emp/list', this.searchEmpForm).then(res => {
                    this.loading = false;
                    if (res) {
                        this.empList = res;
                    }
                });
            },
            initDeptIdAndName() {
                axios.get('/sys/dept/idAndName').then(res => {
                    if (res) {
                        this.deptIdAndName = res;
                    }
                });
            },
            initDeptAll() {
                axios.get('/sys/dept/').then(res => {
                    if (res) {
                        this.deptAll = res;
                    }
                });
            },
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            exportEmpListToExcel() {
                window.open('/sys/emp/export', '_parent');
            },
            handleDelete(emp) {
                this.$confirm('此操作将删除' + emp.empName + ', 是否继续?', '提示').then(() => {
                    axios.delete('/sys/emp/' + emp.empId).then(res => {
                        if (res) {
                            this.initEmpList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showAddDialog() {
                this.addDialogVisible = true;
            },
            handleAdd() {
                this.$refs.empAddForm.validate((valid) => {
                    if (valid) {
                        axios.post('/sys/emp/', this.empAddForm).then(res => {
                            if (res) {
                                this.initEmpList();
                                this.addDialogVisible = false;
                                this.empAddForm = {
                                    empName: '',
                                    deptId: null,
                                    gender: '',
                                    birthday: null,
                                    nativePlace: '',
                                    nation: '',
                                    idCard: '',
                                    phone: '',
                                    email: '',
                                    degree: '',
                                    position: '',
                                    workTime: null
                                };
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            showEditDialog(emp) {
                Object.assign(this.empEditForm, emp);
                this.editDialogVisible = true;
            },
            handleEdit() {
                axios.put('/sys/emp/', this.empEditForm).then(res => {
                    if (res) {
                        this.initEmpList();
                        this.editDialogVisible = false;
                        this.empEditForm = {
                            empName: '',
                            deptId: null,
                            gender: '',
                            birthday: null,
                            nativePlace: '',
                            nation: '',
                            idCard: '',
                            phone: '',
                            email: '',
                            degree: '',
                            position: '',
                            workTime: null
                        };
                    }
                });
            },
            showSearchPop() {
                this.searchPopVisible = !this.searchPopVisible;
            },
            handleSearchPop(data) {
                this.searchEmpForm.dept.deptName = data.deptName;
                this.searchPopVisible = !this.searchPopVisible;
            },
            uploadSuccess() {
                this.$message.success("Excel导入成功!");
                this.initEmpList();
            },
            uploadError() {
                this.$message.success("Excel导入失败!");
            }
        }
    }
</script>

<style>
    .emp-pagination {
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
    }

    .dept-tree-view {
        width: 185px;
        height: 32px;
        display: inline-flex;
        font-size: 13px;
        border: 1px solid #dedede;
        border-radius: 5px;
        cursor: pointer;
        align-items: center;
        padding-left: 20px;
        box-sizing: border-box;
        margin-left: 3px;
    }
</style>
