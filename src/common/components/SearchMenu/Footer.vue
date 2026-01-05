<script lang="ts" setup>
import { useDevice } from "@@/composables/useDevice"

const { isMobile } = useDevice()
</script>
<template>
    <div class="search-footer">
        <template v-if="!isMobile">
            <span class="search-footer-item">
                <SvgIcon name="keyboard-enter" class="svg-icon"/>
                <span>确认</span>
            </span>
        </template>

    </div>
</template>