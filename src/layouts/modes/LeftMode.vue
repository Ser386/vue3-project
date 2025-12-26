<script lang="ts" setup>
import { useAppStore } from '@/pinia/stores/app';
import { useDevice } from '@@/composables/useDevice';
import { useLayoutMode } from '@@/composables/useLayoutMode';
import { useSettingsStore } from '@/pinia/stores/settings';
import { AppMain, NavigationBar, Sidebar, TagsView } from '../components';

const appStore = useAppStore();
const { isMobile } = useDevice();
const { isLeft } = useLayoutMode();
const settingsStore = useSettingsStore();
const { showTagsView, fixedHeader } = storeToRefs(settingsStore)

// 控制布局的类名
const layoutClasses = computed(() => {
    return {
        // 侧边栏关闭时添加hideSidebar类
        hideSidebar: !appStore.sidebar.opened,
        // 侧边栏打开添加openSidebar类
        openSidebar: appStore.sidebar.opened,
        // 关闭动画时添加withoutAnimation类
        withoutAnimation: appStore.sidebar.withoutAnimation,
        mobile: isMobile.value,
        // 当布局不是noLeft时添加noLeft类
        noLeft: !isLeft.value

    }

})
/** 用于处理点击 mobile 端侧边栏遮罩层的事件 */
function handleClickOutside() {
    appStore.closeSidebar(false)
}
</script>
<template>
    <div :class="layoutClasses" class="app-wrapper">
        <!-- mibile侧边栏遮罩层 -->
        <div v-if="layoutClasses.mobile && layoutClasses.openSidebar" class="drawer-bg" @click="handleClickOutside" />
        <!-- 左侧边栏 -->
        <Sidebar class="sidebar-container" />
        <!-- 主容器 -->
        <div :class="{ hasTagsView: showTagsView }" class="main-container">
            <!-- 头部导航栏和标签栏 -->
            <div :class="{ 'fixed-header': fixedHeader }" class="layout-header">
                <NavigationBar />
                <TagsView v-show="showTagsView" />
            </div>
            <!-- 页面主体内容 -->
            <AppMain class="app-main" />
        </div>

    </div>
</template>