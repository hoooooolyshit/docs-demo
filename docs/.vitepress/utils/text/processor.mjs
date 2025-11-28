/**
 * 文本处理模块
 */

import { logger } from '../logger/index.mjs'

/**
 * 自然排序函数（支持中文、英文和数字）
 * @param {string} a - 第一个字符串
 * @param {string} b - 第二个字符串
 * @returns {number} - 排序结果
 */
export function naturalSort(a, b) {
  try {
    return a.localeCompare(b, 'zh-CN', {
      numeric: true,
      sensitivity: 'base'
    })
  } catch (error) {
    logger.warn('排序失败，使用默认排序', error.message)
    return a > b ? 1 : a < b ? -1 : 0
  }
}

/**
 * 清理显示文本（去掉数字前缀）
 * @param {string} text - 原始文本
 * @returns {string} - 清理后的文本
 */
export function cleanDisplayText(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  return text.replace(/^\d+-/, '').trim()
}

/**
 * URL 编码（修复版）
 * VitePress 会自动处理 URL 编码，我们只需要保持原样
 * @param {string} text - 原始文本
 * @returns {string} - 处理后的文本
 */
export function encodeURL(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  try {
    // VitePress 会自动处理文件名中的空格和特殊字符
    // 我们只需要移除 .md 后缀并保持原样即可
    // 但需要移除 Windows 不允许的字符
    return text.replace(/[<>:"\\|?*]/g, '')
  } catch (error) {
    logger.warn(`URL 编码失败: ${text}`, error.message)
    return text
  }
}

/**
 * 标准化文件名（处理特殊文件）
 * @param {string} fileName - 文件名
 * @param {object} specialFiles - 特殊文件映射
 * @returns {string} - 标准化后的文件名
 */
export function normalizeFileName(fileName, specialFiles = {}) {
  return specialFiles[fileName] || fileName
}

