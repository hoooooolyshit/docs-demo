/**
 * 目录操作模块
 */

import path from 'path'
import fs from 'fs'
import { safeReadDir } from './reader.mjs'
import { shouldIgnoreDir, shouldIgnoreFile, isMarkdownFile } from './filter.mjs'
import { naturalSort, encodeURL } from '../text/index.mjs'
import { normalizeFileName } from '../text/index.mjs'
import { SPECIAL_FILES } from '../config/index.mjs'
import { logger } from '../logger/index.mjs'
import { getCachedStat, setCachedStat } from '../cache/index.mjs'

/**
 * 检查目录是否包含子目录
 * @param {string} dirPath - 目录路径
 * @returns {boolean} - 是否包含子目录
 */
export function hasSubDirectories(dirPath) {
  const items = safeReadDir(dirPath, { withFileTypes: true })
  return items.some(item => 
    item.isDirectory() && 
    !shouldIgnoreDir(item.name)
  )
}

/**
 * 检查目录是否包含有效的 Markdown 文件
 * @param {string} dirPath - 目录路径
 * @returns {boolean} - 是否包含有效的 Markdown 文件
 */
export function hasValidMarkdownFiles(dirPath) {
  const items = safeReadDir(dirPath, { withFileTypes: true })
  return items.some(item => 
    item.isFile() && 
    isMarkdownFile(item.name) &&
    !shouldIgnoreFile(item.name)
  )
}

/**
 * 获取目录中的有效 Markdown 文件列表（带缓存优化）
 * @param {string} dirPath - 目录路径
 * @param {boolean} includeIndex - 是否包含 index.md
 * @returns {Array<string>} - 文件名列表
 */
export function getValidMarkdownFiles(dirPath, includeIndex = false) {
  const allFiles = safeReadDir(dirPath)
  
  const files = allFiles
    .filter(file => {
      const filePath = path.join(dirPath, file)
      
      let stat
      try {
        // 尝试从缓存获取文件状态
        stat = getCachedStat(filePath)
        
        if (!stat) {
          stat = fs.statSync(filePath)
          setCachedStat(filePath, stat)
        }
      } catch (error) {
        logger.warn(`无法获取文件状态: ${filePath}`)
        return false
      }
      
      if (!stat.isFile() || !isMarkdownFile(file)) {
        return false
      }
      
      if (shouldIgnoreFile(file)) {
        return false
      }
      
      const normalizedFile = normalizeFileName(file, SPECIAL_FILES)
      
      if (!includeIndex && normalizedFile === 'index.md') {
        return false
      }
      
      return true
    })
    .sort(naturalSort)
  
  return files
}

/**
 * 检查目录是否有 index 文件
 * @param {string} dirPath - 目录路径
 * @returns {boolean} - 是否有 index 文件
 */
export function hasIndexFile(dirPath) {
  return fs.existsSync(path.join(dirPath, 'index.md')) ||
         fs.existsSync(path.join(dirPath, 'README.md')) ||
         fs.existsSync(path.join(dirPath, 'readme.md')) ||
         fs.existsSync(path.join(dirPath, 'Readme.md'))
}

/**
 * 获取目录的第一个有效链接
 * @param {string} dirPath - 目录的完整路径
 * @param {string} relativePath - 相对路径
 * @returns {string|null} - 链接地址
 */
export function getFirstLink(dirPath, relativePath) {
  // 优先使用 index 文件
  if (hasIndexFile(dirPath)) {
    return relativePath + '/'
  }
  
  // 查找第一个有效的 markdown 文件
  const files = getValidMarkdownFiles(dirPath, false)
  
  if (files.length > 0) {
    const firstFile = files[0].replace(/\.md$/i, '')
    const encodedFile = encodeURL(firstFile)
    return `${relativePath}/${encodedFile}`
  }
  
  logger.debug(`目录无有效链接: ${dirPath}`)
  return null
}

/**
 * 获取子目录列表
 * @param {string} dirPath - 目录路径
 * @returns {Array<string>} - 子目录列表
 */
export function getSubDirectories(dirPath) {
  return safeReadDir(dirPath, { withFileTypes: true })
    .filter(dirent => 
      dirent.isDirectory() && 
      !shouldIgnoreDir(dirent.name)
    )
    .map(dirent => dirent.name)
    .sort(naturalSort)
}

