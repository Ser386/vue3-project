<script lang="ts" setup>
import Modal from "./Model.vue"
// 默认为不打开
const visible = ref<boolean>(false)

function handleOpen() {
    visible.value = true

}
</script>
<template>
    <div>
        <el-tooltip effect="dark" content="搜索内容" placement="bottom">
            <SvgIcon name="search" @click="handleOpen" class="svg-icon" />
        </el-tooltip>
        <!-- 一个弹窗组件 通过visited 控制显示隐藏 -->
        <Model v-model="visible" />
    </div>
</template>