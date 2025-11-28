/**
 * 侧边栏项创建模块
 */

import path from 'path'
import { 
  getValidMarkdownFiles, 
  getSubDirectories, 
  hasSubDirectories, 
  hasValidMarkdownFiles 
} from '../file/directory.mjs'
import { extractTitleFromMd } from '../file/parser.mjs'
import { cleanDisplayText } from '../text/index.mjs'
import { logger } from '../logger/index.mjs'
import { getDirectoryMeta, getFileMeta } from '../config/index.mjs'

function formatTextWithIcon(text, icon) {
  if (!text) {
    return ''
  }
  return icon ? `${icon} ${text}` : text
}

/**
 * 创建侧边栏项（支持多级嵌套）
 * @param {string} dirPath - 目录路径
 * @param {string} baseUrl - 基础 URL
 * @param {string} groupText - 分组文本
 * @param {object} options - 配置选项
 * @param {boolean} options.useTitle - 是否使用文件标题
 * @param {boolean} options.collapsed - 是否默认折叠
 * @param {number} options.maxDepth - 最大支持层级（默认无限）
 * @param {number} options.currentDepth - 当前深度（内部使用）
 * @returns {object|null} - 侧边栏项
 */
export function createSidebarItem(dirPath, baseUrl, groupText, options = {}) {
  const {
    useTitle = false,
    collapsed = false,
    maxDepth = Infinity,
    currentDepth = 0
  } = options

  // 检查是否超过最大深度
  if (currentDepth >= maxDepth) {
    logger.debug(`达到最大深度限制 ${maxDepth}，停止递归: ${dirPath}`)
    return null
  }

  const items = []
  const directoryMeta = getDirectoryMeta(dirPath)
  const sidebarMeta = {
    title: directoryMeta.title,
    icon: directoryMeta.icon,
    hidden: directoryMeta.hidden,
    ...(directoryMeta.sidebar || {})
  }

  if (sidebarMeta.hidden) {
    return null
  }

  const resolvedGroupText = formatTextWithIcon(
    sidebarMeta.title ?? groupText,
    sidebarMeta.icon
  ) || groupText
  
  // 1. 添加当前目录下的文件
  const files = getValidMarkdownFiles(dirPath, false)
  files.forEach(file => {
    const fileNameWithoutExt = file.replace(/\.md$/i, '')
    const filePath = path.join(dirPath, file)
    const fileMeta = getFileMeta(filePath)
    const sidebarFileMeta = {
      title: fileMeta.title,
      icon: fileMeta.icon,
      hidden: fileMeta.hidden,
      ...(fileMeta.sidebar || {})
    }

    if (sidebarFileMeta.hidden) {
      return
    }
    
    let text
    if (sidebarFileMeta.title) {
      text = sidebarFileMeta.title
    } else if (useTitle) {
      const titleFromFile = extractTitleFromMd(filePath)
      text = titleFromFile || cleanDisplayText(fileNameWithoutExt)
    } else {
      text = cleanDisplayText(fileNameWithoutExt)
    }

    const formattedText = formatTextWithIcon(text, sidebarFileMeta.icon)
    
    items.push({
      text: formattedText || text,
      link: `${baseUrl}/${fileNameWithoutExt}`
    })
  })

  // 2. 递归处理子目录
  if (currentDepth < maxDepth - 1) {
    const subDirs = getSubDirectories(dirPath)
    
    subDirs.forEach(subDir => {
      const subDirPath = path.join(dirPath, subDir)
      
      // 检查子目录是否有有效内容
      if (!hasValidMarkdownFiles(subDirPath) && !hasSubDirectories(subDirPath)) {
        return
      }
      
      const subBaseUrl = `${baseUrl}/${subDir}`
      const subGroupText = cleanDisplayText(subDir)
      
      // 递归创建子目录的侧边栏项
      const subItem = createSidebarItem(subDirPath, subBaseUrl, subGroupText, {
        useTitle,
        collapsed,
        maxDepth,
        currentDepth: currentDepth + 1
      })
      
      if (subItem) {
        items.push(subItem)
      }
    })
  }

  // 如果没有任何内容，返回 null
  if (items.length === 0) {
    return null
  }

  return {
    text: resolvedGroupText,
    items: items,
    collapsed: collapsed
  }
}

