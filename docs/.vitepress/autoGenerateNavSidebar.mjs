// .vitepress/autoGenerateNavSidebar.mjs
// 主入口文件 - 向后兼容，实际功能已迁移到 utils/ 目录

/**
 * 此文件保持向后兼容性
 * 所有实际功能已迁移到 utils/ 目录下的模块化结构中
 * 
 * 使用方式：
 * 1. 继续使用此文件（推荐，向后兼容）
 *    import { generateNav, generateSidebar } from './autoGenerateNavSidebar.mjs'
 * 
 * 2. 使用新的模块化入口
 *    import { generateNav, generateSidebar } from './utils/index.mjs'
 * 
 * 3. 使用具体模块
 *    import { generateNav } from './utils/nav/index.mjs'
 */

// 重新导出所有功能，保持向后兼容
export * from './utils/index.mjs'
