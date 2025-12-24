import { getActiveThemeName, setActiveThemeName } from "@@/utils/cache/local-storage"
import { setCssVar } from "../utils/css"
import { de } from "element-plus/es/locale"

// 默认主题名称
const DEFAULT_THEME_NAME = "normal"
type DefaultThemeName = typeof DEFAULT_THEME_NAME

// 注册的主题名称
export type ThemeName = DefaultThemeName | "dark" | "dark-blue"

interface ThemeList {
    title: string
    name: ThemeName
}
// 主题列表
const themeList: ThemeList[] = [
    {
        title: "默认",
        name: DEFAULT_THEME_NAME
    },
    {
        title: "黑暗",
        name: "dark"
    },
    {
        title: "深蓝",
        name: "dark-blue"
    }
]
// 正在应用的主题名称
const activeThemeName=ref<ThemeName>(getActiveThemeName||DEFAULT_THEME_NAME)

// 设置主题,根据鼠标点击位置，生成一个圆形扩散动画
function setTheme({clientX,clientY}:MouseEvent,value:ThemeName){
    // 计算最大扩散半径
    const maxRadius=Math.hypot(
        // 计算鼠标横坐标到页面左侧或右侧的最大距离
        Math.max(clientX,window.innerWidth -clientX),
        // 计算鼠标纵坐标到页面顶部或底部的最大距离
        Math.max(clientY,window.innerHeight -clientY)
    )
    // 把鼠标位置和最大半径存入 CSS 自定义属性
    setCssVar("--v3-theme-x", `${clientX}px`)
    setCssVar("--v3-theme-y", `${clientY}px`)
    setCssVar("--v3-theme-r", `${maxRadius}px`)
    // 定义主题切换的核心逻辑--更换主题名称
    const handler=()=>{
        activeThemeName.value=value
    }
    // 判断浏览器是否支持「View Transition API」
    //如果支持--调用该 API 并传入 handler 函数，此时浏览器会自动捕获切换前后的页面状态，结合前面设置的 CSS 变量，实现平滑的圆形扩散过渡动画后，再执行主题名称更新。
    //如果不支持--直接执行 handler 函数，跳过过渡动画，仅完成主题名称更新，保证功能正常可用。
    document.startViewTransition ? document.startViewTransition(handler) : handler()

}
// 在html根元素上挂载class
function addHtmlClass(value:ThemeName){
    document.documentElement.classList.add(value)
}
// 在html根元素上移除其他主题class
function removeHtmlClass(value:ThemeName){
    const otherThemeNameList=themeList.map(item=>item.name).filter(name=>name!==value)
    document.documentElement.classList.remove(...otherThemeNameList)
}
// 初始化
function initTheme(){
    watchEffect(()=>{
        const value=activeThemeName.value
        removeHtmlClass(value)
        addHtmlClass(value)
        setActiveThemeName(value)
    })
}
export function useTheme(){
    return {themeList,activeThemeName,initTheme,setTheme}
}