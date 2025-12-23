
<script lang="ts" setup>
import { useSettingsStore } from '@/pinia/stores/settings';
import {useTagsViewStore} from'@/pinia/stores/tags-view';
import {Footer} from "../index"
const tagsViewStore=useTagsViewStore();
const settingsStore=useSettingsStore();
</script>

<template>
    <section class="app-main">
        <div class="app-scrollbar">
            <!-- Component:当前路由匹配到的组件 route 当前路由对象 -->
             <!-- 如果直接不使用v-slot, 你拿不到组件实例,控制不了 key,不好插 keep-alive / transition-->
            <router-view v-slot="{Component,route}">
                <!-- 页面切换动画 -->
                <transition name="el-fade-in" mode="out-in">
                    <!-- 控制哪些页面需要缓存 -->
                    <keep-alive :include="tagsViewStore.cachedViews">
                        <!-- 动态渲染当前页面，用route.path区分实例 -->
                         <!-- :is决定当前位置渲染的是哪个组件 :key来区分这个组件是不是原先那个
                          key相同，则复用组件实例，如果不同，则销毁旧实例创建新实例-->
                        <component :is="Component" :key="route.path" class="app-container-grow"/>
                    </keep-alive>
                </transition>
            </router-view>
            <!-- 页脚 -->
             <Footer v-if="settingsStore.showFooter"/>
             
        </div>
        <!-- 返回顶部 -->
         <el-backtop/>
         <!-- 返回顶部，固定header -->
          <el-backtop :target="'.app-scrollbar'"/>
    </section>
</template>
