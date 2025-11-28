/**
 * 路径配置模块
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 文档根目录路径
export const docsDir = path.resolve(__dirname, '../../../src')

