import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
      ],
      dts: 'src/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 查找路径
      // dirs: ['src/components/', 'src/pages', 'assets/iconfont'],
      // 以 .vue 结尾的文件
      extensions: ['vue'],
      // 解析组件，这里以 Element Plus 为例
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({ 
          prefix: 'icon',
          enabledCollections: ['ep'],
          customCollections: ['cus']
        }),
      ],
      dts: 'src/components.d.ts',
      // 递归查找子目录
      deep: true
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
      customCollections: {
        'cus': FileSystemIconLoader('src/assets/svg')
      }
    }),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: name => {
            return `element-plus/theme-chalk/${name}.css`
          }
        }
      ]
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
})
