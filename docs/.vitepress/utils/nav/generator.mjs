/**
 * 导航生成模块
 */

import path from 'path'
import fs from 'fs'
import { docsDir, getDirectoryMeta } from '../config/index.mjs'
import { logger } from '../logger/index.mjs'
import { safeReadDir } from '../file/reader.mjs'
import { shouldIgnoreDir } from '../file/filter.mjs'
import { cleanDisplayText, encodeURL } from '../text/index.mjs'
import { naturalSort } from '../text/index.mjs'
import { 
  hasSubDirectories, 
  hasValidMarkdownFiles, 
  hasIndexFile,
  getFirstLink,
  getSubDirectories
} from '../file/directory.mjs'

/**
 * 递归生成导航项（支持多级嵌套）
 * @param {string} dirPath - 目录路径
 * @param {string} baseUrl - 基础 URL
 * @param {object} options - 配置选项
 * @param {number} options.maxDepth - 最大支持层级
 * @param {number} options.currentDepth - 当前深度（内部使用）
 * @param {boolean} options.addOverview - 是否添加概述项
 * @param {string} options.overviewText - 概述文本
 * @returns {Array} - 导航项数组
 */
function formatTextWithIcon(text, icon) {
  if (!text) {
    return ''
  }
  return icon ? `${icon} ${text}` : text
}

function generateNavItemsRecursive(dirPath, baseUrl, options = {}) {
  const {
    maxDepth = Infinity,
    currentDepth = 0,
    addOverview = true,
    overviewText = '📋 概述'
  } = options

  // 检查是否超过最大深度
  if (currentDepth >= maxDepth) {
    return []
  }

  const items = []
  const subDirs = getSubDirectories(dirPath)

  subDirs.forEach(subDir => {
    const subDirPath = path.join(dirPath, subDir)
    const dirMeta = getDirectoryMeta(subDirPath)
    const navMeta = {
      title: dirMeta.title,
      icon: dirMeta.icon,
      hidden: dirMeta.hidden,
      ...(dirMeta.nav || {})
    }

    if (navMeta.hidden) {
      return
    }

    const hasSubDirs = hasSubDirectories(subDirPath)
    const hasFiles = hasValidMarkdownFiles(subDirPath)
    
    if (!hasSubDirs && !hasFiles) {
      return
    }

    const subUrl = `${baseUrl}/${subDir}`
    const activeMatch = `^${subUrl}/`
    const displayText = navMeta.title ?? cleanDisplayText(subDir)
    const textWithIcon = formatTextWithIcon(displayText, navMeta.icon)

    if (hasSubDirs && currentDepth < maxDepth - 1) {
      // 有子目录，创建下拉菜单
      const navItem = {
        text: textWithIcon,
        items: [],
        activeMatch: activeMatch
      }

      // 如果有文件，添加概述项
      if (hasFiles && addOverview) {
        const link = getFirstLink(subDirPath, subUrl)
        if (link) {
          navItem.items.push({
            text: overviewText,
            link: link
          })
        }
      }

      // 递归处理子目录
      const subItems = generateNavItemsRecursive(
        subDirPath,
        subUrl,
        {
          maxDepth,
          currentDepth: currentDepth + 1,
          addOverview,
          overviewText
        }
      )
      
      navItem.items.push(...subItems)

      if (navItem.items.length > 0) {
        items.push(navItem)
      }
    } else if (hasFiles) {
      // 只有文件，创建单个链接
      const link = getFirstLink(subDirPath, subUrl)
      if (link) {
        items.push({
          text: textWithIcon,
          link: link,
          activeMatch: activeMatch
        })
      }
    }
  })

  return items
}

/**
 * 生成导航配置
 * @param {object} options - 配置选项
 * @param {boolean} options.addOverview - 是否添加概述项
 * @param {string} options.overviewText - 概述文本
 * @param {number} options.maxDepth - 最大支持层级（默认无限，建议设置为 2-3）
 * @returns {Array} - 导航配置数组
 */
export function generateNav(options = {}) {
  const {
    addOverview = true,
    overviewText = '📋 概述',
    maxDepth = Infinity
  } = options

  // 验证 maxDepth
  if (typeof maxDepth !== 'number' || maxDepth < 1) {
    logger.warn(`maxDepth 无效，使用默认值 Infinity: ${maxDepth}`)
    options.maxDepth = Infinity
  } else {
    logger.info(`导航最大深度限制: ${maxDepth}`)
  }
  
  const nav = []
  
  try {
    // 使用递归函数生成导航
    const navItems = generateNavItemsRecursive(
      docsDir,
      '',
      {
        maxDepth,
        currentDepth: 0,
        addOverview,
        overviewText
      }
    )
    
    nav.push(...navItems)
    
    logger.info(`成功生成 ${nav.length} 个导航项`)
  } catch (error) {
    logger.error('生成导航失败:', error)
  }

  return nav
}

