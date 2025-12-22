// 对于浏览器localStorage的封装工具，用于统一管理项目中各类全局状态的本地持久化
import type { TagView } from "@/pinia/stores/tags-view"
import { CacheKey } from "@@/constants/cache-key"
import type { LayoutsConfig } from "@/layouts/config"
import { SidebarClosed, SidebarOpened } from "@/common/constants/app-key";
// region系统布局配置（三种布局 左侧/顶部/混合）
export function getLayoutsConfig(){
    // 通过key获取value
    const json = localStorage.getItem(CacheKey.CONFIG_LAYOUT)
    return json?(JSON.parse(json) as LayoutsConfig):null;
}
export function setLayoutsConfig(settings:LayoutsConfig){
    // 将系统布局存入到localStorage中
    localStorage.setItem(CacheKey.CONFIG_LAYOUT,JSON.stringify(settings))
}
export function removeLayoutsConfig(){
    // 移除系统布局
    localStorage.removeItem(CacheKey.CONFIG_LAYOUT)
}
// 侧边栏状态
// 获取侧边栏状态
export function getSidebarStatus(){
    return localStorage.getItem(CacheKey.SIDEBAR_STATUS)
}
// 设置侧边栏状态
export function setSidebarStatus(sidebarStatus:SidebarOpened|SidebarClosed){
    localStorage.setItem(CacheKey.SIDEBAR_STATUS,sidebarStatus)
}