/**
 * 工具模块统一导出入口
 */

import { generateNav } from './nav/index.mjs'
import { generateSidebar, createSidebarItem } from './sidebar/index.mjs'
import { logger, setLogLevel, getLogLevel } from './logger/index.mjs'
import { LOG_LEVEL } from './config/index.mjs'
import { 
  clearCache, 
  getCacheStats, 
  setCacheConfig, 
  getCacheConfig 
} from './cache/index.mjs'
import {
  checkFileLinks,
  checkAllLinks,
  generateReport,
  BrokenLink
} from './validator/index.mjs'

// 导出主要功能
export { generateNav, generateSidebar, createSidebarItem }
export { logger, setLogLevel, getLogLevel }
export { LOG_LEVEL }

// 导出缓存功能
export { clearCache, getCacheStats, setCacheConfig, getCacheConfig }

// 导出断链检测功能
export { checkFileLinks, checkAllLinks, generateReport, BrokenLink }

/**
 * 生成侧边栏配置（使用文件标题）
 * @returns {object} - 侧边栏配置对象
 */
export function generateSidebarWithTitle() {
  return generateSidebar({ useTitle: true })
}

/**
 * 一键生成所有配置
 * @param {object} options - 配置选项
 * @returns {object} - 包含导航和侧边栏的配置对象
 */
export function generateAll(options = {}) {
  const {
    nav: navOptions = {},
    sidebar: sidebarOptions = {},
    logLevel = LOG_LEVEL.WARN
  } = options
  
  setLogLevel(logLevel)
  
  logger.info('开始生成导航和侧边栏配置...')
  
  const nav = generateNav(navOptions)
  const sidebar = generateSidebar(sidebarOptions)
  
  logger.info('配置生成完成！')
  
  return { nav, sidebar }
}

