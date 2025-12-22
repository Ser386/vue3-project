// 设备类型--枚举
export enum DeviceEnum{
    Mobile,
    Desktop
}
// 布局模式
export enum LayoutModeEnum{
    Left="left", //左侧菜单栏布局
    Top="top", //顶部导航栏布局
    LeftTop="left-top" //左侧+顶部混合布局
}
// 侧边栏打开状态常量
export const SIDEBAR_OPENED="opened"

// 侧边栏关闭状态常量
export const SIDEBAR_CLOSED="closed"

// 状态类型别名
export type SidebarOpened = typeof SIDEBAR_OPENED
export type SidebarClosed = typeof SIDEBAR_CLOSED