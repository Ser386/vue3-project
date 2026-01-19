<script lang="ts" setup>
import SwitchRoles from './components/SwitchRoles.vue';
</script>
<template>
<div class="app-container">
    <SwitchRoles />
    <el-card shadow="never" class="content">
        当前页面只有admin角色才能访问
    </el-card>
</div>
</template>
<style lang="scss" scoped>
    .content{
        margin-top:20px;
    }
</style>