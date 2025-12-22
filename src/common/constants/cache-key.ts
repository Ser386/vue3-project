// 处理cookies的方法
const SYSTEM_NAME = "zy-admin-vite"
// 缓存数据时用到的key
export class CacheKey{
    static readonly TOKEN = `${SYSTEM_NAME}-token-key`
    // 布局配置 （三种布局）
    static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`
    // 侧边栏配置
    static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
    // 激活主题配置
    static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name`
    // 访问过的页面
    static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`
    // 缓存的页面
    static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`

}