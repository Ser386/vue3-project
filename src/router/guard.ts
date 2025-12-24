// 全局路由守卫配置
import type { Router, RouteRecordRaw } from "vue-router" //导入vue router的类型，为了 TypeScript 的类型校验和代码提示
import NProgress from "nprogress" //顶部加载进度条
import { useTitle } from "@@/composables/useTitle" //自定义hook，用于设置页面标题
import { useUserStore } from "@/pinia/stores/user";
import { setRouteChange } from "@@/composables/useRouteListener"
import { getToken } from "@@/utils/cache/cookies"
import { usePermissionStore } from "@/pinia/stores/permission"
import { isWhiteList } from "@/router/whitelist"
import { routerConfig } from "./config";
NProgress.configure({ showSpinner: false }); //配置进度条，不显示加载图标
const{setTitle}=useTitle() //自定义hook，用于设置页面标题
const LOGIN_PATH = "/login"; //登录页路径常量
export function registerNavigationGuard(router: Router) {
    // 前置守卫：在路由跳转之前执行
    router.beforeEach(async(to,_from)=>{
        NProgress.start(); //开始加载进度条
        const userStore = useUserStore(); //获取用户状态管理实例
        const permissionStore = usePermissionStore(); //获取权限状态管理实例
        // 如果没有登录
        if(!getToken()){
            //如果在免登录的白名单中，则直接进入
            if(isWhiteList(to)) return true
            // 其他没有访问权限的页面将被重定位到登录页面
            return `${LOGIN_PATH}?redirect=${encodeURIComponent(to.fullPath)}`;
        }
        // 如果已经登录,并准备进入login页面，则重定向到主页
        if(to.path === LOGIN_PATH) return "/"
        // 如果用户已经获取权限角色
        if(userStore.roles.length !==0) return true;
        // 没有获取权限角色，则重新获取
        try{
            await userStore.getInfo()
            // 角色是一个数组
            const roles = userStore.roles
            // 生成可访问的Routes
            routerConfig.dynamic ? permissionStore.setRoutes(roles):permissionStore.setAllRoutes()
            // 将有访问权限的动态路由添加到Router中
            permissionStore.addRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route))
            // 设置replace:true 导航不会留下历史记录
            return {...to,replace:true}

        }catch(error){
            // 过程中发生任何错误，都直接重置token,并重定向到登录页面
            userStore.resetToken()
            ElMessage.error((error as Error).message || "路由守卫发生错误")
            return LOGIN_PATH
        }


    }
    )
// 全局后置钩子
router.afterEach((to)=>{
    // 更新全局路由状态
    setRouteChange(to);
    setTitle(to.meta.title);
    NProgress.done()
})
}
