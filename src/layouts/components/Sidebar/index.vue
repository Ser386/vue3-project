<script lang="ts" setup>

import { useLayoutMode } from '@@/composables/useLayoutMode';
import { useSettingsStore } from '@/pinia/stores/settings';
import { useAppStore } from '@/pinia/stores/app';
import { getCssVar } from '@@/utils/css';
import { useDevice } from '@/common/composables/useDevice';
import { Logo } from "../index"
import { usePermissionStore } from "@/pinia/stores/permission"
import Item from "./Item.vue"
const { isLeft, isTop } = useLayoutMode();
const settingsStore = useSettingsStore();
const appStore = useAppStore();
const route = useRoute();
const { isMobile } = useDevice()
const permissionStore = usePermissionStore()

const v3SidebarMenuBgColor = getCssVar("--v3-sidebar-menu-bg-color")
const v3SidebarTextColor = getCssVar("--v3-sidebar-text-color")
const v3SidebarActiveTextColor = getCssVar("--v3-sidebar-active-text-color")

const isLogo = computed(() => isLeft.value && settingsStore.showLogo)
const isCollapse = computed(() => !appStore.sidebar.opened)
const activeMenu = computed(() => route.meta.activeMenu || route.path)
const noHiddenRoutes = computed(() => permissionStore.routes.filter(item => !item.meta?.hidden))

const backgroundColor = computed(() => isLeft.value ? v3SidebarMenuBgColor : undefined)
const textColor = computed(() => isLeft.value ? v3SidebarTextColor : undefined)
const activeTextColor = computed(() => isLeft.value ? v3SidebarActiveTextColor : undefined)

const sidebarMenuItemHeight = computed(() => !isTop.value ? "var(--v3-sidebar-menu-item-height)" : "var(--v3-navigationbar-height)")
const sidebarMenuHoverBgColor = computed(() => !isTop.value ? "var(--v3-sidebar-menu-hover-bg-color)" : "transparent")
const tipLineWidth = computed(() => !isTop.value ? "2px" : "0px")
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
%tip-line {
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

.has-logo {
    .el-scrollbar {
        height: calc(100% - var(--v3-header-height));
    }
}

.el-scrollbar {
    height: 100%;

    :deep(.scrollbar-wrapper) {
        // 限制水平宽度
        overflow-x: hidden;
    }

    // 滚动条
    :deep(.el-scrollbar__bar) {
        &.is-horizontal {
            // 隐藏水平滚动条
            display: none;
        }
    }
}

.el-menu {
    user-select: none;
    border: none;
    width: 100%;
}

.el-menu--horizontal {
    height: v-bind(sidebarMenuItemHeight);
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item),
:deep(.el-menu--horizontal .el-menu-item) {
    height: v-bind(sidebarMenuItemHeight);
    line-height: v-bind(sidebarMenuItemHeight);

    &.is-active,
    &:hover {
        background-color: v-bind(sidebarMenuHoverBgColor);
    }
}

:deep(.el-sub-menu) {
    &.is-active {
        >.el-sub-menu__title {
            color: v-bind(activeTextColor);
        }
    }
}
:deep(.el-menu-item.is-active) {
  @extend %tip-line;
}

.el-menu--collapse {
  :deep(.el-sub-menu.is-active) {
    .el-sub-menu__title {
      @extend %tip-line;
      background-color: v-bind(sidebarMenuHoverBgColor);
    }
  }
}
</style>
