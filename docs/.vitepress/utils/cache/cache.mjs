/**
 * 缓存模块
 * 提供文件读取、标题提取等操作的缓存功能
 */

import fs from 'fs'
import { logger } from '../logger/index.mjs'

/**
 * 缓存配置
 */
const CACHE_CONFIG = {
  MAX_SIZE: 1000,           // 最大缓存条目数
  ENABLE_STAT_CACHE: true,  // 是否启用文件状态缓存
  ENABLE_TITLE_CACHE: true, // 是否启用标题提取缓存
  ENABLE_DIR_CACHE: true    // 是否启用目录读取缓存
}

/**
 * 标题提取缓存
 * key: 文件路径
 * value: { title: string|null, mtime: number }
 */
const titleCache = new Map()

/**
 * 文件状态缓存
 * key: 文件路径
 * value: { stat: fs.Stats, mtime: number }
 */
const statCache = new Map()

/**
 * 目录读取缓存
 * key: 目录路径
 * value: { items: Array, mtime: number }
 */
const dirCache = new Map()

/**
 * 缓存统计信息
 */
const cacheStats = {
  titleHits: 0,
  titleMisses: 0,
  statHits: 0,
  statMisses: 0,
  dirHits: 0,
  dirMisses: 0
}

/**
 * 获取文件修改时间
 * @param {string} filePath - 文件路径
 * @returns {number|null} - 修改时间戳
 */
function getFileMtime(filePath) {
  try {
    const stat = fs.statSync(filePath)
    return stat.mtimeMs
  } catch (error) {
    return null
  }
}

/**
 * 清理最旧的缓存项（LRU 策略简化版）
 * @param {Map} cache - 缓存 Map
 * @param {number} maxSize - 最大大小
 */
function evictOldest(cache, maxSize) {
  if (cache.size <= maxSize) {
    return
  }
  
  // 删除最旧的项（简化版：删除第一个）
  const firstKey = cache.keys().next().value
  if (firstKey) {
    cache.delete(firstKey)
  }
}

/**
 * 获取缓存的标题
 * @param {string} filePath - 文件路径
 * @returns {string|null|undefined} - 缓存的标题，undefined 表示未命中
 */
export function getCachedTitle(filePath) {
  if (!CACHE_CONFIG.ENABLE_TITLE_CACHE) {
    return undefined
  }

  const cached = titleCache.get(filePath)
  if (!cached) {
    cacheStats.titleMisses++
    return undefined
  }

  // 检查文件是否被修改
  const currentMtime = getFileMtime(filePath)
  if (currentMtime === null || currentMtime !== cached.mtime) {
    // 文件已修改，删除缓存
    titleCache.delete(filePath)
    cacheStats.titleMisses++
    return undefined
  }

  cacheStats.titleHits++
  return cached.title
}

/**
 * 设置标题缓存
 * @param {string} filePath - 文件路径
 * @param {string|null} title - 标题
 */
export function setCachedTitle(filePath, title) {
  if (!CACHE_CONFIG.ENABLE_TITLE_CACHE) {
    return
  }

  const mtime = getFileMtime(filePath)
  if (mtime === null) {
    return
  }

  evictOldest(titleCache, CACHE_CONFIG.MAX_SIZE)
  titleCache.set(filePath, { title, mtime })
}

/**
 * 获取缓存的文件状态
 * @param {string} filePath - 文件路径
 * @returns {fs.Stats|undefined} - 文件状态，undefined 表示未命中
 */
export function getCachedStat(filePath) {
  if (!CACHE_CONFIG.ENABLE_STAT_CACHE) {
    return undefined
  }

  const cached = statCache.get(filePath)
  if (!cached) {
    cacheStats.statMisses++
    return undefined
  }

  // 检查文件是否被修改
  const currentMtime = getFileMtime(filePath)
  if (currentMtime === null || currentMtime !== cached.mtime) {
    // 文件已修改，删除缓存
    statCache.delete(filePath)
    cacheStats.statMisses++
    return undefined
  }

  cacheStats.statHits++
  return cached.stat
}

