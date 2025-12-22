<script lang="ts" setup>
    import LeftMode from "./modes/LeftMode.vue";
    import TopMode from "./modes/TopMode.vue";
    import LeftTopMode from "./modes/LeftTopMode.vue";
    import { useLayoutMode } from "@@/composables/useLayoutMode"
    import { useDevice } from "@@/composables/useDevice"
    import { useSettingsStore } from "@/pinia/stores/settings";
    import {getCssVar,setCssVar} from "@@/utils/css"
    // import {useWatermark} from "@@/composables/useWatermark"
    
    

    const {isLeft,isTop,isLeftTop}=useLayoutMode()
    const {isMobile}=useDevice()
    const settingsStore=useSettingsStore()
    const cssVarName="--v3-tagsview-height"
    const v3TagsviewHeight=getCssVar(cssVarName)
    // 将reactiveduie对象转为ref对象
    const {showSettings,showTagsView,showWatermark}=storeToRefs(settingsStore)
    watchEffect(()=>{
        showTagsView.value?setCssVar(cssVarName,v3TagsviewHeight):setCssVar(cssVarName,"0px")
    })
    // 开启或关闭系统水印
    // watchEffect(()=>{
    //     showWatermark.value?setWatermark(import.meta.env.VITE_APP_TITLE):clearWatermark()
    // })

</script>

<template>
    <div>
        <LeftMode v-if="isLeft || isMobile"/>
        <TopMode v-else-if="isTop"/>
        <LeftTopMode v-else-if="isLeftTop"/>
        <!-- 右侧设置面板 -->
         <RightPanel v-if="showSettings">
            <Settings/>
         </RightPanel>
    </div>
</template>