/**
 * 文件解析模块
 */

import { safeReadFile } from './reader.mjs'
import { logger } from '../logger/index.mjs'
import { getCachedTitle, setCachedTitle } from '../cache/index.mjs'

/**
 * 从 Markdown 文件中提取标题（带缓存）
 * @param {string} filePath - 文件路径
 * @returns {string|null} - 提取的标题
 */
export function extractTitleFromMd(filePath) {
  // 尝试从缓存获取
  const cachedTitle = getCachedTitle(filePath)
  if (cachedTitle !== undefined) {
    return cachedTitle
  }

  // 缓存未命中，读取文件并提取标题
  const content = safeReadFile(filePath)
  if (!content) {
    return null
  }
  
  let title = null
  
  try {
    // 1. 尝试提取 frontmatter 中的 title
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1]
      // 支持多种 title 格式
      const titleMatch = frontmatter.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)
      if (titleMatch) {
        title = titleMatch[1].trim()
      }
    }
    
    // 2. 提取第一个 # 标题
    if (!title) {
      const h1Match = content.match(/^#\s+(.+)$/m)
      if (h1Match) {
        title = h1Match[1].trim()
      }
    }
    
    // 3. 如果没有 # 标题，尝试 ## 标题
    if (!title) {
      const h2Match = content.match(/^##\s+(.+)$/m)
      if (h2Match) {
        title = h2Match[1].trim()
      }
    }
  } catch (error) {
    logger.error(`提取标题失败: ${filePath}`, error.message)
    return null
  }

  // 缓存结果（包括 null）
  setCachedTitle(filePath, title)
  
  return title
}

