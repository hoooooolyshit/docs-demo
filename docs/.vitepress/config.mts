import { defineConfig } from 'vitepress'
import { generateNav, generateSidebar } from './autoGenerateNavSidebar.mjs'
import { handleMissingAssets } from './plugins/handle-missing-assets.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'src',
  title: "我的精彩大脑",
  description: "A VitePress Site",
  head: [['link', { rel: 'icon', href: 'https://vitejs.cn/vitepress/vitepress-logo-mini.svg' }]],
  
  // Vite 配置：处理缺失的资源链接
  vite: {
    plugins: [
      handleMissingAssets()
    ],
    // 优化错误处理
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // 忽略资源相关的警告（已由插件处理）
          if (warning.code === 'UNRESOLVED_IMPORT' && 
              warning.message && warning.message.includes('missing-asset')) {
            return
          }
          // 忽略其他资源相关的常见警告
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return
          }
          warn(warning)
        }
      }
    }
  },
  
  // Markdown 配置
  markdown: {
    // 图片懒加载
    image: {
      lazyLoading: true
    }
  },
  
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: 'https://vitejs.cn/vitepress/vitepress-logo-mini.svg',
    siteTitle: 'Lee',
    search: {
      provider: 'local'
    },
    nav: generateNav({
      maxDepth: 3,
      addOverview: true,
      overviewText: '📋 概述'
    }),
    sidebar: generateSidebar({
      maxDepth: 2,
      useTitle: false,
      collapsed: false
    }),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    outline: [2, 4],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    },

  }
})
