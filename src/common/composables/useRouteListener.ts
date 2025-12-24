// 封装了一个基于发布-订阅模式的路由变化监听工具
import type {Handler} from 'mitt'
import type {RouteLocationNormalized, RouteLocationNormalizedGeneric} from 'vue-router'
import mitt from "mitt"

// 回调函数的类型
type Callback=(route:RouteLocationNormalizedGeneric)=>void

// 定义一个事件总线，是一个map,存储事件名和回调函数
const emitter=mitt()

const key=Symbol("ROUTE_CHANGE")

let latestRoute:RouteLocationNormalizedGeneric

// 设置最新的路由信息，触发路由变化事件
export function setRouteChange(to:RouteLocationNormalizedGeneric){
    // 触发事件---路由变了，所有订阅这个事件key的地方，立刻收到新的路由信息to
    emitter.emit(key,to)
    // 缓存最新的路由信息
    latestRoute=to
}
export function useRouteListener(){
    // 回调函数集合
    const CallbackList: Callback[]=[]
    // 监听路由变化
    const listenerRouteChange=(callback:Callback,immediate = false)=>{
        // 缓存回调函数
        CallbackList.push(callback)
        // 监听事件
        emitter.on(key,callback as Handler)
        // 可以选择立刻执行一次回调函数
        immediate && latestRoute && callback(latestRoute)
    }
    // 移除路由变化事件监听器
    const removeRouteListener=(callback:Callback)=>{
        emitter.off(key,callback as Handler)
    }
    // 组件销毁前移除监听器
    onBeforeUnmount(()=>{
        CallbackList.forEach(removeRouteListener)
    })
    return {listenerRouteChange,removeRouteListener}
}