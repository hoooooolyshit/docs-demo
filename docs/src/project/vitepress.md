好的！这是完整的自动生成导航和侧边栏的脚本代码，包含详细注释：

```js
// .vitepress/utils/autoGenerate.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ============================================================================
// 路径配置
// ============================================================================

// 获取当前文件的路径（ESM 模块中需要手动构建 __dirname）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 文档根目录路径（假设文档在 src 目录下）
const docsDir = path.resolve(__dirname, '../src')

// ============================================================================
// 常量配置
// ============================================================================

/**
 * 需要忽略的目录列表
 * 这些目录不会出现在导航和侧边栏中
 */
const IGNORE_DIRS = [
  'assets',        // 资源文件目录
  'public',        // 公共文件目录
  'node_modules',  // Node.js 依赖目录
  '.vitepress'     // VitePress 配置目录
]

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 判断是否应该忽略某个目录
 * @param {string} dirName - 目录名称
 * @returns {boolean} - 是否应该忽略
 */
function shouldIgnoreDir(dirName) {
  return IGNORE_DIRS.includes(dirName) ||  // 在忽略列表中
         dirName.endsWith('assets') ||      // 以 assets 结尾
         dirName.startsWith('.')            // 以 . 开头（隐藏目录）
}

/**
 * 判断是否为 Markdown 文件
 * @param {string} fileName - 文件名
 * @returns {boolean} - 是否为 Markdown 文件
 */
function isMarkdownFile(fileName) {
  return fileName.endsWith('.md')
}

/**
 * 自然排序函数（支持中文、英文和数字）
 * @param {string} a - 第一个字符串
 * @param {string} b - 第二个字符串
 * @returns {number} - 排序结果
 * 
 * 示例：
 * ['10-Vue', '02-React', '01-基础'].sort(naturalSort)
 * => ['01-基础', '02-React', '10-Vue']
 */
function naturalSort(a, b) {
  return a.localeCompare(b, 'zh-CN', {
    numeric: true,      // 数字按数值大小排序（10 > 2）
    sensitivity: 'base' // 不区分大小写
  })
}

/**
 * 清理显示文本（去掉数字前缀）
 * @param {string} text - 原始文本
 * @returns {string} - 清理后的文本
 * 
 * 示例：
 * cleanDisplayText('01-Vue') => 'Vue'
 * cleanDisplayText('02-React基础') => 'React基础'
 */
function cleanDisplayText(text) {
  // 使用正则表达式去掉开头的 "数字-" 格式
  return text.replace(/^\d+-/, '')
}

/**
 * 从 Markdown 文件中提取第一个标题
 * @param {string} filePath - 文件路径
 * @returns {string|null} - 提取的标题，如果没有则返回 null
 * 
 * 示例：
 * 文件内容：# Vue 基础知识
 * 返回：'Vue 基础知识'
 */
function extractTitleFromMd(filePath) {
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 匹配第一个 # 标题（^# 表示行首的 #）
    const match = content.match(/^#\s+(.+)$/m)
    
    return match ? match[1] : null
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error)
    return null
  }
}

/**
 * 获取目录的链接地址
 * @param {string} firstDir - 一级目录名
 * @param {string} secondDir - 二级目录名
 * @param {string} secondDirPath - 二级目录的完整路径
 * @returns {string|null} - 链接地址，如果没有有效链接则返回 null
 * 
 * 逻辑：
 * 1. 如果有 index.md，链接到目录（如：/前端/Vue/）
 * 2. 如果没有 index.md，链接到第一个 markdown 文件（如：/前端/Vue/基础知识）
 * 3. 如果没有任何 markdown 文件，返回 null
 */
function getDirLink(firstDir, secondDir, secondDirPath) {
  // 检查是否存在 index.md
  const hasIndex = fs.existsSync(path.join(secondDirPath, 'index.md'))
  
  if (hasIndex) {
    // 有 index.md，链接到目录
    return `/${firstDir}/${secondDir}/`
  }
  
  // 没有 index.md，查找第一个 markdown 文件
  const files = fs.readdirSync(secondDirPath)
    .filter(file => {
      const filePath = path.join(secondDirPath, file)
      const stat = fs.statSync(filePath)
      // 只要是文件且是 markdown 格式
      return stat.isFile() && isMarkdownFile(file)
    })
    .sort(naturalSort) // 按自然排序
  
  if (files.length > 0) {
    // 取第一个文件，去掉 .md 后缀
    const firstFile = files[0].replace('.md', '')
    return `/${firstDir}/${secondDir}/${firstFile}`
  }
  
  // 没有任何 markdown 文件
  return null
}

// ============================================================================
// 主要功能函数
// ============================================================================

/**
 * 生成导航配置
 * @returns {Array<{text: string, items: Array<{text: string, link: string}>}>} - 导航配置数组
 * 
 * 返回格式：
 * [
 *   {
 *     text: '前端',
 *     items: [
 *       { text: 'Vue', link: '/01-前端/01-Vue/' },
 *       { text: 'React', link: '/01-前端/02-React/' }
 *     ]
 *   },
 *   ...
 * ]
 */
export function generateNav() {
  const nav = []
  
  // 读取一级目录（如：前端、后端、数据库）
  const firstLevelDirs = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(dirent => 
      dirent.isDirectory() &&           // 必须是目录
      !shouldIgnoreDir(dirent.name)     // 不在忽略列表中
    )
    .map(dirent => dirent.name)         // 只要目录名
    .sort(naturalSort)                  // 按自然排序

  // 遍历每个一级目录
  firstLevelDirs.forEach(firstDir => {
    const firstDirPath = path.join(docsDir, firstDir)
    
    // 读取二级目录（如：Vue、React、Angular）
    const secondLevelDirs = fs.readdirSync(firstDirPath, { withFileTypes: true })
      .filter(dirent => 
        dirent.isDirectory() && 
        !shouldIgnoreDir(dirent.name)
      )
      .map(dirent => dirent.name)
      .sort(naturalSort)                // 按自然排序

    // 如果没有二级目录，跳过这个一级目录
    if (secondLevelDirs.length === 0) return

    // 创建导航项
    const navItem = {
      text: cleanDisplayText(firstDir),  // 显示文本（去掉数字前缀）
      items: []
    }

    // 遍历每个二级目录
    secondLevelDirs.forEach(secondDir => {
      const secondDirPath = path.join(firstDirPath, secondDir)
      
      // 获取这个目录的链接地址
      const link = getDirLink(firstDir, secondDir, secondDirPath)

      // 只有当有有效链接时才添加到导航
      if (link) {
        navItem.items.push({
          text: cleanDisplayText(secondDir),  // 显示文本（去掉数字前缀）
          link: link                          // 链接地址（保留数字前缀）
        })
      }
    })

    // 只有当有子项时才添加到导航
    if (navItem.items.length > 0) {
      nav.push(navItem)
    }
  })

  return nav
}

/**
 * 生成侧边栏配置（基础版本：使用文件名作为标题）
 * @returns {{[key: string]: Array<{text: string, items: Array<{text: string, link: string}>}>}} - 侧边栏配置对象
 * 
 * 返回格式：
 * {
 *   '/01-前端/01-Vue/': [
 *     {
 *       text: 'Vue',
 *       items: [
 *         { text: '基础知识', link: '/01-前端/01-Vue/01-基础知识' },
 *         { text: '组件开发', link: '/01-前端/01-Vue/02-组件开发' }
 *       ]
 *     }
 *   ],
 *   ...
 * }
 */
export function generateSidebar() {
  /** @type {{[key: string]: Array<{text: string, items: Array<{text: string, link: string}>}>}} */
  const sidebar = {}
  
  // 读取一级目录
  const firstLevelDirs = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(dirent => 
      dirent.isDirectory() && 
      !shouldIgnoreDir(dirent.name)
    )
    .map(dirent => dirent.name)
    .sort(naturalSort)

  // 遍历每个一级目录
  firstLevelDirs.forEach(firstDir => {
    const firstDirPath = path.join(docsDir, firstDir)
    
    // 读取二级目录
    const secondLevelDirs = fs.readdirSync(firstDirPath, { withFileTypes: true })
      .filter(dirent => 
        dirent.isDirectory() && 
        !shouldIgnoreDir(dirent.name)
      )
      .map(dirent => dirent.name)
      .sort(naturalSort)

    // 遍历每个二级目录
    secondLevelDirs.forEach(secondDir => {
      const secondDirPath = path.join(firstDirPath, secondDir)
      
      // 读取目录下的所有 markdown 文件（排除 index.md）
      const files = fs.readdirSync(secondDirPath)
        .filter(file => {
          const filePath = path.join(secondDirPath, file)
          const stat = fs.statSync(filePath)
          return stat.isFile() &&           // 必须是文件
                 isMarkdownFile(file) &&    // 必须是 markdown 文件
                 file !== 'index.md'        // 排除 index.md
        })
        .sort(naturalSort)                  // 按自然排序

      // 侧边栏的 key（如：/01-前端/01-Vue/）
      const sidebarKey = `/${firstDir}/${secondDir}/`
      
      // 初始化侧边栏数组
      if (!sidebar[sidebarKey]) {
        sidebar[sidebarKey] = []
      }

      // 为每个文件创建侧边栏项
      const items = files.map(file => {
        const fileNameWithoutExt = file.replace('.md', '')  // 去掉 .md 后缀
        const text = cleanDisplayText(fileNameWithoutExt)   // 去掉数字前缀
        
        return {
          text: text,                                       // 显示文本
          link: `/${firstDir}/${secondDir}/${fileNameWithoutExt}`  // 链接地址
        }
      })

      // 只有当有文件时才添加到侧边栏
      if (items.length > 0) {
        sidebar[sidebarKey] = [
          {
            text: cleanDisplayText(secondDir),  // 分组标题
            items: items                        // 分组内容
          }
        ]
      }
    })
  })

  return sidebar
}

/**
 * 生成侧边栏配置（增强版本：使用文件内的标题）
 * @returns {{[key: string]: Array<{text: string, items: Array<{text: string, link: string}>}>}} - 侧边栏配置对象
 * 
 * 与基础版本的区别：
 * - 基础版本：使用文件名作为侧边栏文本（如：01-基础知识.md => 基础知识）
 * - 增强版本：读取文件内的第一个 # 标题作为侧边栏文本
 * 
 * 优点：更灵活，标题可以和文件名不同
 * 缺点：需要读取文件内容，性能稍差
 */
export function generateSidebarWithTitle() {
  /** @type {{[key: string]: Array<{text: string, items: Array<{text: string, link: string}>}>}} */
  const sidebar = {}
  
  // 读取一级目录
  const firstLevelDirs = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(dirent => 
      dirent.isDirectory() && 
      !shouldIgnoreDir(dirent.name)
    )
    .map(dirent => dirent.name)
    .sort(naturalSort)

  // 遍历每个一级目录
  firstLevelDirs.forEach(firstDir => {
    const firstDirPath = path.join(docsDir, firstDir)
    
    // 读取二级目录
    const secondLevelDirs = fs.readdirSync(firstDirPath, { withFileTypes: true })
      .filter(dirent => 
        dirent.isDirectory() && 
        !shouldIgnoreDir(dirent.name)
      )
      .map(dirent => dirent.name)
      .sort(naturalSort)

    // 遍历每个二级目录
    secondLevelDirs.forEach(secondDir => {
      const secondDirPath = path.join(firstDirPath, secondDir)
      
      // 读取目录下的所有 markdown 文件（排除 index.md）
      const files = fs.readdirSync(secondDirPath)
        .filter(file => {
          const filePath = path.join(secondDirPath, file)
          const stat = fs.statSync(filePath)
          return stat.isFile() && 
                 isMarkdownFile(file) && 
                 file !== 'index.md'
        })
        .sort(naturalSort)

      // 侧边栏的 key
      const sidebarKey = `/${firstDir}/${secondDir}/`
      
      // 初始化侧边栏数组
      if (!sidebar[sidebarKey]) {
        sidebar[sidebarKey] = []
      }

      // 为每个文件创建侧边栏项
      const items = files.map(file => {
        const fileNameWithoutExt = file.replace('.md', '')
        const filePath = path.join(secondDirPath, file)
        
        // 尝试从文件中提取标题
        const titleFromFile = extractTitleFromMd(filePath)
        
        // 优先使用文件内的标题，如果没有则使用文件名
        const text = titleFromFile || cleanDisplayText(fileNameWithoutExt)
        
        return {
          text: text,
          link: `/${firstDir}/${secondDir}/${fileNameWithoutExt}`
        }
      })

      // 只有当有文件时才添加到侧边栏
      if (items.length > 0) {
        sidebar[sidebarKey] = [
          {
            text: cleanDisplayText(secondDir),
            items: items
          }
        ]
      }
    })
  })

  return sidebar
}

// ============================================================================
// 使用示例（在 config.mts 中导入使用）
// ============================================================================

/*
// .vitepress/config.mts

import { generateNav, generateSidebar, generateSidebarWithTitle } from './utils/autoGenerate.mjs'

export default {
  themeConfig: {
    nav: generateNav(),                    // 自动生成导航
    sidebar: generateSidebar()             // 自动生成侧边栏（使用文件名）
    // sidebar: generateSidebarWithTitle() // 或使用增强版本（使用文件内标题）
  }
}
*/
```

