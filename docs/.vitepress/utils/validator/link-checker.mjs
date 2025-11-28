/**
 * 断链检测模块
 */

import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { docsDir } from '../config/index.mjs'
import { logger } from '../logger/index.mjs'
import { safeReadFile, safeReadDir } from '../file/reader.mjs'
import { shouldIgnoreDir, shouldIgnoreFile } from '../file/filter.mjs'

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
const assetExtensions = [...imageExtensions, '.pdf', '.zip', '.mp4', '.mp3']

const absolutePathRegex = /^[a-zA-Z]:\\|^\\\\/
const externalLinkRegex = /^(https?:)?\/\//

export class BrokenLink {
  constructor(filePath, link, line, column, type, reason, suggestion = null) {
    this.filePath = filePath
    this.link = link
    this.line = line
    this.column = column
    this.type = type
    this.reason = reason
    this.suggestion = suggestion
  }
}

function extractLinks(content) {
  const links = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    let match
    while ((match = imageRegex.exec(line)) !== null) {
      const url = match[2].trim()
      const cleanUrl = url.replace(/\s+"[^"]*"$/, '').replace(/\s+'[^']*'$/, '')
      links.push({
        link: cleanUrl,
        line: lineNumber,
        column: match.index + match[0].indexOf('(') + 1,
        type: 'image'
      })
    }

    const fileLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    while ((match = fileLinkRegex.exec(line)) !== null) {
      const url = match[2].trim()
      const cleanUrl = url.replace(/\s+"[^"]*"$/, '').replace(/\s+'[^']*'$/, '')
      if (!line.substring(0, match.index).includes('![')) {
        links.push({
          link: cleanUrl,
          line: lineNumber,
          column: match.index + match[0].indexOf('(') + 1,
          type: 'file'
        })
      }
    }
  })

  return links
}

function isExternalLink(link) {
  return externalLinkRegex.test(link)
}

function isAbsolutePath(link) {
  return absolutePathRegex.test(link)
}

function normalizePath(link, basePath) {
  if (isExternalLink(link) || link.startsWith('#') || link.startsWith('mailto:')) {
    return null
  }

  // 移除查询参数和哈希
  const cleanLink = link.split('?')[0].split('#')[0]

  if (isAbsolutePath(cleanLink)) {
    return cleanLink
  }

  if (cleanLink.startsWith('./') || cleanLink.startsWith('../')) {
    return path.resolve(basePath, cleanLink)
  }

  if (cleanLink.startsWith('/')) {
    return path.resolve(docsDir, cleanLink.substring(1))
  }

  return path.resolve(basePath, cleanLink)
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

function getReasonText(reason) {
  const map = {
    not_found: '文件不存在',
    absolute_path: '使用了绝对路径（建议改为相对路径）',
    external: '外部链接',
    invalid: '无效链接'
  }
  return map[reason] || reason
}

function generateSuggestion(link, basePath) {
  if (isAbsolutePath(link)) {
    const relative = path.relative(basePath, link)
    if (!relative.startsWith('..')) {
      return relative.replace(/\\/g, '/')
    }
  } else {
    const normalized = normalizePath(link, basePath)
    if (normalized && fileExists(normalized)) {
      return path.relative(basePath, normalized).replace(/\\/g, '/')
    }
  }
  return null
}

function validateLink(linkInfo, filePath) {
  const basePath = path.dirname(filePath)
  const { link, line, column, type } = linkInfo

  if (isExternalLink(link) || link.startsWith('#') || link.startsWith('mailto:')) {
    return null
  }

  if (isAbsolutePath(link)) {
    return new BrokenLink(filePath, link, line, column, type, 'absolute_path', generateSuggestion(link, basePath))
  }

  const normalizedPath = normalizePath(link, basePath)
  if (!normalizedPath) {
    return null
  }

  if (!fileExists(normalizedPath)) {
    return new BrokenLink(filePath, link, line, column, type, 'not_found', generateSuggestion(normalizedPath, basePath))
  }

  return null
}

export function checkFileLinks(filePath) {
  const brokenLinks = []

  if (shouldIgnoreFile(path.basename(filePath))) {
    return brokenLinks
  }

  const content = safeReadFile(filePath)
  if (!content) {
    return brokenLinks
  }

  const links = extractLinks(content)
  links.forEach(linkInfo => {
    const ext = path.extname(linkInfo.link).toLowerCase()
    if (assetExtensions.includes(ext)) {
      const brokenLink = validateLink(linkInfo, filePath)
      if (brokenLink) {
        brokenLinks.push(brokenLink)
      }
    }
  })

  return brokenLinks
}

function checkDirectoryLinks(dirPath, options = {}, currentDepth = 0) {
  const { maxDepth = Infinity } = options
  const brokenLinks = []

  if (currentDepth >= maxDepth) {
    return brokenLinks
  }

  const entries = safeReadDir(dirPath, { withFileTypes: true })

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      if (shouldIgnoreDir(entry.name)) {
        return
      }
      const subDir = path.join(dirPath, entry.name)
      const result = checkDirectoryLinks(subDir, options, currentDepth + 1)
      brokenLinks.push(...result)
    } else if (entry.isFile() && entry.name.endsWith('.md') && !shouldIgnoreFile(entry.name)) {
      const filePath = path.join(dirPath, entry.name)
      const result = checkFileLinks(filePath)
      brokenLinks.push(...result)
    }
  })

  return brokenLinks
}

export function checkAllLinks(options = {}) {
  logger.info('开始检测断链...')
  const brokenLinks = checkDirectoryLinks(docsDir, options)
  logger.info(`检测完成，发现 ${brokenLinks.length} 个断链`)
  return brokenLinks
}

export function generateReport(brokenLinks) {
  if (brokenLinks.length === 0) {
    return '✅ 未发现断链！'
  }

  const report = []
  report.push(`\n❌ 发现 ${brokenLinks.length} 个断链：\n`)

  const byFile = {}
  brokenLinks.forEach(link => {
    if (!byFile[link.filePath]) {
      byFile[link.filePath] = []
    }
    byFile[link.filePath].push(link)
  })

  Object.entries(byFile).forEach(([filePath, links]) => {
    const relativePath = path.relative(docsDir, filePath)
    report.push(`\n📄 ${relativePath}`)
    
    links.forEach(link => {
      report.push(`  ❌ 第 ${link.line} 行，第 ${link.column} 列`)
      report.push(`     链接: ${link.link}`)
      report.push(`     类型: ${link.type === 'image' ? '图片' : '文件'}`)
      report.push(`     原因: ${getReasonText(link.reason)}`)
      if (link.suggestion) {
        report.push(`     💡 建议: ${link.suggestion}`)
      }
      report.push('')
    })
  })

  return report.join('\n')
}

