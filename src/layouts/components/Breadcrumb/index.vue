<script lang="ts" setup>
import type { RouteLocationMatched } from "vue-router"
import { compile } from "path-to-regexp"
import { useRouteListener } from "@@/composables/useRouteListener"
const route=useRoute()
const router=useRouter()
const {listenerRouteChange}=useRouteListener()

// 响应式数据，用于存储面包屑导航信息
const breadcrumbs = ref<RouteLocationMatched[]>([])

// 编译路径
function pathCompile(path:string){
    const toPath=compile(path)
    return toPath(route.params)
}
// 获取面包屑导航信息
function getBreadcrumb(){
    breadcrumbs.value=route.matched.filter(item=>item.meta?.title&& item.meta?.breadcrumb !== false)
}
// 面包屑导航点击事件
function handleLink(item: RouteLocationMatched){
    const {redirect,path}=item
    if(redirect) return router.push(redirect as string)
    router.push(pathCompile(path))
}
// 监听路由变化，更新面包屑导航信息,路由变化时自动调用
listenerRouteChange((route)=>{
    if(route.path.startsWith("/redirect/")) return
    getBreadcrumb()
})
</script>
<template>
    <el-breadcrumb>
        <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="item.path">
            <span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1"  class="no-redirect">
                {{ item.meta?.title }}
            </span>
            <a v-else  @click.prevent="handleLink(item)">
                {{ item.meta?.title }}
            </a>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<style lang="scss" scoped>
.el-breadcrumb {
  line-height: var(--v3-navigationbar-height);
  .no-redirect {
    color: var(--el-text-color-placeholder);
  }
  a {
    font-weight: normal;
  }
}
</style>