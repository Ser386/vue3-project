//RouteLocationNormalizedGeneric是vue-router提供的标准化路由位置类型，包含路由的完整属性
import type { RouteLocationNormalizedGeneric } from "vue-router" //导入 vue-router 的通用路由类型
import { pinia } from "@/pinia" 

// 通过Partial工具类型和路由类型的结合，构建一个“路由对象的部分属性类型”
// partical<T> 将类型T的所有属性变为可选
export type TagView = Partial<RouteLocationNormalizedGeneric>
