/**
 * 常量配置模块
 */

// 需要忽略的目录列表
export const IGNORE_DIRS = new Set([
  'assets',
  'public',
  'node_modules',
  '.vitepress',
  '.git',
  '.vscode',
  'dist'
])

// 需要忽略的文件列表
export const IGNORE_FILES = new Set([
  '404.md',
  'search.md',
  'sitemap.md'
])

// 特殊文件名映射
export const SPECIAL_FILES = {
  'README.md': 'index.md',
  'readme.md': 'index.md',
  'Readme.md': 'index.md'
}

// 日志级别
export const LOG_LEVEL = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

