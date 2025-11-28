/**
 * 文件读取模块
 */

import fs from 'fs'
import { logger } from '../logger/index.mjs'
import { getCachedDir, setCachedDir } from '../cache/index.mjs'

/**
 * 安全读取目录（带缓存优化）
 * @param {string} dirPath - 目录路径
 * @param {object} options - 选项
 * @returns {Array} - 文件/目录列表
 */
export function safeReadDir(dirPath, options = {}) {
  try {
    if (!fs.existsSync(dirPath)) {
      logger.warn(`目录不存在: ${dirPath}`)
      return []
    }
    
    const stat = fs.statSync(dirPath)
    if (!stat.isDirectory()) {
      logger.warn(`路径不是目录: ${dirPath}`)
      return []
    }
    
    // 尝试从缓存获取（仅当 options 为空时使用缓存）
    if (Object.keys(options).length === 0) {
      const cached = getCachedDir(dirPath)
      if (cached !== undefined) {
        return cached
      }
    }
    
    const items = fs.readdirSync(dirPath, options)
    
    // 缓存结果（仅当 options 为空时）
    if (Object.keys(options).length === 0) {
      setCachedDir(dirPath, items)
    }
    
    return items
  } catch (error) {
    logger.error(`读取目录失败: ${dirPath}`, error.message)
    return []
  }
}

/**
 * 安全读取文件
 * @param {string} filePath - 文件路径
 * @param {string} encoding - 编码格式
 * @returns {string|null} - 文件内容
 */
export function safeReadFile(filePath, encoding = 'utf-8') {
  try {
    if (!fs.existsSync(filePath)) {
      logger.debug(`文件不存在: ${filePath}`)
      return null
    }
    
    const stat = fs.statSync(filePath)
    if (!stat.isFile()) {
      logger.debug(`路径不是文件: ${filePath}`)
      return null
    }
    
    return fs.readFileSync(filePath, encoding)
  } catch (error) {
    logger.error(`读取文件失败: ${filePath}`, error.message)
    return null
  }
}

