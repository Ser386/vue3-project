<script lang="ts" setup>
import SwitchRoles from "./components/SwitchRoles.vue"
import { checkPermission } from "@@/utils/permission"
</script>
<template>
    <div class="app-container">
        <!-- 切换角色的组件 -->
        <SwitchRoles/>
        <el-card header="权限指令 v-permission的示例" shadow="never" class="margin-top-20">
            <el-button v-permission="['admin']">
                admin角色才能看到的按钮
            </el-button>
            <el-button v-permission="['editor']">
                editor角色才能看到的按钮
            </el-button>
            <el-button v-permission="['admin','editor']">
                admin和editor角色都能看到的按钮
            </el-button>
        </el-card>
        <el-card header="权限函数的示例" shadow="never" class="margin-top-20">
            <el-tabs type="border-card" class="margin-top-20">
                <el-tab-pane v-if="checkPermission(['admin'])" label="admin">
                    <el-tag size="large">
                        admin角色才能看到的标签
                    </el-tag>
                </el-tab-pane>
                <el-tab-pane v-if="checkPermission(['editor'])" label="editor">
                    <el-tag size="large">
                        editor角色才能看到的标签
                    </el-tag>
                </el-tab-pane>
                <el-tab-pane v-if="checkPermission(['admin','editor'])" label="admin和editor">
                    <el-tag size="large">
                        admin和editor角色都能看到的标签
                    </el-tag>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>