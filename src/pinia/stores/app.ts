
import { DeviceEnum,SIDEBAR_CLOSED,SIDEBAR_OPENED } from "@@/constants/app-key";
import {getSidebarStatus,setSidebarStatus} from "@@/utils/cache/local-storage"
import { pinia } from "@/pinia";

// 定义侧边栏的状态
interface Sidebar{
    // 侧边栏是否打开
    opened:boolean
    // 是否禁用侧边栏的动画
    withoutAnimation:boolean
}
// 根据侧边栏是否打开来设置本地存储中的状态
function handleSidebarStatus(opened:boolean){
    opened?setSidebarStatus(SIDEBAR_OPENED):setSidebarStatus(SIDEBAR_CLOSED)
    
}
// 定义pinia的store来管理应用的状态
export const useAppStore=defineStore("app",()=>{
    // 侧边栏状态
    const sidebar:Sidebar=reactive({
        opened:getSidebarStatus()!==SIDEBAR_CLOSED,
        withoutAnimation:false
    })
    // 设备类型
    const device=ref<DeviceEnum>(DeviceEnum.Desktop)
    // 监听侧边栏opened状态
    watch(
        // 监听opened状态
        ()=>sidebar.opened,
        // 监听到变化时执行
        (opened)=>{
            handleSidebarStatus(opened)
        }
    )
    // 切换侧边栏
    const toggleSidebar=(withoutAnimation:boolean)=>{
        sidebar.opened=!sidebar.opened
        sidebar.withoutAnimation=withoutAnimation
    }
    // 关闭侧边栏
    const closeSidebar=(withoutAnimation:boolean)=>{
        sidebar.opened=false
        sidebar.withoutAnimation=withoutAnimation

    }
    // 切换设备类型
    const toggleDevice=(value:DeviceEnum)=>{
        device.value=value
    }
    return{sidebar,device,toggleSidebar,closeSidebar,toggleDevice}
})
// 在非setup中使用该store时需要通过此方法获取
export function useAppStoreOutside(){
    return useAppStore(pinia)
}