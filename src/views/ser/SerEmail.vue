<template>
    <div>
        <div style="margin-top: 20px;">
            <el-button @click="showSentDialogVisible" type="primary" icon="el-icon-message">发送邮件</el-button>
        </div>
        <div style="margin-top: 20px;">
            <el-table
                    v-loading="emailListLoading"
                    :data="emailListPage"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="emailId"
                        label="编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="addressee"
                        label="收件人"
                        width="180">
                </el-table-column>
                <el-table-column
                        :show-overflow-tooltip="true"
                        prop="emailSubject"
                        label="主题"
                        width="180">
                </el-table-column>
                <el-table-column
                        :show-overflow-tooltip="true"
                        prop="emailText"
                        label="正文">
                </el-table-column>
                <el-table-column
                        prop="sentDate"
                        label="发送时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"
                                   style="color: red;">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="email-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next, sizes, total"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    :total="emailList.length">
            </el-pagination>
        </div>
        <!--发送邮件-->
        <div>
            <el-dialog
                    v-loading="sentEmailLoading"
                    element-loading-text="正在发送......"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    title="发送邮件"
                    :visible.sync="sentDialogVisible"
                    width="30%">
                <!--只涉及添加，邮件发送不能修改-->
                <el-form :model="emailForm" :rules="rules" ref="emailForm" label-width="100px">
                    <el-form-item label="收件人" prop="addressee">
                        <el-input v-model="emailForm.addressee"></el-input>
                    </el-form-item>
                    <el-form-item label="邮件主题" prop="emailSubject">
                        <el-input v-model="emailForm.emailSubject"></el-input>
                    </el-form-item>
                    <el-form-item label="邮件正文" prop="emailText">
                        <el-input v-model="emailForm.emailText" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="sentDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSentEmail">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SerEmail",
        data() {
            return {
                emailListLoading: false,
                sentDialogVisible: false,
                sentEmailLoading: false,
                emailList: [],
                emailForm: {
                    addressee: '',
                    emailSubject: '',
                    emailText: ''
                },
                rules: {
                    addressee: [{required: true, message: '请输入收件人', trigger: 'blur'}],
                    emailSubject: [{required: true, message: '请输入邮件主题', trigger: 'blur'}],
                    emailText: [{required: true, message: '请输入邮件正文', trigger: 'blur'}]
                },
                pageIndex: 1,
                pageSize: 5
            };
        },
        mounted() {
            this.initEmailList();
        },
        computed: {
            emailListPage() {
                let offset = (this.pageIndex - 1) * this.pageSize;
                return this.emailList.slice(offset, offset + this.pageSize);
            }
        },
        methods: {
            initEmailList() {
                this.emailListLoading = true;
                axios.get('/ser/email/').then(res => {
                    this.emailListLoading = false;
                    if (res) {
                        this.emailList = res;
                    }
                });
            },
            showSentDialogVisible() {
                this.sentDialogVisible = true;
            },
            handleSentEmail() {
                this.sentEmailLoading = true;
                axios.post('/ser/email/', this.emailForm).then(res => {
                    this.sentEmailLoading = false;
                    if (res) {
                        this.sentDialogVisible = false;
                        this.initEmailList();
                        this.emailForm = {
                            addressee: '',
                            emailSubject: '',
                            emailText: ''
                        }
                    }
                });
            },
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            handleDelete(email) {
                this.$confirm('此操作将永久删除主题为：' + email.emailSubject + '的邮件,是否继续?', '提示').then(() => {
                    axios.delete('/ser/email/' + email.emailId).then(res => {
                        if (res) {
                            this.initEmailList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style>
    .email-pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
    }

</style>
