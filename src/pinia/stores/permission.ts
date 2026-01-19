import type {RouteRecordRaw} from 'vue-router'
import { constantRoutes, dynamicRoutes } from "@/router"
import { routerConfig } from '@/router/config'
import { flatMultiLevelRoutes } from '@/router/helper'
import { pinia } from '..'
// route:当前路由,判断当前路由是否有权限 roles当前登录角色所具有的权限
function hasPermission(roles:string[],route:RouteRecordRaw){
    // 获取路由允许访问的角色列表
    const routeRoles = route.meta?.roles
    return routeRoles ? roles.some(role=>routeRoles.includes(role)):true
}
// 收集所有 有访问权限的路由，包括子路由
function filterDynamicRoutes(routes:RouteRecordRaw[],roles:string[]){
    const res:RouteRecordRaw[]=[]
    routes.forEach((route)=>{
        // 浅拷贝
        const tempRoute ={...route}
        if(hasPermission(roles,tempRoute)){ //如果当前路由有权限
            if(tempRoute.children){//如果当前路由有子路由
                tempRoute.children=filterDynamicRoutes(tempRoute.children,roles)
            }
            res.push(tempRoute)
        }
    })
    return res;
}
export const usePermissionStore=defineStore("permission",()=>{
    // 可访问路由
    const routes =ref<RouteRecordRaw[]>([])
    // 有访问权限的路由
    const addRoutes =ref<RouteRecordRaw[]>([])
    // 根据角色生成可访问的Routes (常驻路由+有访问权限的动态路由)
    const setRoutes =(roles:string[])=>{
        // 有权限的动态路由
        const accessedRoutes = filterDynamicRoutes(dynamicRoutes,roles)
        set(accessedRoutes)
    }
    // 所有路由：常驻路由+所有动态路由
    const setAllRoutes=()=>{
        set(dynamicRoutes)
    }

    // 统一设置
    const set =(accessedRoutes: RouteRecordRaw[])=>{
        routes.value=constantRoutes.concat(accessedRoutes)
        // 是否开启了三级路由，开启了的话，执行扁平化操作，没开启直接使用
        addRoutes.value = routerConfig.thirdLevelRouteCache?flatMultiLevelRoutes(accessedRoutes):accessedRoutes
    }
    return {routes,addRoutes,setRoutes,setAllRoutes}
})
export function usePermissionStoreOutside(){
    return usePermissionStore(pinia)
}
