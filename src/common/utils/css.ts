// 获取指定元素上的css变量的值
export function getCssVar(varName:string,element:HTMLElement=document.documentElement){
   if(!varName?.startsWith("--")){
        console.error("css变量名必须以--开头")
        return ""
   }
//    没有值时会返回空串
   return getComputedStyle(element).getPropertyValue(varName)
}
// 设置指定元素上的css变量的值
export function setCssVar(varName:string,value:string,element:HTMLElement=document.documentElement){
    if(!varName?.startsWith("--")){
        console.error("css变量名必须以--开头")
        return
    }
    element.style.setProperty(varName,value)
}