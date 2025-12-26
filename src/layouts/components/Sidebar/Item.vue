<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router';
import Link from "./Link.vue"
import { isExternal } from "@@/utils/validate"
import path from "path-browserify"

//该组件需要的数据
interface Props {
    item: RouteRecordRaw //这一级的路由
    basePath?: string //父级路径
}

// 接收父组件传来的数据
const { item, basePath = "" } = defineProps<Props>()

const alwaysShowRootMenu = computed(() => item.meta?.alwaysShow)
const showingChildren = computed(() => item.children?.filter(child => !child.meta?.hidden) ?? [])
const showingChildNumber = computed(() => showingChildren.value.length)
const theOnlyOneChild = computed(() => {
    const number = showingChildNumber.value
    switch (true) {
        case number > 1: //子菜单数量大于1 返回null
            return null
        case number == 1: //子菜单数量=1，返回当前子菜单
            return showingChildren.value[0]
        default: //子菜单数量=0，返回当前路由
            return { ...item, path: "" }
    }
})
// 解析路径
function resolvePath(routePath: string) {
    switch (true) {
        case isExternal(routePath):
            return routePath
        case isExternal(basePath):
            return basePath
        default:
            return path.resolve(basePath, routePath)
    }

}
</script>
<template>
    <!-- 不显示根菜单 只有一个子菜单 这个子菜单没有children -->
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
        <!-- 没有meta的路由，不渲染菜单 -->
        <Link v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
            <!-- ：index 用来高亮当前菜单和匹配当前路由 -->
            <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
                <!-- 如果meta中定义了svg，就用，没定义的话使用element-plus中的 -->
                <SvgIcon v-if="theOnlyOneChild.meta.svgIcon" :name="theOnlyOneChild.meta.svgIcon" class="svg-icon" />
                <component v-else-if="theOnlyOneChild.meta.elIcon" :is="theOnlyOneChild.meta.elIcon" class="el-icon" />
                <!-- 配置了title就显示菜单文字 -->
                <template v-if="theOnlyOneChild.meta.title" #title>
                    <span class="title">{{ theOnlyOneChild.meta.title }}</span>
                </template>
            </el-menu-item>
        </Link>
    </template>
    <!-- 子菜单 teleported:把子菜单内容 挂到 body 下 -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
        <template #title>
            <SvgIcon v-if="item.meta?.svgIcon" :name="item.meta.svgIcon" class="svg-icon" />
            <component v-else-if="item.meta?.elIcon" :is="item.meta.elIcon" class="el-icon" />
            <span v-if="item.meta?.title" class="title">{{ item.meta.title }}</span>
        </template>
        <template v-if="item.children">
            <Item v-for="child in showingChildren" :key="child.path" :item="child" />
        </template>

    </el-sub-menu>

</template>
<style lang="scss" scoped>
@import "@@/assets/styles/mixins.scss";

.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.el-icon {
  width: 1em !important;
  margin-right: 12px !important;
  font-size: 18px;
}

.title {
  @extend %ellipsis;
}
</style>