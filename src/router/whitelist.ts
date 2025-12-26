import type { RouteLocationNormalizedGeneric, RouteRecordNameGeneric } from "vue-router"


// 免登录白名单
const whitelistByPath:string[]=["/login"]
// 免登录白名单
const whiteListByName: RouteRecordNameGeneric[] = []

// 判断是否在白名单上
export function isWhiteList(to:RouteLocationNormalizedGeneric){
    // path和Name任何一个匹配上即可
    return whitelistByPath.includes(to.path) || whiteListByName.includes(to.name)
}