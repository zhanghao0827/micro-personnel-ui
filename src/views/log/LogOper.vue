<template>
    <div>
        <div style="margin-top: 15px;">
            <el-table
                    v-loading="loading"
                    :data="operListPage"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="operId"
                        label="编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="operModule"
                        label="操作模块"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="operContent"
                        label="操作内容"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="操作人员"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="operIp"
                        label="操作主机"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="operLocation"
                        label="操作地点"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="operStatus"
                        label="操作状态"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="operTime"
                        label="操作时间"
                        width="150">
                </el-table-column>
            </el-table>
            <el-pagination
                    class="oper-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    background
                    layout="prev, pager, next, sizes, total"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :current-page="pageIndex"
                    :total="operList.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LogOper",
        data() {
            return {
                loading: false,
                operList: [],
                pageIndex: 1,
                pageSize: 5
            };
        },
        mounted() {
            this.initOperList();
        },
        computed: {
            operListPage() {
                let offset = (this.pageIndex - 1) * this.pageSize;
                return this.operList.slice(offset, offset + this.pageSize);
            }
        },
        methods: {
            initOperList() {
                this.loading = true;
                axios.get('/log/oper/').then(res => {
                    this.loading = false;
                    if (res) {
                        this.operList = res;
                    }
                });
            },
            handleCurrentChange(pageIndex) {
                this.pageIndex = pageIndex;
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
        }
    }
</script>

<style>
    .oper-pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
</style>
