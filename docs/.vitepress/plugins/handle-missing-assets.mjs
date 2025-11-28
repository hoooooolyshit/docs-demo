/**
 * Vite 插件：优雅处理缺失的资源链接
 * 当图片或其他资源不存在时，不会导致构建失败，而是使用明显的占位符
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsSrcDir = path.resolve(__dirname, '../../src')

/**
 * 检查文件是否存在
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

/**
 * 规范化路径
 */
function normalizePath(id) {
  // 移除查询参数和哈希
  const cleanId = id.split('?')[0].split('#')[0]
  
  // 处理 Windows 绝对路径（如 E:\target\java\xxx.png）
  if (cleanId.match(/^[A-Z]:\\/i) || cleanId.startsWith('\\')) {
    // 尝试从绝对路径中提取相对路径部分
    // 例如: E:\target\java\xxx.png -> target/java/xxx.png
    if (cleanId.includes('target')) {
      const targetIndex = cleanId.indexOf('target')
      const relativePart = cleanId.substring(targetIndex)
      return path.resolve(docsSrcDir, relativePart)
    }
    return cleanId
  }
  
  // 处理相对路径
  if (cleanId.startsWith('./') || cleanId.startsWith('../')) {
    return path.resolve(docsSrcDir, cleanId)
  }
  
  // 处理以 / 开头的路径
  if (cleanId.startsWith('/')) {
    return path.resolve(docsSrcDir, cleanId.substring(1))
  }
  
  // 处理普通文件名（相对于当前目录）
  if (!cleanId.includes('/') && !cleanId.includes('\\')) {
    return path.resolve(docsSrcDir, cleanId)
  }
  
  return null
}

/**
 * 生成明显的占位符图片（显示"图片缺失"）
 * @param {string} originalPath - 原始路径
 * @returns {string} - Data URL 格式的 SVG
 */
function generatePlaceholder(originalPath = '') {
  const fileName = path.basename(originalPath) || '图片'
  // 截断过长的文件名
  const displayName = fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName
  
  // 生成一个显示"图片缺失"的 SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f5f5f5" stroke="#ddd" stroke-width="2" rx="4"/>
      <text x="200" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#999">
        📷
      </text>
      <text x="200" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#999" font-weight="bold">
        图片缺失
      </text>
      <text x="200" y="125" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#bbb">
        ${displayName}
      </text>
      <text x="200" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#ccc">
        路径不存在或无法访问
      </text>
    </svg>
  `.trim()
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function toPosixAssetPath(winPath = '') {
  if (!winPath) return winPath
  // 替换反斜杠并移除盘符
  const replaced = winPath.replace(/\\/g, '/').replace(/^[A-Za-z]:/, '')
  // 确保以 / 开头，方便被 Vite 解析为根相对路径
  return replaced.startsWith('/') ? replaced : `/${replaced}`
}

function sanitizeWindowsAbsoluteReferences(code) {
  const windowsPathRegex = /[A-Za-z]:\\[^\s'")]+/g
  return code.replace(windowsPathRegex, match => toPosixAssetPath(match))
}

/**
 * Vite 插件：处理缺失的资源
 */
export function handleMissingAssets() {
  const isDev = process.env.NODE_ENV === 'development'
  const missingAssets = new Set()
  
  return {
    name: 'handle-missing-assets',
    enforce: 'pre',
    
    resolveId(id, importer) {
      // 只处理图片和其他资源文件
      const isAsset = /\.(png|jpg|jpeg|gif|svg|webp|ico|pdf|zip|mp4|mp3)$/i.test(id)
      if (!isAsset) {
        return null
      }
      
      // 跳过外部链接
      if (id.startsWith('http://') || id.startsWith('https://') || id.startsWith('//')) {
        return null
      }
      
      // 规范化路径
      const normalizedPath = normalizePath(id)
      if (!normalizedPath) {
        return null
      }
      
      // 检查文件是否存在
      if (!fileExists(normalizedPath)) {
        // 记录缺失的资源
        if (!missingAssets.has(id)) {
          missingAssets.add(id)
          
          // 开发模式下输出警告
          if (isDev) {
            console.warn(`⚠️  资源不存在: ${id}`)
            if (importer) {
              const relativeImporter = path.relative(process.cwd(), importer)
              console.warn(`   来源文件: ${relativeImporter}`)
            }
          }
        }
        
        // 返回虚拟模块 ID
        return `\0missing-asset:${id}`
      }
      
      return null
    },
    
    transform(code, id) {
      // 在 Markdown 转 Vue 之前，将 Windows 绝对路径转换为可解析的相对路径
      if (id.endsWith('.md') && code.includes(':\\')) {
        const sanitized = sanitizeWindowsAbsoluteReferences(code)
        if (sanitized !== code) {
          return {
            code: sanitized,
            map: null
          }
        }
      }
      return null
    },
    
    load(id) {
      // 处理缺失的资源
      if (id.startsWith('\0missing-asset:')) {
        const originalPath = id.replace('\0missing-asset:', '')
        // 返回明显的占位符
        return `export default ${JSON.stringify(generatePlaceholder(originalPath))}`
      }
      return null
    },
    
    buildEnd() {
      // 构建结束时输出统计
      if (missingAssets.size > 0) {
        console.warn(`\n⚠️  共发现 ${missingAssets.size} 个缺失的资源，已使用占位符替代`)
        if (isDev) {
          console.warn('💡 提示: 请检查并修复这些资源路径\n')
        }
      }
    }
  }
}

