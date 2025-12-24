// 用于约束history配置的类型
import type { RouterHistory } from "vue-router";
// hash模式路由 url带# history模式路由 无#
import { createWebHistory, createWebHashHistory } from "vue-router";

// 路由配置
interface RouterConfig {
    // 路由历史模式，可以是 hash 模式或 history 模式
    history: RouterHistory;
    // 是否启用三级路由缓存（即多级嵌套路由的组件缓存）
    thirdLevelRouteCache: boolean;
    // 是否开启动态路由
    dynamic:boolean
    // 默认角色
    defaultRoles:Array<string>
}

const VITE_ROUTER_HISTORY = import.meta.env.VITE_ROUTER_HISTORY;
const VITE_PUBLIC_PATH= import.meta.env.VITE_PUBLIC_PATH;

export const routerConfig:RouterConfig={
    history: VITE_ROUTER_HISTORY ==="hash" ? createWebHashHistory(VITE_PUBLIC_PATH) : createWebHistory(VITE_PUBLIC_PATH),
    thirdLevelRouteCache:true,
    dynamic:true,
    defaultRoles:["DEFAULT_ROLE"]
}