## 使用方法

### 1. 在 `config.mts` 中导入

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress'
import { generateNav, generateSidebar } from './utils/autoGenerate.mjs'

export default defineConfig({
  title: "我的文档站",
  description: "一个很棒的文档站点",
  
  themeConfig: {
    // 自动生成导航
    nav: generateNav(),
    
    // 自动生成侧边栏（二选一）
    sidebar: generateSidebar(),              // 方式1：使用文件名作为标题
    // sidebar: generateSidebarWithTitle(),  // 方式2：使用文件内的 # 标题
    
    // 其他配置...
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/yourrepo' }
    ]
  }
})
```

### 2. 目录结构示例

```
src/
├── 01-前端/
│   ├── 01-Vue/
│   │   ├── index.md              # 可选：目录首页
│   │   ├── 01-基础知识.md
│   │   ├── 02-组件开发.md
│   │   └── 03-路由管理.md
│   ├── 02-React/
│   │   ├── 01-快速开始.md
│   │   └── 02-Hooks详解.md
│   └── 03-TypeScript/
│       └── 01-类型系统.md
├── 02-后端/
│   ├── 01-Node/
│   │   └── 01-Express框架.md
│   └── 02-Java/
│       └── 01-Spring Boot.md
└── 03-数据库/
    └── 01-MySQL/
        └── 01-基础查询.md
```

### 3. 生成的导航效果

```
导航栏：
前端 ▼
  ├─ Vue
  ├─ React
  └─ TypeScript
后端 ▼
  ├─ Node
  └─ Java
数据库 ▼
  └─ MySQL
```

### 4. 生成的侧边栏效果

当访问 `/01-前端/01-Vue/` 时：

```
侧边栏：
Vue
  ├─ 基础知识
  ├─ 组件开发
  └─ 路由管理
```

## 两种侧边栏方式的区别

### 方式1：`generateSidebar()`
- 使用文件名作为标题
- 性能更好（不需要读取文件内容）
- 适合：文件名已经很清晰的情况

### 方式2：`generateSidebarWithTitle()`
- 使用文件内的 `# 标题` 作为显示文本
- 更灵活（标题可以和文件名不同）
- 适合：想要更友好的标题显示

## 注意事项

1. **数字前缀**：文件夹和文件名可以用 `01-`, `02-` 等前缀控制顺序，显示时会自动去掉
2. **index.md**：如果二级目录有 `index.md`，导航会链接到目录；否则链接到第一个文件
3. **忽略目录**：可以在 `IGNORE_DIRS` 中添加需要忽略的目录
4. **排序规则**：使用自然排序，支持中文、英文和数字
