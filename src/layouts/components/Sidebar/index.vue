<script lang="ts" setup>


import { useLayoutMode } from '@@/composables/useLayoutMode';
import { useSettingsStore } from '@/pinia/stores/settings';
import { useAppStore } from '@/pinia/stores/app';
import { getCssVar } from '@@/utils/css';
import { useDevice } from '@/common/composables/useDevice';
const { isLeft, isTop } = useLayoutMode();
const settingsStore = useSettingsStore();
const appStore = useAppStore();
const route = useRoute();
const { isMobile } = useDevice()

const v3SidebarMenuBgColor = getCssVar("--v3-sidebar-menu-bg-color")
const v3SidebarTextColor = getCssVar("--v3-sidebar-text-color")
const v3SidebarActiveTextColor = getCssVar("--v3-sidebar-active-text-color")

const isLogo = computed(() => isLeft.value && settingsStore.showLogo)
const isCollapse = computed(() => !appStore.sidebar.opened)
const activeMenu = computed(() => route.meta.activeMenu || route.path)


const backgroundColor = computed(() => isLeft.value ? v3SidebarMenuBgColor : undefined)
const textColor = computed(() => isLeft.value ? v3SidebarTextColor : undefined)
const activeTextColor = computed(() => isLeft.value ? v3SidebarActiveTextColor : undefined)
</script>
<template>
    <div :class="{ 'has-logo': isLogo }">
        <!-- 侧边栏是否折叠 -->
        <Logo v-if="isLogo" :collapse="isCollapse" />
        <!-- 自定义滚动容器组件 -->
        <!-- wrap-class:给内部的 .el-scrollbar__wrap 这个包裹层追加一个 class控制高度、溢出、布局 -->
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :collapse="isCollapse && !isTop" :background-color="backgroundColor"
                :text-color="textColor" :active-text-color="activeTextColor" :collapsed-transition="false"
                :mode="isTop && !isMobile ? 'horizontal' : 'vertical'">
                <!-- 把路由表变成菜单，每一个route对应一个菜单 -->
                <Item v-for="noHiddenRoute in noHiddenRoutes" :key="noHiddenRoute.path" :item="noHiddenRoute"
                    :base-path="noHiddenRoute.path" />
            </el-menu>
        </el-scrollbar>

    </div>
</template>
<style lang="scss" scoped>
// %top-line是提示条样式模板
%top-line {
    // 给父选择器对应的元素，生成一个「在内容前面」的虚拟样式元素
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: v-bind(tipLineWidth);
        height: 100%;
        background-color: var(--v3-sidebar-menu-tip-line-bg-color);
    }
}
.has-logo{
    .el-scrollbar{
        height: calc(100%-var(--v3-header-height));
    }
}
.el-scrollbar{
    height: 100%;
    :deep(.scrollbar-wrapper){
        // 限制水平宽度
        overflow-x:hidden;
    }
    // 滚动条
    :deep(.el-scrollbar__bar){
        &.is-horizontal{
            // 隐藏水平滚动条
            display: none;
        }
    }
}
.el-menu{
    user-select: none;
    border:none;
    width:100%;
}
// .el-menu--horizontal{
//     height: v-bind(sidebarMenuItemHeight);
// }

</style>