<template>
    <div>
        <div style="margin-top: 15px;">
            <el-button @click="exportLoginListToExcel" type="success" icon="el-icon-download">导出Excel</el-button>
        </div>
        <div style="margin-top: 15px;">
            <el-table
                    v-loading="loading"
                    :data="loginListPage"
                    stripe
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="loginId"
                        label="登录编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="ip"
                        label="登录IP">
                </el-table-column>
                <el-table-column
                        prop="location"
                        label="登录地点">
                </el-table-column>
                <el-table-column
                        prop="browser"
                        label="浏览器">
                </el-table-column>
                <el-table-column
                        prop="os"
                        label="操作系统">
                </el-table-column>
                <el-table-column
                        prop="loginTime"
                        label="登录时间">
                </el-table-column>
            </el-table>
            <el-pagination
                    class="pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next, sizes, total"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    :total="loginList.length">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        name: "LogLogin",
        data() {
            return {
                loading: false,
                loginList: [],
                pageIndex: 1,
                pageSize: 5
            };
        },
        mounted() {
            this.initLoginList();
        },
        computed: {
            loginListPage() {
                let offset = (this.pageIndex - 1) * this.pageSize;
                return this.loginList.slice(offset, offset + this.pageSize);
            }
        },
        methods: {
            initLoginList() {
                this.loading = true;
                axios.get('/log/login/').then(res => {
                    this.loading = false;
                    if (res) {
                        this.loginList = res;
                    }
                });
            },
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            exportLoginListToExcel() {
                window.open('/log/login/export', '_parent');
            }

        }
    }
</script>

<style>
    .pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
</style>
