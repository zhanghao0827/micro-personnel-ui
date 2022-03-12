<template>
    <div>
        <div style="margin-top: 20px;">
            <el-table
                    v-loading="loading"
                    :data="menuAll"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="menuId"
                    :tree-props="{children: 'children'}">
                <el-table-column
                        prop="menuId"
                        label="菜单编号"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="menuName"
                        label="菜单名称"
                        width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="url"
                        label="访问url"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="path"
                        label="访问path"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="component"
                        label="所属组件名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="icon"
                        label="图标"
                        width="120">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="enabled"
                        label="状态"
                        width="120">
                    <template slot-scope="scope">
                        <!-- 点击scope.row.enabled自动取反，无需操作 -->
                        <el-switch
                                :disabled="true"
                                v-model="scope.row.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        width="170">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.parentId==0" icon="el-icon-plus" type="text">添加子菜单</el-button>
                        <el-button icon="el-icon-edit" type="text">编辑</el-button>
                        <el-button v-if="scope.row.parentId!=0" icon="el-icon-delete" type="text" style="color: red;">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


    </div>
</template>

<script>
    export default {
        name: "SysMenu",
        data() {
            return {
                menuAll: [],
                loading: false
            };
        },
        mounted() {
            this.initMenuAll();
        },
        methods: {
            initMenuAll() {
                this.loading = true;
                axios.get('/sys/menu/').then(res => {
                    this.loading = false;
                    if (res) {
                        this.menuAll = res;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
