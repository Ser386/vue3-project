// 全局设置状态管理，将布局配置转化为响应式状态，并自动同步到本地缓存，并支持在非组件环境中调用
import { setLayoutsConfig } from "@/common/utils/cache/local-storage"
import type {LayoutsConfig} from "@/layouts/config" //布局配置的类型,是一个接口
import { layoutsConfig } from "@/layouts/config" //当前布局配置的值，是具体的值
import { pinia } from "@/pinia"


// 将LayoutsConfig中的key包装为为ref响应式类型（key:普通类型--->响应式类型）
type SettingsStore={
    // 使用映射类型来遍历LayoutsConfig对象的key
    [Key in keyof LayoutsConfig] :Ref<LayoutsConfig[Key]>
}
// 提取状态对象的所有key并形成联合类型
type SettingsStoreKey = keyof SettingsStore

// 全局布局配置状态管理store ,动态生成响应式状态，自动同步到本地缓存，实现布局配置的响应式管理
// 创建一个名字为settings的pinia Store
export const useSettingsStore = defineStore("settings",()=>{
    // 1.初始化空状态对象 并通过类型断言指定其类型为SettingsStore
    const state = {} as SettingsStore
    // 遍历布局配置对象layoutsConfig 的key-value
    for(const [key,value] of Object.entries(layoutsConfig)){
        // 将value转化为响应式变量
        const refValue = ref(value)
        // 将响应式变量赋值给state中
        state[key as SettingsStoreKey] = refValue

        // 监听响应式变量变化，自动同步到本地缓存
        watch(refValue,()=>{
            const settings = getCacheData()
            setLayoutsConfig(settings)

        })
    }
    // 将响应式state转化为普通布局配置对象（响应式类型--->普通类型）
    const getCacheData=()=>{
        const settings = {} as LayoutsConfig
        for(const[key,value] of Object.entries(state)){
            // 提取ref的原始值，赋值到普通对象
            settings[key as SettingsStoreKey]=value.value
        }
        return settings
    }
    return state
})
// 让非组件文件也可以使用这个store
export function useSettingsStoreOutside(){
    return useSettingsStore(pinia);
}