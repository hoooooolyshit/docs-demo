/**
 * 文件过滤模块
 */

import { IGNORE_DIRS, IGNORE_FILES } from '../config/index.mjs'

/**
 * 判断是否应该忽略某个目录
 * @param {string} dirName - 目录名称
 * @returns {boolean} - 是否应该忽略
 */
export function shouldIgnoreDir(dirName) {
  if (!dirName || typeof dirName !== 'string') {
    return true
  }
  
  return IGNORE_DIRS.has(dirName) ||
         dirName.endsWith('assets') ||
         dirName.startsWith('.') ||
         dirName.startsWith('_')
}

/**
 * 判断是否应该忽略某个文件
 * @param {string} fileName - 文件名
 * @returns {boolean} - 是否应该忽略
 */
export function shouldIgnoreFile(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return true
  }
  
  // 忽略特殊页面
  if (IGNORE_FILES.has(fileName)) {
    return true
  }
  
  // 忽略草稿文件
  if (fileName.startsWith('.') || fileName.startsWith('_')) {
    return true
  }
  
  // 忽略临时文件
  if (fileName.endsWith('~') || fileName.endsWith('.tmp')) {
    return true
  }
  
  return false
}

/**
 * 判断是否为 Markdown 文件
 * @param {string} fileName - 文件名
 * @returns {boolean} - 是否为 Markdown 文件
 */
export function isMarkdownFile(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return false
  }
  return /\.md$/i.test(fileName)
}

