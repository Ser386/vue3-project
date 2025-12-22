// 监听浏览器窗口的大小变化来动态调整布局和设备状态

import { useAppStore } from "@/pinia/stores/app"
import {useRouteListener} from "@@/composables/"

// 宽度<=992,设备被认为是移动端，>992则是桌面端
const MAX_MOBILE_WIDTH=992

export function useResize(){
    const appStore=useAppStore()
    const {listenerRouteChange}=useRouteListener()

}