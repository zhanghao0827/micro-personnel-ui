<template>
    <div>
        <div style="margin-top: 20px;">
            <el-form :model="searchForm" :inline="true">
                <el-form-item label="标题">
                    <el-input @keydown.enter.native="initNoticeList" v-model="searchForm.noticeTitle"
                              prefix-icon="el-icon-search" placeholder="请输入通知公告标题关键词" clearable></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="searchForm.noticeType" clearable>
                        <el-option label="通知" value="通知"></el-option>
                        <el-option label="公告" value="公告"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click="initNoticeList">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-top: 10px;">
            <el-button @click="showAddDialog" type="primary" icon="el-icon-plus">添加</el-button>
        </div>
        <div style="margin-top: 10px;">
            <el-table
                    v-loading="loading"
                    :data="noticeListPage"
                    stripe
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="noticeId"
                        label="序号"
                        width="80">
                </el-table-column>
                <el-table-column
                        :show-overflow-tooltip="true"
                        prop="noticeTitle"
                        label="标题"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="noticeType"
                        label="类型"
                        width="90">
                </el-table-column>
                <el-table-column
                        :show-overflow-tooltip="true"
                        prop="noticeContent"
                        label="内容"
                        width="250">
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
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showDeleteDialog(scope.row)" type="text" icon="el-icon-edit">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" type="text" icon="el-icon-delete"
                                   style="color: red;">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="notice-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next, sizes, total"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    :total="noticeList.length">
            </el-pagination>
        </div>

        <!--添加-->
        <div>
            <el-dialog
                    title="添加"
                    :visible.sync="addDialogVisible"
                    width="30%">
                <el-form :model="notionAddForm" :rules="rules" ref="notionAddForm" label-width="100px">
                    <el-form-item label="标题" prop="noticeTitle">
                        <el-input v-model="notionAddForm.noticeTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="noticeType">
                        <el-select v-model="notionAddForm.noticeType">
                            <el-option label="通知" value="通知"></el-option>
                            <el-option label="公告" value="公告"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容" prop="noticeContent">
                        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}"
                                  v-model="notionAddForm.noticeContent"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
              </span>
            </el-dialog>
        </div>

        <!--编辑-->
        <div>
            <el-dialog
                    title="通知公告删除"
                    :visible.sync="editDialogVisible"
                    width="30%">
                <el-form :model="noticeEditForm" :rules="rules" ref="noticeEditForm" label-width="100px">
                    <el-form-item label="标题" prop="noticeTitle">
                        <el-input v-model="noticeEditForm.noticeTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="noticeType">
                        <el-select v-model="noticeEditForm.noticeType">
                            <el-option label="通知" value="通知"></el-option>
                            <el-option label="公告" value="公告"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容" prop="noticeContent">
                        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}"
                                  v-model="noticeEditForm.noticeContent"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdate">确 定</el-button>
              </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: "SerNotice",
        data() {
            return {
                loading: false,
                noticeList: [],
                notionAddForm: {
                    noticeTitle: '',
                    noticeType: '',
                    noticeContent: ''
                },
                noticeEditForm: {
                    noticeTitle: '',
                    noticeType: '',
                    noticeContent: ''
                },
                addDialogVisible: false,
                editDialogVisible: false,
                rules: {
                    noticeTitle: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
                    noticeType: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
                    noticeContent: [{required: true, message: '请输入活动名称', trigger: 'blur'}]
                },
                pageIndex: 1,
                pageSize: 5,
                searchForm: {
                    noticeTitle: '',
                    noticeType: ''
                }
            };
        },
        mounted() {
            this.initNoticeList();
        },
        computed: {
            noticeListPage() {
                let offset = (this.pageIndex - 1) * this.pageSize;
                return this.noticeList.slice(offset, offset + this.pageSize);
            }
        },
        methods: {
            initNoticeList() {
                this.loading = true;
                axios.post('/ser/notice/list', this.searchForm).then(res => {
                    this.loading = false;
                    if (res) {
                        this.noticeList = res;
                    }
                });
            },
            showAddDialog() {
                this.addDialogVisible = true;
            },
            handleAdd() {
                axios.post('/ser/notice/', this.notionAddForm).then(res => {
                    if (res) {
                        this.initNoticeList();
                        this.addDialogVisible = false;
                        this.notionAddForm = {
                            noticeTitle: '',
                            noticeType: '',
                            noticeContent: ''
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
            handleDelete(notice) {
                this.$confirm('此操作将永久删除' + notice.noticeTitle + ', 是否继续?', '提示').then(() => {
                    axios.delete('/ser/notice/' + notice.noticeId).then(res => {
                        if (res) {
                            this.initNoticeList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showDeleteDialog(notice) {
                Object.assign(this.noticeEditForm, notice);
                this.editDialogVisible = true;
            },
            handleUpdate() {
                axios.put('/ser/notice/', this.noticeEditForm).then(res => {
                    if (res) {
                        this.initNoticeList();
                        this.noticeEditForm = {
                            noticeTitle: '',
                            noticeType: '',
                            noticeContent: ''
                        }
                        this.editDialogVisible = false;
                    }
                });
            }
        }
    }
</script>

<style>
    .notice-pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
</style>
