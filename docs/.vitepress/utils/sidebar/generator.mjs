/**
 * 侧边栏生成模块
 */

import path from 'path'
import { docsDir, getDirectoryMeta } from '../config/index.mjs'
import { logger } from '../logger/index.mjs'
import { getSubDirectories, hasSubDirectories, hasValidMarkdownFiles } from '../file/directory.mjs'
import { cleanDisplayText } from '../text/index.mjs'
import { createSidebarItem } from './item.mjs'

/**
 * 递归生成侧边栏配置（支持多级目录）
 * @param {string} dirPath - 当前目录路径
 * @param {string} baseUrl - 基础 URL
 * @param {object} options - 配置选项
 * @param {number} options.maxDepth - 最大支持层级
 * @param {number} options.currentDepth - 当前深度（内部使用）
 * @returns {object} - 侧边栏配置对象
 */
function formatTextWithIcon(text, icon) {
  if (!text) {
    return ''
  }
  return icon ? `${icon} ${text}` : text
}

function generateSidebarRecursive(dirPath, baseUrl, options = {}) {
  const {
    useTitle = false,
    collapsed = false,
    maxDepth = Infinity,
    currentDepth = 0
  } = options

  // 检查是否超过最大深度
  if (currentDepth >= maxDepth) {
    return {}
  }

  const sidebar = {}
  const dirs = getSubDirectories(dirPath)

  dirs.forEach(dir => {
    const dirPathFull = path.join(dirPath, dir)
    const dirMeta = getDirectoryMeta(dirPathFull)
    const sidebarMeta = {
      title: dirMeta.title,
      icon: dirMeta.icon,
      hidden: dirMeta.hidden,
      ...(dirMeta.sidebar || {})
    }

    if (sidebarMeta.hidden) {
      return
    }

    const hasSubDirs = hasSubDirectories(dirPathFull)
    const hasFiles = hasValidMarkdownFiles(dirPathFull)
    
    if (!hasSubDirs && !hasFiles) {
      return
    }

    const dirUrl = `${baseUrl}/${dir}`
    const sidebarKey = `${dirUrl}/`
    const groupText = formatTextWithIcon(
      sidebarMeta.title ?? cleanDisplayText(dir),
      sidebarMeta.icon
    )
    
    // 创建侧边栏项（会自动递归处理子目录）
    const sidebarItem = createSidebarItem(
      dirPathFull,
      dirUrl,
      groupText || cleanDisplayText(dir),
      {
        useTitle,
        collapsed,
        maxDepth,
        currentDepth: 0  // 从 0 开始，因为这是这个目录的根
      }
    )
    
    if (sidebarItem) {
      sidebar[sidebarKey] = [sidebarItem]
    }

    // 递归处理子目录（用于为每个层级生成 sidebar key）
    if (hasSubDirs && currentDepth < maxDepth - 1) {
      const subSidebar = generateSidebarRecursive(
        dirPathFull,
        dirUrl,
        {
          useTitle,
          collapsed,
          maxDepth,
          currentDepth: currentDepth + 1
        }
      )
      
      // 合并子目录的侧边栏配置
      Object.assign(sidebar, subSidebar)
    }
  })

  return sidebar
}

/**
 * 生成侧边栏配置
 * @param {object} options - 配置选项
 * @param {boolean} options.useTitle - 是否使用文件内标题
 * @param {boolean} options.collapsed - 是否默认折叠
 * @param {number} options.maxDepth - 最大支持层级（默认无限，建议设置为 3-5）
 * @returns {object} - 侧边栏配置对象
 */
export function generateSidebar(options = {}) {
  const {
    useTitle = false,  // 是否使用文件内标题
    collapsed = false,  // 是否默认折叠
    maxDepth = Infinity  // 最大支持层级
  } = options

  // 验证 maxDepth
  if (typeof maxDepth !== 'number' || maxDepth < 1) {
    logger.warn(`maxDepth 无效，使用默认值 Infinity: ${maxDepth}`)
    options.maxDepth = Infinity
  } else {
    logger.info(`侧边栏最大深度限制: ${maxDepth}`)
  }
  
  const sidebar = {}
  
  try {
    // 使用递归函数生成侧边栏
    const generatedSidebar = generateSidebarRecursive(
      docsDir,
      '',
      {
        useTitle,
        collapsed,
        maxDepth
      }
    )
    
    Object.assign(sidebar, generatedSidebar)
    
    logger.info(`成功生成 ${Object.keys(sidebar).length} 个侧边栏配置`)
  } catch (error) {
    logger.error('生成侧边栏失败:', error)
  }

  return sidebar
}

