import { setToken as _setToken, getToken, removeToken } from "@@/utils/cache/cookies"
import { pinia } from "@/pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getCurrentUserApi } from "@@/apis/users"
import { resetRouter } from "@/router"
import { routerConfig } from "@/router/config"
export const useUserStore = defineStore("user",()=>{
    const token=ref<string>(getToken()||"")
    const roles = ref<string[]>([])
    const username=ref<string>("")
    const tagsViewStore = useTagsViewStore()
    const settingStore = useSettingsStore()
    // 设置token
    const setToken=(value:string)=>{
        _setToken(value)
        token.value=value
    }
    // 获取用户详情
    const getInfo = async()=>{
        const{data} =await getCurrentUserApi()
        username.value=data.username
        roles.value=data.roles?.length>0?data.roles:routerConfig.defaultRoles
    }
    // 模拟角色变化
    const changeRoles =(role:string)=>{
        const newToken =`token-${role}`
        token.value = newToken
        _setToken(newToken)
        // 用刷新页面替代重新登录
        location.reload()
    }
    // 重置token
    const resetToken=()=>{
        removeToken()
        token.value=""
        roles.value=[]
    }
    // 重置visited views和cached views
    const resetTagsView=()=>{
        if(!settingStore.cacheTagsView){
            tagsViewStore.delAllVisitedViews()
            tagsViewStore.delAllCachedViews()
        }
    }
    // 退出登录
    const logout=()=>{
        resetToken()
        resetRouter()
        resetTagsView()

    }
    return{
        token,roles,username,setToken,getInfo,changeRoles,logout,resetToken
    }
})
export function useUserStoreOutside(){
    return useUserStore(pinia)
}