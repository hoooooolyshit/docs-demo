/**
 * 元数据解析模块
 * 支持通过 JSON 或 frontmatter 配置 nav / sidebar 展示
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { logger } from '../logger/index.mjs'

const META_FILE_NAMES = ['_meta.json', '.meta.json', '_config.json', '.config.json']
const INDEX_FILES = ['index.md', 'README.md', 'readme.md', 'Readme.md']

const directoryMetaCache = new Map()
const fileFrontmatterCache = new Map()

function createDefaultMeta() {
  return {
    title: null,
    icon: null,
    hidden: false,
    order: undefined,
    nav: {},
    sidebar: {}
  }
}

function mergeMeta(base, source = {}) {
  if (!source || typeof source !== 'object') {
    return base
  }

  const merged = { ...base }

  if (source.title !== undefined) {
    merged.title = source.title
  }
  if (source.icon !== undefined) {
    merged.icon = source.icon
  }
  if (source.hidden !== undefined) {
    merged.hidden = source.hidden
  }
  if (source.order !== undefined) {
    merged.order = source.order
  }

  merged.nav = {
    ...base.nav,
    ...(source.nav || {})
  }

  merged.sidebar = {
    ...base.sidebar,
    ...(source.sidebar || {})
  }

  return merged
}

function findMetaFile(dirPath) {
  for (const fileName of META_FILE_NAMES) {
    const metaPath = path.join(dirPath, fileName)
    if (fs.existsSync(metaPath)) {
      return metaPath
    }
  }
  return null
}

function findIndexFile(dirPath) {
  for (const fileName of INDEX_FILES) {
    const filePath = path.join(dirPath, fileName)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }
  return null
}

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    logger.warn(`解析 JSON 失败: ${filePath}`, error.message)
    return null
  }
}

export function getFileFrontmatter(filePath) {
  if (!filePath) {
    return null
  }

  if (fileFrontmatterCache.has(filePath)) {
    return fileFrontmatterCache.get(filePath)
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = matter(content)
    const data = parsed.data || {}
    fileFrontmatterCache.set(filePath, data)
    return data
  } catch (error) {
    logger.warn(`解析 frontmatter 失败: ${filePath}`, error.message)
    fileFrontmatterCache.set(filePath, null)
    return null
  }
}

export function getFileMeta(filePath) {
  const meta = createDefaultMeta()
  const frontmatter = getFileFrontmatter(filePath)
  if (frontmatter) {
    return mergeMeta(meta, frontmatter)
  }
  return meta
}

export function getDirectoryMeta(dirPath) {
  if (directoryMetaCache.has(dirPath)) {
    return directoryMetaCache.get(dirPath)
  }

  let meta = createDefaultMeta()

  // 1. 目录级 JSON 配置
  const metaFile = findMetaFile(dirPath)
  if (metaFile) {
    const data = readJson(metaFile)
    if (data) {
      meta = mergeMeta(meta, data)
    }
  }

  // 2. index/frontmatter 配置
  const indexFile = findIndexFile(dirPath)
  if (indexFile) {
    const frontmatter = getFileFrontmatter(indexFile)
    if (frontmatter) {
      meta = mergeMeta(meta, frontmatter)
    }
  }

  directoryMetaCache.set(dirPath, meta)
  return meta
}

export function clearMetadataCache() {
  directoryMetaCache.clear()
  fileFrontmatterCache.clear()
}

