import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      // 导入 Vue 函数，如：ref, reactive, toRef 等
      imports: ['vue'],
      eslintrc: {
        enabled: false, // 是否自动生成 eslint 规则，建议生成之后设置 false
        filepath: './.eslintrc-auto-import.json', // 指定自动导入函数 eslint 规则的文件
        globalsPropValue: true,
      },
      // 导入 Element Plus函数，如：ElMessage, ElMessageBox 等
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