/**
 * 设置文件状态缓存
 * @param {string} filePath - 文件路径
 * @param {fs.Stats} stat - 文件状态
 */
export function setCachedStat(filePath, stat) {
  if (!CACHE_CONFIG.ENABLE_STAT_CACHE) {
    return
  }

  const mtime = stat.mtimeMs
  evictOldest(statCache, CACHE_CONFIG.MAX_SIZE)
  statCache.set(filePath, { stat, mtime })
}

/**
 * 获取缓存的目录内容
 * @param {string} dirPath - 目录路径
 * @returns {Array|undefined} - 目录内容，undefined 表示未命中
 */
export function getCachedDir(dirPath) {
  if (!CACHE_CONFIG.ENABLE_DIR_CACHE) {
    return undefined
  }

  const cached = dirCache.get(dirPath)
  if (!cached) {
    cacheStats.dirMisses++
    return undefined
  }

  // 检查目录是否被修改
  const currentMtime = getFileMtime(dirPath)
  if (currentMtime === null || currentMtime !== cached.mtime) {
    // 目录已修改，删除缓存
    dirCache.delete(dirPath)
    cacheStats.dirMisses++
    return undefined
  }

  cacheStats.dirHits++
  return cached.items
}

/**
 * 设置目录内容缓存
 * @param {string} dirPath - 目录路径
 * @param {Array} items - 目录内容
 */
export function setCachedDir(dirPath, items) {
  if (!CACHE_CONFIG.ENABLE_DIR_CACHE) {
    return
  }

  const mtime = getFileMtime(dirPath)
  if (mtime === null) {
    return
  }

  evictOldest(dirCache, CACHE_CONFIG.MAX_SIZE)
  dirCache.set(dirPath, { items, mtime })
}

/**
 * 清除所有缓存
 */
export function clearCache() {
  titleCache.clear()
  statCache.clear()
  dirCache.clear()
  
  // 重置统计
  cacheStats.titleHits = 0
  cacheStats.titleMisses = 0
  cacheStats.statHits = 0
  cacheStats.statMisses = 0
  cacheStats.dirHits = 0
  cacheStats.dirMisses = 0
  
  logger.info('缓存已清除')
}

/**
 * 获取缓存统计信息
 * @returns {object} - 缓存统计
 */
export function getCacheStats() {
  const totalTitle = cacheStats.titleHits + cacheStats.titleMisses
  const totalStat = cacheStats.statHits + cacheStats.statMisses
  const totalDir = cacheStats.dirHits + cacheStats.dirMisses

  return {
    title: {
      hits: cacheStats.titleHits,
      misses: cacheStats.titleMisses,
      hitRate: totalTitle > 0 ? (cacheStats.titleHits / totalTitle * 100).toFixed(2) + '%' : '0%',
      size: titleCache.size
    },
    stat: {
      hits: cacheStats.statHits,
      misses: cacheStats.statMisses,
      hitRate: totalStat > 0 ? (cacheStats.statHits / totalStat * 100).toFixed(2) + '%' : '0%',
      size: statCache.size
    },
    dir: {
      hits: cacheStats.dirHits,
      misses: cacheStats.dirMisses,
      hitRate: totalDir > 0 ? (cacheStats.dirHits / totalDir * 100).toFixed(2) + '%' : '0%',
      size: dirCache.size
    },
    total: {
      titleSize: titleCache.size,
      statSize: statCache.size,
      dirSize: dirCache.size,
      totalSize: titleCache.size + statCache.size + dirCache.size
    }
  }
}

/**
 * 设置缓存配置
 * @param {object} config - 配置选项
 */
export function setCacheConfig(config) {
  Object.assign(CACHE_CONFIG, config)
  logger.info('缓存配置已更新', CACHE_CONFIG)
}

/**
 * 获取缓存配置
 * @returns {object} - 当前配置
 */
export function getCacheConfig() {
  return { ...CACHE_CONFIG }
}

