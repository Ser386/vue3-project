<script lang="ts" setup>
import type { RouteRecordNameGeneric, RouteRecordRaw } from "vue-router"
import { useDevice } from "@@/composables/useDevice"
import { isExternal } from "@@/utils/validate"
import { cloneDeep, debounce } from "lodash-es"
import { usePermissionStore } from "@/pinia/stores/permission"
const router = useRouter()
//接收夫父组件传递的modelValue
const modelValue = defineModel<boolean>({ required: true })

// 搜索内容
const keyword = ref<string>("")
// 搜索结果 shallowRef 浅代理 只响应第一层
const result = shallowRef<RouteRecordRaw[]>([])
const inputRef = useTemplateRef("inputRef")

// 关闭之前处理一些操作
function handleClose() {
    modelValue.value = false
    //延时重置数据
    setTimeout(() => {
        keyword.value = ""
        result.value = []
    }, 200)
}
const { isMobile } = useDevice()
// 搜索弹窗宽度
const modelWidth = computed(() => (isMobile.value ? "80vw" : "40vw"))
/** 是否按下了上键或下键（用于解决和 mouseenter 事件的冲突） */
const isPressUpOrDown = ref<boolean>(false)

const activeRouteName = ref<RouteRecordNameGeneric | undefined>(undefined)

const resultRef = useTemplateRef("resultRef")
const scrollbarRef = useTemplateRef("scrollbarRef")

/** 根据下标位置进行滚动 */
function scrollTo(index: number) {
    if (!resultRef.value) return
    const scrollTop = resultRef.value.getScrollTop(index)
    // 手动控制 el-scrollbar 滚动条滚动，设置滚动条到顶部的距离
    scrollbarRef.value?.setScrollTop(scrollTop)
}
/** 键盘上键 */
function handleUp() {
    isPressUpOrDown.value = true
    const { length } = result.value
    if (length === 0) return
    // 获取该 name 在菜单中第一次出现的位置
    const index = result.value.findIndex(item => item.name === activeRouteName.value)
    // 如果已处在顶部
    if (index === 0) {
        const bottomName = result.value[length - 1].name
        // 如果顶部和底部的 bottomName 相同，且长度大于 1，就再跳一个位置（可解决遇到首尾两个相同 name 导致的上键不能生效的问题）
        if (activeRouteName.value === bottomName && length > 1) {
            activeRouteName.value = result.value[length - 2].name
            scrollTo(length - 2)
        } else {
            // 跳转到底部
            activeRouteName.value = bottomName
            scrollTo(length - 1)
        }
    } else {
        activeRouteName.value = result.value[index - 1].name
        scrollTo(index - 1)
    }
}

/** 键盘下键 */
function handleDown() {
    isPressUpOrDown.value = true
    const { length } = result.value
    if (length === 0) return
    // 获取该 name 在菜单中最后一次出现的位置（可解决遇到连续两个相同 name 导致的下键不能生效的问题）
    const index = result.value.map(item => item.name).lastIndexOf(activeRouteName.value)
    // 如果已处在底部
    if (index === length - 1) {
        const topName = result.value[0].name
        // 如果底部和顶部的 topName 相同，且长度大于 1，就再跳一个位置（可解决遇到首尾两个相同 name 导致的下键不能生效的问题）
        if (activeRouteName.value === topName && length > 1) {
            activeRouteName.value = result.value[1].name
            scrollTo(1)
        } else {
            // 跳转到顶部
            activeRouteName.value = topName
            scrollTo(0)
        }
    } else {
        activeRouteName.value = result.value[index + 1].name
        scrollTo(index + 1)
    }
}

/** 键盘回车键 */
function handleEnter() {
    const { length } = result.value
    if (length === 0) return
    const name = activeRouteName.value
    const path = result.value.find(item => item.name === name)?.path
    if (path && isExternal(path)) return window.open(path, "_blank", "noopener, noreferrer")
    if (!name) return ElMessage.warning("无法通过搜索进入该菜单，请为对应的路由设置唯一的 Name")
    try {
        router.push({ name })
    } catch {
        return ElMessage.warning("该菜单有必填的动态参数，无法通过搜索进入")
    }
    handleClose()
}

/** 释放上键或下键 */
function handleReleaseUpOrDown() {
    isPressUpOrDown.value = false
}
// 树形菜单
const menus = computed(() => cloneDeep(usePermissionStore().routes))
// 将树形菜单扁平化为一维数组
function flatTree(arr: RouteRecordRaw[], result: RouteRecordRaw[] = []) {
    arr.forEach((item) => {
        result.push(item)
        item.children && flatTree(item.children, result)
    })
    return result
}
// 搜索 防抖
const handleSearch = debounce(() => {
    const flatMenus = flatTree(menus.value)
    const _keywords = keyword.value.toLocaleLowerCase().trim()
    result.value = flatMenus.filter(menu => keyword.value ? menu.meta?.title?.toLocaleLowerCase().includes(_keywords) : false)
    const length = result.value.length
    // 默认选中搜索结果第一项
    activeRouteName.value = length > 0 ? result.value[0].name : undefined
})
</script>
<template>
    <el-dialog v-model="modelValue" :before-close="handleClose" :width="modelWidth" top="5vh"
        class="search-modal_private" append-to-body @open="inputRef?.focus()" @closed="inputRef?.blur()"
        @keydown.up="handleUp" @keydown.down="handleDown" @keydown.enter="handleEnter"
        @keyup.up.down="handleReleaseUpOrDown">

        <!-- 将输入框绑定到inputRef，用于打开时聚焦，关闭时失焦 -->
        <el-input ref="inputRef" v-model="keyword" placeholder="搜索菜单" size="large" clearable @input="handleSearch">
            <template #prefix>
                <SvgIcon name="search" class="svg-icon" />
            </template>
        </el-input>
        <el-empty v-if="result.length === 0" description="暂无搜索结果" :image-size="100" />
        <template v-else>
            <p>搜索结果</p>
            <el-scollbar ref="scrollbarRef" max-height="40vh" always>
                <Result ref="resultRef" v-model="activeRouteName" :data="result" :is-press-up-or-down="isPressUpOrDown"
                    @click="handleEnter" />
            </el-scollbar>
        </template>
        <template #footer>
            <Footer :total="result.length"/>
        </template>
    </el-dialog>
</template>
<style lang="scss">
.search-modal__private {
  .svg-icon {
    font-size: 18px;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__footer {
    border-top: 1px solid var(--el-border-color);
    padding-top: var(--el-dialog-padding-primary);
  }
}
</style>
