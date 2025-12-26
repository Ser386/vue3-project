import type { RouteRecordRaw } from "vue-router"
import { createRouter,createWebHistory } from "vue-router"
import { routerConfig } from "@/router/config"
// import {routerConfig} from "@/router/config"
import { registerNavigationGuard } from "@/router/guard"
import { flatMultiLevelRoutes } from "./helper"
import { ElIcon } from "element-plus"


const Layouts =()=>import("@/layouts/index.vue")

// 常驻路由
export const constantRoutes:RouteRecordRaw[]=[
    {
        path:"/redirect",
        component:Layouts,
        meta:{
            hidden:true
        },
        children:[
            {
                path:":path(.*)",
                component:()=>import ("@/pages/redirect/index.vue")
            }
        ]
    },
    {
        path:"/demo",
        component:Layouts,
        redirect:"/demo/unocss",
        name:"Demo",
        meta:{
            title:"示例合集",
            ElIcon:"DataBoard"
        },
        children:[
            {
                path:"unocss",
                component:()=>import("@/pages/demo/unocss/index.vue"),
                name:"UnoCSS",
                meta:{
                    title:"UnoCSS",
                    elIcon:"Discount"
                }
            },
            {
                path:"element-plus",
                component:()=>import("@/pages/demo/element-plus/index.vue"),
                name:"ElementPlus",
                meta:{
                    title:"Element Plus",
                    keepAlive:true
                }

            }
        ]

    },
    {
        path:"/login",
        component:()=>import("@/pages/login/index.vue"),
        meta:{
            title:"登录页",
            hidden:true
        }
    },{
        path:"/",
        component:Layouts,
        redirect:"/dashboard",
        children:[{
            path:"dashboard",
            component:()=>import("@/pages/dashboard/index.vue"),
            name:"Dashboard",
            meta:{
                title:"首页",
                svgIcon:"dashboard",
                // 表示固定页面
                addix:true
            }
        }
        ]
    }
]
// 动态路由
export const dynamicRoutes: RouteRecordRaw[]=[
  
]
/** 路由实例 */
export const router = createRouter({
  history: routerConfig.history,
  routes: routerConfig.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})
// 重置路由 清理项目中动态添加的权限路由，避免退出后仍能访问权限页面
export function resetRouter(){
    try{
        router.getRoutes().forEach((route)=>{
            const {name,meta} =route
            if(name && meta.roles?.length){
                router.hasRoute(name) && router.removeRoute(name)
            }
        })
    }catch{
        // 强制刷新浏览器
        location.reload()
    }
}

// 注册路由守卫
registerNavigationGuard(router)