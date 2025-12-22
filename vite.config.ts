import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 导入element-plus相关插件
import AutoImport from 'unplugin-auto-import/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import  Components  from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //  自动按需导入API
    AutoImport({
      imports: ["vue", "vue-router", "pinia"], // 要自动导入的库
      dts: "types/auto/auto-imports.d.ts", // 生成类型声明文件,也就是需要自动导入的库都写在这个文件中
      resolvers: [ElementPlusResolver()] // 自动导入Element Plus的API
    }),
    // 自动导入组件
    Components({
      dts: "types/auto/components.d.ts",// 生成组件类型声明文件
      resolvers: [ElementPlusResolver()]// 自动导入Element Plus的组件
    }),    

  ],
  resolve: {
    alias: {
      // @ 符号指向 src 目录
      "@": path.resolve(__dirname, "src"),
      '@@': path.resolve(__dirname, 'src/common')
    }
  }
})
