import type {Router,RouteRecord,RouteRecordNormalized, RouteRecordRaw} from "vue-router"
import { cloneDeep,omit } from "lodash-es"
import {createRouter} from "vue-router"
import{routerConfig} from "./config"

// 路由降级，把三级及其以上路由转化为二级路由
export function flatMultiLevelRoutes(routes:RouteRecordRaw[]){
    const routesMirror=cloneDeep(routes)
    routesMirror.forEach(route=>{
        // 如果路由是三级及其以上路由，进行降级处理
        isMultipleRoute(route) && promoteRouteLevel(route)
    })
    return routesMirror
}
function isMultipleRoute(route:RouteRecordRaw){
    // 判断路由层级是否大于2
    const children = route.children
    if(children?.length) return children?.some(child =>child.children?.length)
    return false
}
// 生成二级路由
function promoteRouteLevel(route:RouteRecordRaw){
    // 1.创建一个临时的路由实例，目的是让vue router自动解析所有深层路由
    let router:Router | null=createRouter({
        history:routerConfig.history, //复用之前定好的urL样式
        routes:[route] //只放当前要改造的路由
    })
    // 2.从临时实例中拿所有解析好的路由
    const routes = router.getRoutes()
    // 3.把深层路由添加到一级路由下面
    addToChildren(routes,route.children || [],route)
    // 4.用完临时实例，释放内容
    router = null

    // 转化为二级路由后，去除所有子路由中的children,omit是删除删除每个子路由的children属性
    route.children = route.children?.map(item =>omit(item,"children") as RouteRecordRaw)


}
// 将给定的子路由添加到指定的路由模块中 
// routes:所有路由集合 children:正在处理的路由的子路由数组 routeModule:所有的顶级路由
function addToChildren(routes:RouteRecordNormalized[],children:RouteRecordRaw[],routeModule:RouteRecordRaw){
    children.forEach((child)=>{
        // 1 从临时实例解析的路由中，找到和当前子路由名字匹配的路由
        const route = routes.find(item=>item.name === child.name)
        if(route){
            // 2 给一级路由初始化 “子路由列表”
            routeModule.children=routeModule.children ||[]
            // 3 把找到的路由添加到一级路由的子路由中
            if(!routeModule.children.includes(route)){
                routeModule.children.push(route)
            }
            // 4 如果当前子路由还有深层子路由，递归继续添加
            if(child.children?.length){
                addToChildren(routes,child.children,routeModule)
            }
        }
    })
}