// 管理顶部标签页和页面缓存，将状态持久化到localStorage

//RouteLocationNormalizedGeneric是vue-router提供的标准化路由位置类型，包含路由的完整属性
import type { RouteLocationNormalizedGeneric } from "vue-router" //导入 vue-router 的通用路由类型
import {getCacheViews,getVisitedViews,setCachedViews,setVisitedViews} from "@@/utils/cache/local-storage"
import { useSettingsStore } from "./settings"

import { pinia } from "@/pinia" 

// 通过Partial工具类型和路由类型的结合，构建一个“路由对象的部分属性类型”
// partical<T> 将类型T的所有属性变为可选
// 设置tagView的类型
export type TagView = Partial<RouteLocationNormalizedGeneric>

// 定义pinia Store
export const useTagsViewStore=defineStore("tags-view",()=>{
    // 从store中解构出是否启用标签缓存
    const {cacheTagsView}=useSettingsStore()
    // 已访问标签页
    const visitedViews=ref<TagView[]>(cacheTagsView?getVisitedViews():[])
    // 需要被keep-alive缓存的标签页
    const cachedViews=ref<string[]>(cacheTagsView?getCacheViews():[])
    // 只要新增/删除 tab/缓存 就立刻写入localStorage
    watchEffect(()=>{
        setVisitedViews(visitedViews.value)
        setCachedViews(cachedViews.value)
    })
    // 添加已访问标签页
    const addVisitedView=(view:TagView)=>{
        // 按照path查重
        const index=visitedViews.value.findIndex(v=>v.path === view.path)
        // 已存在 更新fullPath ...view表示浅拷贝
        if(index !== -1){
            visitedViews.value[index].fullPath !== view.fullPath && (visitedViews.value[index] ={...view})
        }else{ //不存在--新增标签
            visitedViews.value.push({...view})
        }

    }
    // 添加缓存标签页
    const addCachedView=(view:TagView)=>{
        // 只缓存有name的组件
        if(typeof view.name!=="string") return
        // 已缓存的直接返回
        if(cachedViews.value.includes(view.name)) return
        // 只有meta.keepAlive才缓存
        if(view.meta?.keepAlive){
            cachedViews.value.push(view.name)
        }

    }
    // 删除单个标签
    const delVisitedView=(view:TagView)=>{
        // 根据path找到，使用splice删除
        const index=visitedViews.value.findIndex(v=>v.path===view.path)
        if(index !== -1){
            visitedViews.value.splice(index,1)
        }
    }
    // 删除单个缓存
    const delCachedView=(view:TagView)=>{
        if(typeof view.name !=="string") return
        const index=cachedViews.value.indexOf(view.name)
        if(index !== -1){
            cachedViews.value.splice(index,1)
        }

    }
    // 删除其他标签，保留当前+固定标签
    const delOtherVisitedViews=(view:TagView)=>{
        // filter会返回一个新数组，只保留满足条件的元素 affix表示固定标签 view表示当前标签
        visitedViews.value=visitedViews.value.filter(v=>v.meta?.affix || v.path===view.path)
    }
    // 删除其他缓存
    const delOtherCachedViews=(view:TagView)=>{
        if(typeof view.name !=="string") return
        const index=cachedViews.value.indexOf(view.name)
        if(index !== -1){
            cachedViews.value=cachedViews.value.slice(index,index+1)
        }else{
            cachedViews.value=[]
        }
    }
    // 删除所有标签
    const delAllVisitedViews=()=>{
        // 只保留固定标签
        visitedViews.value=visitedViews.value.filter(tag=>tag.meta?.affix)
    }
    // 删除所有缓存
    const delAllCacheViews=()=>{
        cachedViews.value=[]
    }
    return{
        visitedViews,
        cachedViews,
        addCachedView,
        addVisitedView,
        delAllCacheViews,
        delAllVisitedViews,
        delCachedView,
        delVisitedView,
        delOtherCachedViews,
        delOtherVisitedViews
    }

})
export function useTagsViewStoreside(){
    return useTagsViewStore(pinia)
}