import type { App, Directive } from "vue"
import { isArray } from "@@/utils/validate"
import { useUserStore } from "@/pinia/stores/user"

/**
 * @name 权限指令 v-permission=['xxx'] 只要当前登录角色存在于v-permission数组中才会显示该元素
 * @description 和权限判断函数 checkPermission 功能类似
 */
const permission: Directive = {
  // el 指令绑定的DOM元素 binding 指令绑定的值
  //当绑定了该指令的DOM元素被挂载到页面时，执行这个函数
  mounted(el, binding) {
    const { value: permissionRoles } = binding
    const { roles } = useUserStore()
    if (isArray(permissionRoles) && permissionRoles.length > 0) {
      //判断用户是否有匹配的角色
      const hasPermission = roles.some(role => permissionRoles.includes(role))
      //无权限则移除元素
      hasPermission || el.parentNode?.removeChild(el)
    } else {
      //参数格式错误则抛错
      throw new Error(`参数必须是一个数组且长度大于 0，参考：v-permission="['admin', 'editor']"`)
    }
  }
}
// 注册指令到 Vue 应用，需在入口文件（比如 main.ts）调用这个函数，就能全局使用该指令。
export function installPermissionDirective(app: App) {
  app.directive("permission", permission)
}
